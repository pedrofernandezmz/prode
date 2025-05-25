import requests
import json
import os
import time

def scrap_match(id):

    url = f"https://api.promiedos.com.ar/gamecenter/{id}"

    # Get Data
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()

        # Save Data
        output_file = os.path.join("./jsons", f"{id}.json")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"Data saved in {output_file}")
    else:
        print(f"Error in {id}: {response.status_code}")

def scrap_allmatchs(n):
    
    url = f"https://api.promiedos.com.ar/league/games/hc/72_224_3_{n}"

    # Get Data
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()

        # Extract matchs IDs
        game_ids = [game["id"] for game in data.get("games", [])]

        # Save Data
        for game_id in game_ids:
            scrap_match(game_id)

    else:
        print(f"Error: {response.status_code}")


if __name__ == "__main__":
    start_time = time.time()
    id = "edbjhge"  # ID of match for testing
    # scrap_match(id)
    scrap_allmatchs(1)
    end_time = time.time()
    total_time = end_time - start_time
    print("Time:", total_time, "seconds")
