import requests
import json
import time
from datetime import datetime, timedelta
from pymongo import MongoClient

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Cambiar si tiene usuario/contraseña
db = client['prode_mongodb']  # Base de datos

def scrap_currentdate():
    url = "https://api.promiedos.com.ar/league/tables_and_fixtures/hc"

    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return

    data = response.json()

    filters = data.get("games", {}).get("filters", [])

    selected_date = next((f for f in filters if isinstance(f, dict) and f.get("selected") == True), None)
    if not selected_date:
        print("Selected date not found.")
        return

    games = selected_date.get("games", [])
    if not games:
        print("No games found on selected date.")
        return

    first_game = games[0]
    last_game = games[-1]

    stage_round_name = first_game.get("stage_round_name", "Fecha")
    start_time_first = first_game.get("start_time")
    start_time_last = last_game.get("start_time")

    def parse_date(date_str):
        return datetime.strptime(date_str, "%d-%m-%Y %H:%M")

    date_begin = parse_date(start_time_first)
    date_end = parse_date(start_time_last) + timedelta(hours=2)

    result = {
        "name": stage_round_name,
        "number": int(''.join(filter(str.isdigit, stage_round_name))),
        "date_begin": date_begin.isoformat() + ".000Z",
        "date_end": date_end.isoformat() + ".000Z"
    }

    # Guardar en MongoDB en la colección 'currentDate', reemplazando el documento anterior
    collection = db['currentDate']
    collection.replace_one({}, result, upsert=True)  # Siempre un solo documento
    print("Data saved/updated in MongoDB collection 'currentDate'")

if __name__ == "__main__":
    start_time = time.time()
    scrap_currentdate()
    end_time = time.time()
    print("Time:", end_time - start_time, "seconds")
