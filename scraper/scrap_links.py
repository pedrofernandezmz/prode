import requests
from bs4 import BeautifulSoup
import time
# PROBAR QUE PASA SI TENGO UN GAME-INFO NULL!
def scrap_links():
    # URL de la página a scrapear
    url = "https://www.promiedos.com.ar/verfecha.php?fecha=3_14"

    # Realizar la solicitud GET a la página
    response = requests.get(url)

    # Verificar si la solicitud fue exitosa (código de estado 200)
    if response.status_code == 200:
        # Parsear el contenido HTML de la página
        soup = BeautifulSoup(response.content, "html.parser")
        
        links = [a_tag['href'] for a_tag in soup.select('td.game-info a[href]')]

        return links
    else:
        print("Error al acceder a la página:", response.status_code)
        return []

if __name__ == "__main__":
    start_time = time.time()
    result_links = scrap_links()
    print("Links encontrados:", result_links)
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")
