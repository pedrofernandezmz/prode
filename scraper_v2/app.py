from flask import Flask, send_file, abort
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to the "jsons" folder located in the same directory as app.py
JSON_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'jsons')

@app.route('/get_json/<filename>', methods=['GET'])
def get_json(filename):
    # Build the full path of the file
    file_path = os.path.join(JSON_FOLDER, filename)
    
    # Check if the file exists and has a .json extension
    if os.path.exists(file_path) and filename.endswith('.json'):
        return send_file(file_path, mimetype='application/json')
    else:
        # Return a 404 error if the file is not found or is not a JSON file
        abort(404, description="Resource not found")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)

