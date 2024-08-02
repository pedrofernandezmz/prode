from bs4 import BeautifulSoup
import requests
import re

url = "https://www.promiedos.com.ar/verfecha.php?fecha=1_14"
html_data = requests.get(url)

# Analizamos el HTML
soup = BeautifulSoup(html_data.content, 'html.parser')

# Encontramos el primer elemento tr con class="diapart"
first_diapart = soup.find('tr', class_='diapart')

# Contador para contar el número de veces que encontramos td con id="id_time"
count_id_time = 0

# Iteramos sobre los siguientes elementos hermanos hasta encontrar otro tr con class="diapart"
next_sibling = first_diapart
id_time = re.compile("^ti_")
while next_sibling:
    # Buscamos td con id="id_time" dentro del tr actual
    id_time_td = next_sibling.find("td", id=id_time)
    if id_time_td:
        count_id_time += 1
    
    # Pasamos al siguiente elemento hermano
    next_sibling = next_sibling.find_next_sibling()
    
    # Verificamos si el siguiente elemento es un tr con class="diapart"
    if next_sibling and next_sibling.name == 'tr' and 'diapart' in next_sibling.get('class', []):
        break

# Imprimimos el resultado
print("Número de veces que se encontró td con id='id_time':", count_id_time)


from bs4 import BeautifulSoup
import requests
import re

url = "https://www.promiedos.com.ar/verfecha.php?fecha=1_14"
html_data = requests.get(url)

# Analizamos el HTML
soup = BeautifulSoup(html_data.content, 'html.parser')

# Buscamos todos los elementos tr con class="diapart"
diapart_elements = soup.find_all('tr', class_='diapart')

# Iteramos sobre todos los elementos tr con class="diapart"
for diapart in diapart_elements:
    # Contamos el número de partidos en este día
    count_id_time = 0
    
    # Buscamos todos los elementos td con id="id_time" dentro del tr actual
    id_time_tds = diapart.find_all("td", id=re.compile("^ti_"))
    
    # Incrementamos el contador por cada td encontrado
    count_id_time += len(id_time_tds)
    
    # Imprimimos el resultado para este día
    print("Número de partidos para el día", diapart.text.strip(), ":", count_id_time)

# FUNCIONA A MEDIAS
from bs4 import BeautifulSoup
import requests
import re

url = "https://www.promiedos.com.ar/verfecha.php?fecha=2_14"
html_data = requests.get(url)

soup = BeautifulSoup(html_data.content, 'html.parser')

# Encontramos todos los elementos tr con class="diapart"
diapart_elements = soup.find_all('tr', class_='diapart')

# Iteramos sobre los elementos diapart
for index, diapart in enumerate(diapart_elements, start=1):
    # Contador para contar el número de veces que encontramos td con id="id_time"
    count_id_time = 0
    
    # Iteramos sobre los siguientes elementos hermanos hasta encontrar otro tr con class="diapart"
    next_sibling = diapart.find_next_sibling()
    id_time = re.compile("^ti_")
    while next_sibling:
        # Buscamos td con id="id_time" dentro del tr actual
        id_time_td = next_sibling.find("td", class_='game-info')
        if id_time_td:
            count_id_time += 1
        
        # Pasamos al siguiente elemento hermano
        next_sibling = next_sibling.find_next_sibling()
        
        # Verificamos si el siguiente elemento es un tr con class="diapart"
        if next_sibling and next_sibling.name == 'tr' and 'diapart' in next_sibling.get('class', []):
            break
    
    # Imprimimos el resultado para cada conjunto de elementos diapart
    print(f"Día {index}: Número de veces que se encontró: {count_id_time}")
    

from bs4 import BeautifulSoup
import requests
import re

url = "https://www.promiedos.com.ar/verfecha.php?fecha=1_14"
html_data = requests.get(url)

# Analizamos el HTML
soup = BeautifulSoup(html_data.content, 'html.parser')

# Encontramos todos los elementos tr con class="diapart"
diapart_elements = soup.find_all('tr', class_='diapart')

# Iteramos sobre los elementos diapart
for index, diapart in enumerate(diapart_elements, start=1):
    # Contador para contar el número de veces que encontramos td con id="id_time"
    count_id_time = 0
    
    # Buscamos el primer elemento hermano después del tr actual
    next_sibling = diapart.find_next_sibling()
    
    # Iteramos sobre los elementos hermanos hasta encontrar otro tr con class="diapart"
    id_time = re.compile("^ti_")
    while next_sibling and ('diapart' not in next_sibling.get('class', [])):
        # Buscamos td con id="id_time" dentro del elemento hermano actual
        id_time_td = next_sibling.find("td", id=id_time)
        if id_time_td:
            count_id_time += 1
        
        # Pasamos al siguiente elemento hermano
        next_sibling = next_sibling.find_next_sibling()
    
    # Imprimimos el resultado para cada conjunto de elementos diapart
    print(f"Día {index}: Número de veces que se encontró td con id='id_time': {count_id_time}")