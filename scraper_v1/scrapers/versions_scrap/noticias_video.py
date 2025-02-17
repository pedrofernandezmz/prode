import requests
from bs4 import BeautifulSoup
import json

# URL de la página a scrapear
url = "https://www.tycsports.com/deportivo-riestra.html"

# Realizar la solicitud HTTP a la página
response = requests.get(url)

# Analizar el contenido HTML con BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')

# Encontrar todas las divs con las clases "card col4" y "card col6"
cards = soup.find_all('div', class_=['card', 'col4', 'col6'])

# Crear una lista para almacenar los datos extraídos
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

    # Solo agregar el elemento a la lista si todos los campos están presentes o si hay un video
    if title and link and (image or video):
        data.append({
            'titulo': title,
            'imagen': image,
            'link': link,
            'video': video  # Agregar el link del video si existe
        })

# Convertir la lista de datos a JSON
json_data = json.dumps(data, ensure_ascii=False, indent=4)

# Imprimir el JSON resultante
print(json_data)
