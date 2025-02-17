from flask import Flask, send_file, abort
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Ruta a la carpeta "jsons" que está en el mismo directorio que app.py
JSON_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'jsons')

@app.route('/get_json/<filename>', methods=['GET'])
def get_json(filename):
    # Construir la ruta completa del archivo
    file_path = os.path.join(JSON_FOLDER, filename)
    
    # Comprobar si el archivo existe y tiene extensión .json
    if os.path.exists(file_path) and filename.endswith('.json'):
        return send_file(file_path, mimetype='application/json')
    else:
        # Devolver un error 404 si el archivo no se encuentra o no es un archivo JSON
        abort(404, description="Resource not found")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
