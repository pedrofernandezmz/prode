import requests
from bs4 import BeautifulSoup
import csv
import time

def scrap_tablas():
    url = "https://www.promiedos.com.ar/primera"
    response = requests.get(url)
    keywords = ["goleadorest", "goleadorest"]
    indices = [0, 1]
    names = ["goleadores", "asistencias"]
    
    if response.status_code == 200:
        for keyword, index, name in zip(keywords, indices, names):
            soup = BeautifulSoup(response.content, "html.parser")
            tablas = soup.find_all("table", {"id": keyword})
            tabla = tablas[index]

            with open(f"{name}.csv", "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.writer(csvfile)
                filas = tabla.find_all("tr")
                
                for fila in filas:
                    celdas = fila.find_all(["th", "td"])
                    filtered_celdas = []
                    for i, celda in enumerate(celdas):
                        texto = celda.get_text(strip=True)
                        if i == 0:  # Supone que la columna "jugador" es la primera
                            # Eliminar valores numéricos
                            texto = ''.join([char for char in texto if not char.isdigit()])
                            # Eliminar paréntesis y su contenido
                            texto = texto.replace("(  )", "").strip()
                        filtered_celdas.append(texto)
                    writer.writerow(filtered_celdas)

            print(f"Los datos se han guardado correctamente en el archivo {name}.csv.")
    else:
        print("Error al realizar la solicitud GET.")

if __name__ == "__main__":
    start_time = time.time()
    scrap_tablas()
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")
