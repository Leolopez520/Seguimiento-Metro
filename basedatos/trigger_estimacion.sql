CREATE OR REPLACE FUNCTION actualizar_estimacion() 
RETURNS TRIGGER AS $$
DECLARE
    ultima_ubicacion RECORD;
    penultima_ubicacion RECORD;
    tiempo_diferencia INTERVAL;
    tiempo_diferencia_segundos FLOAT;
    distancia DOUBLE PRECISION;
    velocidad DOUBLE PRECISION;
BEGIN
    -- Obtener la última ubicación del convoy actual (el que generó el trigger)
    SELECT * INTO ultima_ubicacion 
    FROM ubicacion
    WHERE id_convoy = NEW.id_convoy
    ORDER BY tiempo DESC
    LIMIT 1 OFFSET 0;
    
    -- Obtener la ubicación anterior del convoy actual
    SELECT * INTO penultima_ubicacion 
    FROM ubicacion
    WHERE id_convoy = NEW.id_convoy
    ORDER BY tiempo DESC
    LIMIT 1 OFFSET 1;
    
    -- Asegurarse de que hay al menos dos ubicaciones para hacer el cálculo
    IF penultima_ubicacion IS NOT NULL THEN
    
        -- Convertir los puntos de Geometry a Geography para calcular la distancia en metros
        distancia := ST_Distance(
            ultima_ubicacion.punto::geography,
            penultima_ubicacion.punto::geography
        );
        
        -- Calcular la diferencia de tiempo
        tiempo_diferencia := ultima_ubicacion.tiempo - penultima_ubicacion.tiempo;
        tiempo_diferencia_segundos := EXTRACT(EPOCH FROM tiempo_diferencia);
        
        -- Calcular la velocidad (m/s), evitando la división por cero
        IF tiempo_diferencia_segundos > 0 THEN
            velocidad := distancia / tiempo_diferencia_segundos;
        ELSE
            velocidad := 0;  -- Evita división por cero
        END IF;
        
        -- Verificar si la velocidad excede el umbral de 22.22 m/s
        IF velocidad > 22.22 THEN
            -- Eliminar el registro de la tabla `ubicacion`
            DELETE FROM ubicacion WHERE id_ubi = ultima_ubicacion.id_ubi;
        ELSE
            -- Insertar los datos en la tabla de Estimación si la velocidad es aceptable
            INSERT INTO estimacion (
                tiempo_inicio,
                tiempo_fin,
                distancia_metros,
                velocidad_media,
                id_ubi
            ) VALUES (
                penultima_ubicacion.tiempo,
                ultima_ubicacion.tiempo,
                distancia,
                velocidad,
                ultima_ubicacion.id_ubi
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el Trigger en la tabla Ubicación
CREATE TRIGGER trigger_actualizar_estimacion
AFTER INSERT ON ubicacion
FOR EACH ROW
EXECUTE FUNCTION actualizar_estimacion();