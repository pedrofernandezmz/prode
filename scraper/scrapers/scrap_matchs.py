import requests
import time
from pymongo import MongoClient

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Cambiar si tiene usuario/contraseña
db = client['prode_mongodb']  # Base de datos

def scrap_match(id):
    url = f"https://api.promiedos.com.ar/gamecenter/{id}"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()

        # Guardar en MongoDB: colección con el nombre del partido (id)
        collection = db[id]
        collection.replace_one({}, data, upsert=True)  # Siempre un solo documento
        print(f"Data saved/updated in MongoDB collection '{id}'")
    else:
        print(f"Error in {id}: {response.status_code}")


def scrap_allmatchs(n):
    url = f"https://api.promiedos.com.ar/league/games/hc/72_224_8_{n}"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()

        # Extraer IDs de los partidos
        game_ids = [game["id"] for game in data.get("games", [])]

        # Guardar cada partido en MongoDB
        for game_id in game_ids:
            scrap_match(game_id)
    else:
        print(f"Error: {response.status_code}")


if __name__ == "__main__":
    start_time = time.time()
    n = 1  # Número de la fecha a scrapear
    scrap_allmatchs(n)
    end_time = time.time()
    print("Time:", end_time - start_time, "seconds")
