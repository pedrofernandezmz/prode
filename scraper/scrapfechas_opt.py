# import requests
# from bs4 import BeautifulSoup
# import csv
# import time

# def scrap_tabla_verfecha():
#     for i in range(1, 28):
#         url = f"https://www.promiedos.com.ar/verfecha.php?fecha={i}_14"

#         response = requests.get(url)

#         if response.status_code == 200:
#             soup = BeautifulSoup(response.content, "html.parser")
#             tabla = soup.find("table", cellspacing="0")

#             if tabla:
#                 # Crear un archivo CSV para escribir los datos
#                 with open(f"verfecha{i}.csv", "w", newline="", encoding="utf-8") as csvfile:
#                     writer = csv.writer(csvfile)
                    
#                     # Obtener todas las filas de la tabla
#                     filas = tabla.find_all("tr")
                    
#                     for fila in filas:
#                         # Obtener todas las celdas de la fila
#                         celdas = fila.find_all(["th", "td"])
                        
#                         # Escribir los datos de cada celda en el archivo CSV
#                         writer.writerow([celda.get_text(strip=True) for celda in celdas])
                        
#                 print(f"Los datos se han guardado correctamente en el archivo verfecha{i}.csv.")
#             else:
#                 print(f"No se encontró ninguna tabla con el atributo cellspacing=\"0\" en la página {url}.")
#         else:
#             print(f"Error al realizar la solicitud GET en la página {url}.")

# if __name__ == "__main__":
#     start_time = time.time()
#     scrap_tabla_verfecha()
#     end_time = time.time()
#     total_time = end_time - start_time
#     print("Tiempo total de ejecución:", total_time, "segundos")

import requests
from bs4 import BeautifulSoup
import csv
import time
from concurrent.futures import ThreadPoolExecutor

def scrap_tabla_verfecha(i):
    url = f"https://www.promiedos.com.ar/verfecha.php?fecha={i}_14"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        tabla = soup.find("table", cellspacing="0")

        if tabla:
            # Crear un archivo CSV para escribir los datos
            with open(f"verfecha{i}.csv", "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.writer(csvfile)
                
                # Obtener todas las filas de la tabla
                filas = tabla.find_all("tr")
                
                for fila in filas:
                    # Obtener todas las celdas de la fila
                    celdas = fila.find_all(["th", "td"])
                    
                    # Escribir los datos de cada celda en el archivo CSV
                    writer.writerow([celda.get_text(strip=True) for celda in celdas])
                    
            print(f"Los datos se han guardado correctamente en el archivo verfecha{i}.csv.")
        else:
            print(f"No se encontró ninguna tabla con el atributo cellspacing=\"0\" en la página {url}.")
    else:
        print(f"Error al realizar la solicitud GET en la página {url}.")

if __name__ == "__main__":
    start_time = time.time()
    with ThreadPoolExecutor(max_workers=20) as executor:
        executor.map(scrap_tabla_verfecha, range(1, 28))
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")
