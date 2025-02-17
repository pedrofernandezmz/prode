import requests
from bs4 import BeautifulSoup
import json
import time

def scrap_tablas():
    url = "https://www.promiedos.com.ar/primera"
    response = requests.get(url)
    keywords = ["posiciones", "posiciones", "promedios", "promedios2"]
    indices = [0, 1, 0, 0]
    names = ["posiciones", "posiciones_anual", "promedios", "promedios_prox"]
    
    if response.status_code == 200:
        scrap_est(response)
        for keyword, index, name in zip(keywords, indices, names):
            soup = BeautifulSoup(response.content, "html.parser")
            tablas = soup.find_all("table", {"id": keyword})
            tabla = tablas[index]

            data = []
            filas = tabla.find_all("tr")
            headers = [header.get_text(strip=True) for header in filas[0].find_all("th")]
            
            for fila in filas[1:]:
                celdas = fila.find_all("td")
                row = {headers[i]: celda.get_text(strip=True) for i, celda in enumerate(celdas)}
                data.append(row)
            
            with open(f"Scraper/jsons/{name}.json", "w", encoding="utf-8") as jsonfile:
                json.dump(data, jsonfile, ensure_ascii=False, indent=4)
                
            print(f"Los datos se han guardado correctamente en el archivo {name}.json.")
    else:
        print("Error al realizar la solicitud GET.")
        
def scrap_est(response):
    keywords = ["goleadorest", "goleadorest"]
    indices = [0, 1]
    names = ["goleadores", "asistencias"]
    
    for keyword, index, name in zip(keywords, indices, names):
        soup = BeautifulSoup(response.content, "html.parser")
        tablas = soup.find_all("table", {"id": keyword})
        tabla = tablas[index]

        data = []
        filas = tabla.find_all("tr")
        headers = [header.get_text(strip=True) for header in filas[0].find_all("th")]
        
        for fila in filas[1:]:
            celdas = fila.find_all("td")
            row = {headers[i]: celda.get_text(strip=True) for i, celda in enumerate(celdas)}
            # Ajustes específicos para la tabla de goleadores y asistencias
            if 'Jugador' in row:
                row['Jugador'] = ''.join([char for char in row['Jugador'] if not char.isdigit()]).replace("(  )", "").strip()
            data.append(row)

        with open(f"Scraper/jsons/{name}.json", "w", encoding="utf-8") as jsonfile:
            json.dump(data, jsonfile, ensure_ascii=False, indent=4)

        print(f"Los datos se han guardado correctamente en el archivo {name}.json.")

if __name__ == "__main__":
    start_time = time.time()
    scrap_tablas()
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")
