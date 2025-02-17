import requests
from bs4 import BeautifulSoup
import csv
import time

def scrap_tablas(keyword, index, name):
    url = "https://www.promiedos.com.ar/primera"

    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        tablas = soup.find_all("table", {"id": keyword})
        # Obtener la tabla específica según el índice proporcionado
        tabla = tablas[index]
        
        # Crear un archivo CSV para escribir los datos
        with open(f"{name}.csv", "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
                
            # Obtener todas las filas de la tabla
            filas = tabla.find_all("tr")
                
            for fila in filas:
                # Obtener todas las celdas de la fila
                celdas = fila.find_all(["th", "td"])
                    
                # Escribir los datos de cada celda en el archivo CSV
                writer.writerow([celda.get_text(strip=True) for celda in celdas])
                    
        print(f"Los datos se han guardado correctamente en el archivo {name}.csv.")
    else:
        print("Error al realizar la solicitud GET.")

if __name__ == "__main__":
    start_time = time.time()
    # Palabra clave para buscar la tabla "keyword"
    
    # Índice de la tabla que quieres obtener "index" Por ejemplo, el índice 0 para la primera tabla (problema tablas posiciones)
    
    # Nombre del archivo csv "name"
    
    # Llamar a la función scrap_tablas con la palabra clave y el índice como parámetros
    # scrap_tablas(keyword, index, name)
    scrap_tablas("posiciones", 0, "posiciones")
    scrap_tablas("posiciones", 1, "posiciones_anual")
    scrap_tablas("promedios", 0, "promedios")
    scrap_tablas("promedios2", 0, "promedios_prox")
    
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")


