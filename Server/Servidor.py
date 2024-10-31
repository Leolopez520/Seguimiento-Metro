from flask import Flask, request, jsonify
import psycopg2
from flask_cors import CORS
import bcrypt
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)


# Configuración de Flask-Mail para Gmail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'erickjimenez401@gmail.com'
app.config['MAIL_PASSWORD'] = 'lfug ekah sbxt yamf'  # Contraseña de aplicación de Gmail
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False


mail = Mail(app)

# Configuración para generar tokens seguros
s = URLSafeTimedSerializer('clave_secreta')  # Cambia 'clave_secreta' por algo más seguro

# Conexión a la base de datos PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    port="5432",
    database="metrodb",
    user="postgres",
    password="metroteam_l4"
)
cursor = conn.cursor()

# Ruta para registrar un nuevo usuario
@app.route('/registro', methods=['POST'])
def registro():
    data = request.get_json()
    correo = data.get('correo')
    nombre = data.get('nombre')
    primer_apellido = data.get('primer_apellido')
    segundo_apellido = data.get('segundo_apellido')
    contraseña = data.get('contraseña')
    tipo_usuario = data.get('tipo_usuario', False)

    # Encriptar la contraseña antes de guardarla
    contraseña_encriptada = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())

    try:
        # Insertar el nuevo usuario en la tabla Usuario
        cursor.execute("""
            INSERT INTO Usuario (correo, nombre, primer_apellido, segundo_apellido, contraseña, tipo_usuario)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (correo, nombre, primer_apellido, segundo_apellido, psycopg2.Binary(contraseña_encriptada), tipo_usuario))

        conn.commit()
        print(f"Usuario registrado: {correo}")
        return jsonify({'status': 'success', 'message': 'Usuario registrado correctamente'}), 201

    except psycopg2.IntegrityError:
        conn.rollback()
        print(f"Error: el correo ya está registrado - {correo}")
        return jsonify({'status': 'error', 'message': 'El correo ya está registrado'}), 409

    except Exception as e:
        conn.rollback()
        print(f"Error en registro: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Ruta para login de usuario
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    correo = data.get('correo')
    contraseña = data.get('contraseña')

    print(f"Solicitud de login recibida para: {correo}")

    # Obtener la contraseña encriptada del usuario
    cursor.execute("""
        SELECT id_usuario, nombre, tipo_usuario, contraseña FROM Usuario
        WHERE correo = %s
    """, (correo,))

    usuario = cursor.fetchone()

    if usuario:
        hash_almacenado = bytes(usuario[3])  # Convertir el campo BYTEA a bytes

        # Verificar la contraseña con bcrypt
        if bcrypt.checkpw(contraseña.encode('utf-8'), hash_almacenado):
            print(f"Login exitoso para: {correo}")
            return jsonify({
                'status': 'success',
                'message': 'Login exitoso',
                'usuario': {
                    'id_usuario': usuario[0],
                    'nombre': usuario[1],
                    'tipo_usuario': usuario[2]
                }
            }), 200

    print(f"Login fallido para: {correo}")
    return jsonify({'status': 'error', 'message': 'Correo o contraseña incorrectos'}), 401

# Ruta para solicitar recuperación de contraseña
@app.route('/recuperar', methods=['POST'])
def solicitar_recuperacion():
    data = request.get_json()
    correo = data.get('correo')

    # Verificar si el correo existe en la base de datos
    cursor.execute("SELECT id_usuario FROM Usuario WHERE correo = %s", (correo,))
    usuario = cursor.fetchone()

    if usuario:
        token = s.dumps(correo, salt='recuperar-salt')

        # Crear el deep link para la app de React Native
        enlace_recuperacion = f'http://20.163.180.10/resetear/{token}'

        try:
            # Enviar correo de recuperación
            msg = Message(
                subject='Recuperación de contraseña',
                sender='erickjimenez401@gmail.com',  # Asegurar el remitente
                recipients=[correo]
            )

            # Usar HTML con el deep link
            cuerpo_mensaje = f'''
                <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                <p><a href="{enlace_recuperacion}" style="color: blue; text-decoration: underline;">
                {enlace_recuperacion}</a></p>
            '''

            msg.html = cuerpo_mensaje
            msg.charset = 'utf-8'  # Asegurar codificación UTF-8

            mail.send(msg)

            print(f"Correo de recuperación enviado a {correo}")
            return jsonify({'status': 'success', 'message': 'Correo de recuperación enviado'}), 200

        except Exception as e:
            print(f"Error al enviar el correo: {e}")
            return jsonify({'status': 'error', 'message': 'Error al enviar el correo'}), 500

    return jsonify({'status': 'error', 'message': 'Correo no registrado'}), 404


# Ruta para cambiar la contraseña
@app.route('/resetpassword/<token>', methods=['POST'])
def resetear_contraseña(token):
    try:
        correo = s.loads(token, salt='recuperar-salt', max_age=3600)  # Token válido por 1 hora
        data = request.get_json()
        nueva_contraseña = data.get('contraseña')

        print(f"contraseña: ${nueva_contraseña} y el token: ${token}")

        # Encriptar la nueva contraseña
        nueva_contraseña_encriptada = bcrypt.hashpw(nueva_contraseña.encode('utf-8'), bcrypt.gensalt())

        # Actualizar la contraseña en la base de datos
        cursor.execute("UPDATE Usuario SET contraseña = %s WHERE correo = %s", 
                       (psycopg2.Binary(nueva_contraseña_encriptada), correo))
        conn.commit()

        print(f"Contraseña actualizada para: {correo}")
        return jsonify({'status': 'success', 'message': 'Contraseña actualizada correctamente'}), 200

    except Exception as e:
        print(f"Error al resetear contraseña: {e}")
        return jsonify({'status': 'error', 'message': 'Token inválido o expirado'}), 400


@app.route('/ubicacion', methods=['POST'])
def recibir_ubicacion():
    data = request.get_json()
    id_convoy = data.get('id_convoy')
    latitud = data.get('latitud')
    longitud = data.get('longitud')
    timestamp = data.get('timestamp')
    ip = request.remote_addr

    cursor.execute("SELECT estatus FROM convoy WHERE id_convoy = %s", (id_convoy,))
    result = cursor.fetchone()

    if result is None:
        cursor.execute("INSERT INTO convoy (id_convoy, estatus) VALUES (%s, TRUE)", (id_convoy,))
        conn.commit()
        print(f"Convoy {id_convoy} insertado con estatus activo")
    elif result[0] is False:
        print(f"Convoy {id_convoy} inactivo, no se registra la ubicación.")
        return jsonify({'status': 'error', 'message': 'Convoy inactivo, no se registra la ubicación.'}), 403

    cursor.execute("""
        INSERT INTO ubicacion (id_convoy, punto, tiempo) 
        VALUES (%s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)
    """, (id_convoy, longitud, latitud, timestamp))

    conn.commit()
    print(f"Ubicación registrada para el convoy {id_convoy}")

    return jsonify({'status': 'success', 'message': 'Ubicación recibida y almacenada'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)