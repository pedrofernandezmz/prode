import requests
from bs4 import BeautifulSoup
import json

def scrap_incidencias(soup, n):
    
    formacion_table = soup.find("table", {"id": "formacion" + str(n)})
    
    if not formacion_table:
        return "No se encontró la tabla con id formacion1"
    
    # Inicializar las variables para almacenar los datos
    goles = ""
    amarillas = ""
    rojas = ""
    cambios = ""

    # Encontrar las filas de la tabla
    filas = formacion_table.find_all("tr")
    
    for fila in filas:
        # Goles
        if fila.find("td", class_="incidencias1") and "GOLES" in fila.get_text():
            goles = fila.find_next_sibling("tr").find("td", class_="incidencias2").get_text(strip=True)
        
        # Amarillas
        if fila.find("td", class_="amarillas") and "AMARILLAS" in fila.get_text():
            amarillas = fila.find_next_sibling("tr").find("td", class_="incidencias2").get_text(strip=True)
        
        # Rojas
        if fila.find("td", class_="rojas") and "ROJAS" in fila.get_text():
            rojas = fila.find_next_sibling("tr").find("td", class_="incidencias2").get_text(strip=True)
        
        # Cambios
        if fila.find("td", class_="cambios") and "CAMBIOS" in fila.get_text():
            cambios = fila.find_next_sibling("tr").find("td", class_="incidencias2").get_text(strip=True)
    
    # Crear el diccionario con los resultados
    informacion = {
        "Goles": goles,
        "Amarillas": amarillas,
        "Rojas": rojas,
        "Cambios": cambios
    }
    
    return informacion

if __name__ == "__main__":
    url = "https://www.promiedos.com.ar/ficha=xjpnxjsktrdy&c=14&v=3QWpQ764ToE"
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"Error al realizar la solicitud GET. Status code: {response.status_code}")
    soup = BeautifulSoup(response.content, "html.parser")
    informacion = scrap_incidencias(soup, 2)
    print(json.dumps(informacion, ensure_ascii=False, indent=4))
