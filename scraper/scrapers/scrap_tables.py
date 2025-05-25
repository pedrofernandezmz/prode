import requests
import json
import os
import time

def scrap_tables():
    
    url = "https://api.promiedos.com.ar/league/tables_and_fixtures/hc"

    # Get Data
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()

        # Extract "tables_groups"
        tables_groups = data.get("tables_groups", [])

        # Diccionary to save data
        categorized_data = {
            "Apertura": None,
            "Promedios 2025": None,
            "Anual": None,
            "players_statistics": data.get("players_statistics", {})
        }

        # Search keywords
        for group in tables_groups:
            if group.get("name") == "Apertura":
                categorized_data["Apertura"] = group
            else:
                for table in group.get("tables", []):
                    if table.get("name") == "Promedios 2025":
                        categorized_data["Promedios 2025"] = table
                    elif table.get("name") == "Anual":
                        categorized_data["Anual"] = table

        # Save Data in different files
        for key, value in categorized_data.items():
            if value is not None:
                output_file = os.path.join("./jsons", f"{key.lower().replace(' ', '_')}.json")
                with open(output_file, "w", encoding="utf-8") as f:
                    json.dump(value, f, ensure_ascii=False, indent=4)
            print(f"Data saved in {key}")

    else:
        print(f"Error: {response.status_code}")

if __name__ == "__main__":
    start_time = time.time()
    scrap_tables()
    end_time = time.time()
    total_time = end_time - start_time
    print("Time:", total_time, "seconds")
