from flask import Flask, jsonify, abort
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['prode_mongodb']

@app.route('/get_json/<filename>', methods=['GET'])
def get_json(filename):
    # Esperamos que filename sea "currentDate" para la fecha actual
    collection_name = filename  # nombre de la colección igual al filename

    if collection_name in db.list_collection_names():
        collection = db[collection_name]
        document = collection.find_one({}, {'_id': 0})  # Excluir _id
        if document:
            return jsonify(document)
        else:
            abort(404, description="No data found in collection")
    else:
        abort(404, description="Collection not found")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
