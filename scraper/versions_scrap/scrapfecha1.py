# import requests
# from bs4 import BeautifulSoup

# # URL de la página a scrapear
# url = "https://www.promiedos.com.ar/verfecha.php?fecha=1_14"

# # Realizar la solicitud GET a la página
# response = requests.get(url)

# # Verificar si la solicitud fue exitosa (código de estado 200)
# if response.status_code == 200:
#     # Parsear el contenido HTML de la página
#     soup = BeautifulSoup(response.content, "html.parser")
    
#     # Encontrar todos los elementos <td> con la clase "game-time" VER GOLES CON G1 G2 ETC....
#     game_time_elements = soup.find_all("td", class_="game-r1")
    
#     # Mostrar los resultados
#     for game_time_element in game_time_elements:
#         print(game_time_element.text.strip())
# else:
#     print("Error al acceder a la página:", response.status_code)
    
# import requests
# from bs4 import BeautifulSoup

# # URL de la página a scrapear
# url = "https://www.promiedos.com.ar/verfecha.php?fecha=1_14"

# # Realizar la solicitud GET a la página
# response = requests.get(url)

# # Verificar si la solicitud fue exitosa (código de estado 200)
# if response.status_code == 200:
#     # Parsear el contenido HTML de la página
#     soup = BeautifulSoup(response.content, "html.parser")
    
#     # Encontrar todos los elementos <td> con la clase "game-time"
#     game_time_elements = soup.find_all("tr", class_="goles")
    
#     # Mostrar los resultados
#     for game_time_element in game_time_elements:
#         print(game_time_element.text.strip())
# else:
#     print("Error al acceder a la página:", response.status_code)

import requests
from bs4 import BeautifulSoup
import re

# URL de la página a scrapear
url = "https://www.promiedos.com.ar/verfecha.php?fecha=1_14"

# Realizar la solicitud GET a la página
response = requests.get(url)

# Verificar si la solicitud fue exitosa (código de estado 200)
if response.status_code == 200:
    # Parsear el contenido HTML de la página
    soup = BeautifulSoup(response.content, "html.parser")
    
    id_pattern = re.compile("^g1_")
    
    # Encontrar todos los elementos <td> con la clase "game-time" VER GOLES CON G1 G2 ETC....
    game_time_elements = soup.find_all("td", id=id_pattern)
    
    # Mostrar los resultados
    for game_time_element in game_time_elements:
        print(game_time_element.text.strip())
else:
    print("Error al acceder a la página:", response.status_code)


# import requests
# from bs4 import BeautifulSoup

# # URL de la página a scrapear
# url = "https://www.promiedos.com.ar/primera"

# # Realizar la solicitud GET a la página
# response = requests.get(url)

# # Verificar si la solicitud fue exitosa (código de estado 200)
# if response.status_code == 200:
#     # Parsear el contenido HTML de la página
#     soup = BeautifulSoup(response.content, "html.parser")
    
#     # Encontrar el elemento con el ID 'ti_1_16'
#     ti_1_16_element = soup.find(id="ti_1_16")
#     game_time_elements = soup.find_all("td", class_="game-t1")
    
#     for game_time_element in game_time_elements:
#          print(game_time_element.text.strip())
    
#     # Imprimir el contenido del elemento
#     if ti_1_16_element:
#         print(ti_1_16_element)
#     else:
#         print("No se encontró el elemento con el ID 'ti_1_16'")
# else:
#     print("Error al acceder a la página:", response.status_code)



