import requests
from bs4 import BeautifulSoup
import time

def scrap_numero():
    # URL de la página a scrapear
    url = "https://www.promiedos.com.ar/primera"

    # Realizar la solicitud GET a la página
    response = requests.get(url)

    # Verificar si la solicitud fue exitosa (código de estado 200)
    if response.status_code == 200:
        # Parsear el contenido HTML de la página
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Encontrar el div con id "fechmedio"
        fechmedio_div = soup.find('div', id='fechmedio')
        
        if fechmedio_div:
            # Extraer el texto del div
            texto = fechmedio_div.get_text()
            
            # Extraer solo el número del texto
            fecha_numero = ''.join(filter(str.isdigit, texto)).strip()
            return fecha_numero
        else:
            print("No se encontró el div con id 'fechmedio'")
            return None
    else:
        print("Error al acceder a la página:", response.status_code)
        return None

if __name__ == "__main__":
    start_time = time.time()
    result_n = scrap_numero()
    print("Número de Fecha:", result_n)
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")
