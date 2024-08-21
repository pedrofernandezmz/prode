import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urlparse
import time

def scrap_noticias():
    import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urlparse

# Lista de URLs a scrapear
urls = [
    "https://www.tycsports.com/argentinos-juniors.html",
    "https://www.tycsports.com/atletico-tucuman.html",
    "https://www.tycsports.com/banfield.html",
    "https://www.tycsports.com/barracas-central.html",
    "https://www.tycsports.com/belgrano-de-cordoba.html",
    "https://www.tycsports.com/boca-juniors.html",
    "https://www.tycsports.com/central-cordoba-de-santiago-del-estero.html",
    "https://www.tycsports.com/defensa-y-justicia.html",
    "https://www.tycsports.com/deportivo-riestra.html",
    "https://www.tycsports.com/estudiantes-la-plata.html",
    "https://www.tycsports.com/gimnasia-la-plata.html",
    "https://www.tycsports.com/godoy-cruz.html",
    "https://www.tycsports.com/huracan.html",
    "https://www.tycsports.com/independiente.html",
    "https://www.tycsports.com/independiente-rivadavia.html",
    "https://www.tycsports.com/instituto.html",
    "https://www.tycsports.com/lanus.html",
    "https://www.tycsports.com/newells.html",
    "https://www.tycsports.com/platense.html",
    "https://www.tycsports.com/racing-club.html",
    "https://www.tycsports.com/river-plate.html",
    "https://www.tycsports.com/rosario-central.html",
    "https://www.tycsports.com/san-lorenzo.html",
    "https://www.tycsports.com/sarmiento-junin.html",
    "https://www.tycsports.com/talleres-cordoba.html",
    "https://www.tycsports.com/tigre.html",
    "https://www.tycsports.com/union.html",
    "https://www.tycsports.com/velez.html"
]

# Crear un diccionario para almacenar los datos agrupados por cada URL
all_data = {}
general_data = []

# Iterar sobre cada URL
for url in urls:
    # Extraer el nombre del equipo de la URL para usarlo como clave en el diccionario
    path = urlparse(url).path
    key = path.split('/')[1].replace('.html', '')
    
    # Realizar la solicitud HTTP a la página
    response = requests.get(url)
    
    # Analizar el contenido HTML con BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Encontrar todas las divs con las clases "card col4" y "card col6"
    cards = soup.find_all('div', class_=['card', 'col4', 'col6'])
    
    # Crear una lista para almacenar los datos extraídos de la URL actual
    data = []
    
    # Iterar sobre las tarjetas y extraer los datos
    for card in cards:
        # Extraer el título
        title_tag = card.find('h2', class_='cardTitle')
        title = title_tag.get_text(strip=True) if title_tag else None
        
        # Extraer la URL de la noticia
        link_tag = card.find('a')
        link = "https://www.tycsports.com" + link_tag['href'] if link_tag else None
        
        # Extraer la URL de la imagen, manejando el caso donde 'data-src' podría no existir
        img_tag = card.find('img')
        image = img_tag.get('data-src') if img_tag else None

        # Extraer la URL del video si existe
        video = card.get('data-thumbvideo')
        
        # Solo agregar el elemento a la lista si todos los campos están presentes
        if title and link and (image or video):
            news_item = {
                'titulo': title,
                'imagen': image,
                'link': link,
                'video': video  # Agregar el link del video si existe
            }
            data.append(news_item)
    
    # Agregar los datos al diccionario bajo la clave correspondiente
    if data:
        all_data[key] = data
        # Añadir solo la primera noticia de cada equipo a la lista de datos generales
        general_data.append(data[0])

# Guardar los datos en archivos JSON separados por equipo
for key, data in all_data.items():
    with open(f'Scraper/jsons/news_{key}.json', 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"Datos guardados en '{key}.json'")

# Guardar los datos generales en un archivo JSON
with open('Scraper/jsons/news.json', 'w', encoding='utf-8') as json_file:
    json.dump(general_data, json_file, ensure_ascii=False, indent=4)

print("Datos generales guardados en 'noticias_generales.json'")

if __name__ == "__main__":
    start_time = time.time()
    scrap_noticias()
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")