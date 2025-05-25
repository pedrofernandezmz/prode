import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urlparse
import time

def scrap_news():

    # URLs list to scrap
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

    # Diccionary to save url data
    all_data = {}
    general_data = []

    for url in urls:
        # Extract team name
        path = urlparse(url).path
        key = path.split('/')[1].replace('.html', '')
        
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find classes "card col4" y "card col6"
        cards = soup.find_all('div', class_=['card', 'col4', 'col6'])
        
        # Save Data
        data = []
        
        # Extract data from the cards
        for card in cards:
            # Title
            title_tag = card.find('h2', class_='cardTitle')
            title = title_tag.get_text(strip=True) if title_tag else None
            
            # URL
            link_tag = card.find('a')
            link = "https://www.tycsports.com" + link_tag['href'] if link_tag else None
            
            # Image
            img_tag = card.find('img')
            image = img_tag.get('data-src') if img_tag else None

            # Video
            video = card.get('data-thumbvideo')
            
            if title and link and (image or video):
                news_item = {
                    'title': title,
                    'image': image,
                    'link': link,
                    'video': video
                }
                data.append(news_item)
        
        # Save all data
        if data:
            all_data[key] = data
            # Save the first element to make the general news file
            general_data.append(data[0])

    # Save news for every team
    for key, data in all_data.items():
        with open(f'./jsons/news_{key}.json', 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, ensure_ascii=False, indent=4)
        print(f"Data saved in '{key}.json'")

    # Save general news
    with open('./jsons/news.json', 'w', encoding='utf-8') as json_file:
        json.dump(general_data, json_file, ensure_ascii=False, indent=4)

    print("Data saved in 'news.json'")

if __name__ == "__main__":
    start_time = time.time()
    scrap_news()
    end_time = time.time()
    total_time = end_time - start_time
    print("Time:", total_time, "seconds")