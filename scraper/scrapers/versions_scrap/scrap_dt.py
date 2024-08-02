import requests
from bs4 import BeautifulSoup

# URL de la página
url = 'https://www.promiedos.com.ar/ficha=xjpnxjsktrdz&c=14&v=xrWW5cxlARI'

# Realizar la solicitud HTTP
response = requests.get(url)

# Parsear el contenido HTML
soup = BeautifulSoup(response.content, 'html.parser')

# Función para extraer información del DT
def extract_dt_info(table_id):
    dt_info = {}
    table = soup.find('table', id=table_id)
    
    if table:
        dt_row = table.find('tr', class_='dttr')
        if dt_row:
            dt_info['Posición'] = dt_row.find('td', class_='dt').get_text(strip=True)
            dt_info['Nombre'] = dt_row.find('td', colspan='2').get_text(strip=True).replace('img', '').strip()
            dt_info['Edad'] = dt_row.find_all('td')[2].get_text(strip=True)
            dt_info['Imagen'] = dt_row.find('img')['src'] if dt_row.find('img') else None
            
    return dt_info

# Extraer información de ambos tables
dt_info_formacion1 = extract_dt_info('formacion1')
dt_info_formacion2 = extract_dt_info('formacion2')

# Imprimir la información del DT
print("Información del DT en formacion1:")
print(dt_info_formacion1)

print("\nInformación del DT en formacion2:")
print(dt_info_formacion2)
