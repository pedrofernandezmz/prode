import requests
from bs4 import BeautifulSoup
import re
import csv

def scrap_formacion():
    # URL de la página a scrapear
    url = "https://www.promiedos.com.ar/verfecha.php?fecha=2_14"

    # Realizar la solicitud GET a la página
    response = requests.get(url)

    # Verificar si la solicitud fue exitosa (código de estado 200)
    if response.status_code == 200:
        # Parsear el contenido HTML de la página
        soup = BeautifulSoup(response.content, "html.parser")
        
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
        
        # Repetir cada elemento de game_days según el valor correspondiente en days_array
        repeated_game_days = []
        for day, count in zip(game_day, days_array):
            repeated_game_days.extend([day] * count)
        
        # Crear un archivo CSV para escribir los datos
        with open("partido.csv", "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            # Nombre de las columnas
            column_names = ["Dia", "Tiempo", "Equipo1", "Equipo2", "Resultado1", "Resultado2", "Goles1", "Goles2"]
            
            writer.writerow(column_names)
            
            # Escribir los datos en cada fila
            for data_all in zip(repeated_game_days, game_time, game_team1, game_team2, game_result1, game_result2, game_goals1, game_goals2):
                row = [data.get_text(strip=True) for data in data_all]
                writer.writerow(row)
        
        print("Los datos se han guardado correctamente en el archivo partido.csv.")
        
    else:
        print("Error al acceder a la página:", response.status_code)
        
def scrap_days(response):
    # Crear un objeto BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Encontrar todas las filas de la tabla
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
        
if __name__ == "__main__":
    # url = 'https://www.promiedos.com.ar/verfecha.php?fecha=1_14'
    # response = requests.get(url)
    # resultados = scrap_days(response)
    # print("Resultados:", resultados)
    scrap_fechas()
