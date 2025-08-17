import requests
import time
from pymongo import MongoClient

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Cambiar si tiene usuario/contraseña
db = client['prode_mongodb']  # Base de datos

def scrap_tables():
    
    url = "https://api.promiedos.com.ar/league/tables_and_fixtures/hc"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()

        tables_groups = data.get("tables_groups", [])

        categorized_data = {
            "apertura": None,
            "clausura": None,
            "promedios_2025": None,
            "anual": None,
            "players_statistics": data.get("players_statistics", {})
        }

        for group in tables_groups:
            group_name = group.get("name", "")
            if group_name == "Apertura":
                categorized_data["apertura"] = group
            elif group_name == "Clausura":
                categorized_data["clausura"] = group
            else:
                for table in group.get("tables", []):
                    if table.get("name") == "Promedios 2025":
                        categorized_data["promedios_2025"] = table
                    elif table.get("name") == "Anual":
                        categorized_data["anual"] = table

        # Guardar cada tabla en MongoDB
        for key, value in categorized_data.items():
            if value is not None:
                collection = db[key]
                collection.replace_one({}, value, upsert=True)  # Siempre un solo documento
                print(f"Data saved/updated in MongoDB collection '{key}'")

    else:
        print(f"Error: {response.status_code}")


if __name__ == "__main__":
    start_time = time.time()
    scrap_tables()
    end_time = time.time()
    print("Time:", end_time - start_time, "seconds")
