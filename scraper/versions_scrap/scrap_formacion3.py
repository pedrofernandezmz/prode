import requests
from bs4 import BeautifulSoup
import json
import time

def scrap_formacion():
    # URL de la página a scrapear
    url = "https://www.promiedos.com.ar/ficha=xjpnxjsxjcvy&c=14&v=MPIVWN0jSts"
    # Realizar la solicitud GET a la página
    response = requests.get(url)

    data = {}
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        tabla = soup.find("table", {"id": "formacion1"})
        
        equipo = tabla.find("td", {"class": "nomequipo"}).get_text(strip=True)
        data["equipo"] = equipo
        
        seccion_actual = ""
        data["titulares"] = []
        data["suplentes"] = []
        data["amarillas"] = ""
        data["cambios"] = ""

        filas = tabla.find_all("tr")
        for fila in filas:
            celdas = fila.find_all(["th", "td"])
            texto_celdas = [celda.get_text(strip=True) for celda in celdas]
            
            if len(texto_celdas) == 1:
                seccion_texto = texto_celdas[0].lower()
                if "titulares" in seccion_texto:
                    seccion_actual = "titulares"
                elif "suplentes" in seccion_texto:
                    seccion_actual = "suplentes"
                elif "amarillas" in seccion_texto:
                    seccion_actual = "amarillas"
                elif "cambios" in seccion_texto:
                    seccion_actual = "cambios"
            elif seccion_actual == "titulares":
                if len(texto_celdas) == 5:
                    data["titulares"].append({
                        "Pos": texto_celdas[0],
                        "N°": texto_celdas[1],
                        "Jugador": texto_celdas[2],
                        "Edad": texto_celdas[3],
                        "Alt(cm)": texto_celdas[4]
                    })
            elif seccion_actual == "suplentes":
                if len(texto_celdas) == 5:
                    data["suplentes"].append({
                        "Pos": texto_celdas[0],
                        "N°": texto_celdas[1],
                        "Jugador": texto_celdas[2],
                        "Edad": texto_celdas[3],
                        "Alt(cm)": texto_celdas[4]
                    })
            elif seccion_actual == "amarillas":
                data["amarillas"] = texto_celdas[0]
            elif seccion_actual == "cambios":
                data["cambios"] = texto_celdas[0]

        with open(f"formacion.json", "w", encoding="utf-8") as jsonfile:
            json.dump(data, jsonfile, ensure_ascii=False, indent=4)
        print(f"Los datos se han guardado correctamente en el archivo formacion.json.")
    else:
        print("Error al realizar la solicitud GET.")

if __name__ == "__main__":
    start_time = time.time()
    scrap_formacion()
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")
