import requests
from bs4 import BeautifulSoup

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
    url = 'https://www.promiedos.com.ar/verfecha.php?fecha=1_14'
    response = requests.get(url)
    resultados = scrap_days(response)
    print("Resultados:", resultados)




