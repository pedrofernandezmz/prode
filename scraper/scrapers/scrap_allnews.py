import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import time
from pymongo import MongoClient

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Cambiar si tiene usuario/contraseña
db = client['prode_mongodb']  # Base de datos

def scrap_news():

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

    all_data = {}
    general_data = []

    for url in urls:
        path = urlparse(url).path
        key = path.split('/')[1].replace('.html', '')

        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        cards = soup.find_all('div', class_=['card', 'col4', 'col6'])
        data = []

        for card in cards:
            title_tag = card.find('h2', class_='cardTitle')
            title = title_tag.get_text(strip=True) if title_tag else None

            link_tag = card.find('a')
            link = "https://www.tycsports.com" + link_tag['href'] if link_tag else None

            img_tag = card.find('img')
            image = img_tag.get('data-src') if img_tag else None

            video = card.get('data-thumbvideo')

            if title and link and (image or video):
                news_item = {
                    'title': title,
                    'image': image,
                    'link': link,
                    'video': video
                }
                data.append(news_item)

        if data:
            all_data[key] = data
            general_data.append(data[0])

            # Guardar en MongoDB: un solo documento por colección
            collection = db[f'news_{key}']
            collection.replace_one({}, {'news': data}, upsert=True)
            print(f"Data saved/updated in MongoDB collection 'news_{key}'")

    # Guardar noticias generales
    general_collection = db['news_general']
    general_collection.replace_one({}, {'news': general_data}, upsert=True)
    print("Data saved/updated in MongoDB collection 'news_general'")

if __name__ == "__main__":
    start_time = time.time()
    scrap_news()
    end_time = time.time()
    print("Time:", end_time - start_time, "seconds")
