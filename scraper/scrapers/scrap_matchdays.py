import requests
import time
from pymongo import MongoClient

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Cambiar si tiene usuario/contraseña
db = client['prode_mongodb']  # Base de datos

def scrap_matchday(n):
    
    url = f"https://api.promiedos.com.ar/league/games/hc/72_224_8_{n}"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()

        # Guardar en MongoDB: colección "fecha_<n>", un solo documento
        collection_name = f"fecha_{n}"
        collection = db[collection_name]
        collection.replace_one({}, data, upsert=True)  # Siempre un solo documento
        print(f"Data saved/updated in MongoDB collection '{collection_name}'")
    else:
        print(f"Error: {response.status_code}")


if __name__ == "__main__":
    start_time = time.time()
    n = 9  # Número de la fecha a scrapear
    scrap_matchday(n)
    end_time = time.time()
    print("Time:", end_time - start_time, "seconds")
