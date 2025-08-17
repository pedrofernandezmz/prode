import requests

# URL a la que se enviarán las solicitudes GET
url = 'http://localhost:3000/get_json/formaciones.json'
url2 = 'http://localhost:3000/get_json/fecha_8.json'

# Número de solicitudes GET que se realizarán
num_requests = 1000

# Realizar las solicitudes y mostrar las respuestas
for i in range(num_requests):
    try:
        # Realizar la solicitud GET
        response = requests.get(url)
        
        # Verificar si la solicitud fue exitosa
        if response.status_code == 200:
            print(f"Response {i + 1}:")
            print(response.json())  # Mostrar el contenido JSON de la respuesta
        else:
            print(f"Request {i + 1} failed with status code: {response.status_code}")
    
    except requests.RequestException as e:
        print(f"Request {i + 1} failed with exception: {e}")

for i in range(num_requests):
    try:
        # Realizar la solicitud GET
        response = requests.get(url2)
        
        # Verificar si la solicitud fue exitosa
        if response.status_code == 200:
            print(f"Response {i + 1}:")
            print(response.json())  # Mostrar el contenido JSON de la respuesta
        else:
            print(f"Request {i + 1} failed with status code: {response.status_code}")
    
    except requests.RequestException as e:
        print(f"Request {i + 1} failed with exception: {e}")

