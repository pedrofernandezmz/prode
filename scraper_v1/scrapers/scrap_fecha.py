import requests
from bs4 import BeautifulSoup
import re
import json
import time
from teams_mapping import teams_mapping

def scrap_fechas(n):
    # URL de la página a scrapear
    url = f"https://www.promiedos.com.ar/verfecha.php?fecha={n}_14"

    # Realizar la solicitud GET a la página
    response = requests.get(url)

    # Verificar si la solicitud fue exitosa (código de estado 200)
    if response.status_code == 200:
        # Parsear el contenido HTML de la página
        soup = BeautifulSoup(response.content, "html.parser")

        # Obtener el arreglo de días desde la función scrap_days
        days_array = scrap_days(soup)

        # Obtener el arreglo de links desde la función scrap_links
        game_info_array = scrap_links(soup)
        
        game_day = soup.find_all("tr", class_="diapart")
        
        id_time = re.compile("^ti_")
        game_time = soup.find_all("td", id=id_time)
        
        id_team1 = re.compile("^t1_")
        game_team1 = soup.find_all("span", id=id_team1)
        
        id_result1 = re.compile("^r1_")
        game_result1 = soup.find_all("span", id=id_result1)
        
        id_team2 = re.compile("^t2_")
        game_team2 = soup.find_all("span", id=id_team2)
        
        id_result2 = re.compile("^r2_")
        game_result2 = soup.find_all("span", id=id_result2)
        
        id_goals1 = re.compile("^g1_")
        game_goals1 = soup.find_all("td", id=id_goals1)
        
        id_goals2 = re.compile("^g2_")
        game_goals2 = soup.find_all("td", id=id_goals2)
        
        # Obtener las imágenes de los equipos
        team_images = get_team_images(soup)
        
        # Repetir cada elemento de game_days según el valor correspondiente en days_array
        repeated_game_days = []
        for day, count in zip(game_day, days_array):
            repeated_game_days.extend([day] * count)
        
        # Crear una lista para almacenar los datos
        data_list = []

        # Escribir los datos en cada fila
        for i, data_all in enumerate(zip(repeated_game_days, game_time, game_team1, game_team2, game_result1, game_result2, game_goals1, game_goals2)):
            row = [data.get_text(strip=True).replace("'", "' ").replace(";", "; ") for data in data_all]
            # Añadir el elemento correspondiente de game-info
            row.append(game_info_array[i])
            
            # Obtener las imágenes de los equipos
            team1_image = team_images.get(row[2], "")  # Obtener imagen para el equipo 1
            team2_image = team_images.get(row[3], "")  # Obtener imagen para el equipo 2

            # Crear un diccionario con los datos de la fila, incluyendo las imágenes
            row_dict = {
                "Dia": row[0],
                "Tiempo": row[1],
                "Equipo1": row[2],
                "Equipo2": row[3],
                "Imagen1": team1_image,  # Añadir la imagen del equipo 1
                "Imagen2": team2_image,  # Añadir la imagen del equipo 2
                "Resultado1": row[4],
                "Resultado2": row[5],
                "Goles1": row[6],
                "Goles2": row[7],
                "Game-info": row[8]
            }
            # Añadir el diccionario a la lista
            data_list.append(row_dict)
        
        # Guardar los datos en un archivo JSON
        with open(f"./jsons/fecha_{n}.json", "w", encoding="utf-8") as jsonfile:
            json.dump(data_list, jsonfile, ensure_ascii=False, indent=4)
        
        print(f"Los datos se han guardado correctamente en el archivo fecha_{n}.json.")
        
    else:
        print("Error al acceder a la página:", response.status_code)
        
def get_team_images(soup):
    """ Función para obtener las imágenes de los equipos en la clase 'game-t1' """
    team_images = {}
    game_t1_elements = soup.find_all('td', class_='game-t1')
    
    for element in game_t1_elements:
        img_tag = element.find('img')  # Buscar la etiqueta <img> dentro de cada 'game-t1'
        if img_tag and 'src' in img_tag.attrs:  # Verificar que haya un atributo 'src'
            img_src = img_tag['src']  # Obtener el valor del atributo 'src'
            team_name = element.find_next('span', class_='datoequipo')  # Buscar el nombre del equipo
            if team_name:
                # Extraer el número de la imagen
                team_number = int(img_src.split("/")[-1].split(".")[0])
                
                # Usar el mapeo para obtener el nombre del equipo
                team_image_name = teams_mapping.get(team_number, "desconocido")  # "desconocido" si no se encuentra el número
                
                # Guardar el nombre del equipo en lugar del número
                team_images[team_name.get_text(strip=True)] = team_image_name
    
    return team_images

def scrap_days(soup):
    filas = soup.find_all('tr')
    
    # Inicializar variables
    cantidad_game_info_entre_diapart = 0
    ultimo_diapart = None
    resultados = []

    # Iterar sobre las filas
    for fila in filas:
        # Verificar si es un elemento diapart
        if 'diapart' in fila.get('class', []):
            # Si ya hemos encontrado al menos un diapart, agregar la cantidad de game-info a los resultados
            if ultimo_diapart is not None:
                resultados.append(cantidad_game_info_entre_diapart)
                # Reiniciar el contador para los elementos 'game-info' entre diaparts
                cantidad_game_info_entre_diapart = 0
            
            # Actualizar el último diapart encontrado
            ultimo_diapart = fila
        elif fila.find(class_='game-info'):
            # Contar los elementos 'game-info' después del último 'diapart'
            if ultimo_diapart is not None:
                cantidad_game_info_entre_diapart += 1

    # Agregar la cantidad de game-info después del último diapart si existe
    if ultimo_diapart is not None:
        resultados.append(cantidad_game_info_entre_diapart)

    return resultados

def scrap_links(soup):
    game_info_elements = soup.select('td.game-info')

    links = []
    
    for element in game_info_elements:
        # Intentar obtener el enlace en el elemento 'game-info'
        a_tag = element.find('a', href=True)
        if a_tag:
            links.append(a_tag['href'])
        else:
            links.append("")  # Añadir una cadena vacía si no hay enlace
    links.pop(0)
    return links

if __name__ == "__main__":
    start_time = time.time()
    n = 9  # Número de fecha a scrapear
    scrap_fechas(n)
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")
