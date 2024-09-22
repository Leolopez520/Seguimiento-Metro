from flask import Flask, request

app = Flask(__name__)

@app.route('/ubicacion', methods=['POST'])
def recibir_ubicacion():
    data = request.get_json()
    print(data)  # Imprime la ubicación en la consola
    return 'Ubicación recibida', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Escucha en todas las interfaces
