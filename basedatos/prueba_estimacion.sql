DO $$
DECLARE
    convoy_id VARCHAR(255);
    actual_ubi RECORD;
    anterior_ubi RECORD;
    distancia DOUBLE PRECISION;
    tiempo_diff INTERVAL;
    tiempo_diff_segundos FLOAT;
    velocidad_media DOUBLE PRECISION;
    ubi_cursor CURSOR FOR
        SELECT * FROM ubicacion
        WHERE id_convoy = convoy_id
        ORDER BY tiempo DESC;
BEGIN
    -- Iterar sobre cada convoy en la tabla `Convoy`
    FOR convoy_id IN
        SELECT id_convoy FROM convoy
    LOOP
        -- Abrir el cursor para el convoy actual
        OPEN ubi_cursor;

        -- Obtener la primera ubicación para iniciar el bucle
        FETCH ubi_cursor INTO anterior_ubi;

        -- Iterar sobre cada ubicación, usando un cursor para pares consecutivos
        LOOP
            FETCH ubi_cursor INTO actual_ubi;
            EXIT WHEN NOT FOUND;
        
            -- Calcular la distancia en metros (de geometry a geography)
            distancia := ST_Distance(actual_ubi.punto::geography, anterior_ubi.punto::geography);


            -- Calcular la diferencia de tiempo en segundos
            tiempo_diff := anterior_ubi.tiempo - actual_ubi.tiempo;
            tiempo_diff_segundos := EXTRACT(EPOCH FROM tiempo_diff);

            -- Evitar división por cero
            IF tiempo_diff_segundos > 0 THEN
                velocidad_media := distancia / tiempo_diff_segundos;
            ELSE
                velocidad_media := 0;
            END IF;

            -- Verificar si la distancia es mayor a 22.22m/s (velocidad máxima de un metro) corrige puntos que se salen de la línea
            IF velocidad_media > 22.22 THEN
                -- Eliminar el registro de la tabla `ubicacion`
                DELETE FROM ubicacion WHERE id_ubi = actual_ubi.id_ubi;
            ELSE
                -- Verificar si ya existe una estimación para esta ubicación para evitar duplicados
                IF NOT EXISTS (
                    SELECT 1 FROM estimacion
                    WHERE id_ubi = actual_ubi.id_ubi
                ) THEN
                    -- Insertar la estimación en la tabla `Estimación`
                    INSERT INTO estimacion (tiempo_inicio, tiempo_fin, distancia_metros, velocidad_media, id_ubi)
                    VALUES (anterior_ubi.tiempo, actual_ubi.tiempo, distancia, velocidad_media, actual_ubi.id_ubi);
                END IF;
            END IF;

            -- Avanzar la ubicación anterior al actual
            anterior_ubi := actual_ubi;
        END LOOP;

        --Cerrar el cursor
        CLOSE ubi_cursor;
    END LOOP;
END $$;