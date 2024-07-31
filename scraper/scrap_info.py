import requests
from bs4 import BeautifulSoup
import json

def scrap_estadisticas():
    url = "https://www.promiedos.com.ar/ficha=xjpnxjsktrdz&c=14&v=xrWW5cxlARI"
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        estadisticas_div = soup.find("div", {"id": "ficha-estadisticas"})
        
        if estadisticas_div:
            porcentaje1_divs = estadisticas_div.find_all("div", {"id": "porcentaje1"})
            porcentaje2_divs = estadisticas_div.find_all("div", {"id": "porcentaje2"})
            
            estadisticas = {
                "Posesión": {
                    "Equipo1": porcentaje1_divs[0].get_text(strip=True),
                    "Equipo2": porcentaje2_divs[0].get_text(strip=True)
                },
                "Tiros efectivos al arco": {
                    "Equipo1": porcentaje1_divs[1].get_text(strip=True),
                    "Equipo2": porcentaje2_divs[1].get_text(strip=True)
                },
                "Tiros al arco": {
                    "Equipo1": porcentaje1_divs[2].get_text(strip=True),
                    "Equipo2": porcentaje2_divs[2].get_text(strip=True)
                },
                "Fouls Cometidos": {
                    "Equipo1": porcentaje1_divs[3].get_text(strip=True),
                    "Equipo2": porcentaje2_divs[3].get_text(strip=True)
                },
                "Corners": {
                    "Equipo1": porcentaje1_divs[4].get_text(strip=True),
                    "Equipo2": porcentaje2_divs[4].get_text(strip=True)
                }
            }
            
            return json.dumps(estadisticas, ensure_ascii=False, indent=4)
    else:
        return json.dumps({"error": f"Error al realizar la solicitud GET. Status code: {response.status_code}"}, indent=4)
    
def scrap_info():
    url = "https://www.promiedos.com.ar/ficha=xjpnxjsktxjy&c=14&v=ryUHaXBmQ-c"
    response = requests.get(url)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        resultados_div = soup.find("div", {"id": "ficha-resultados"})
        
        if resultados_div:
            tiempo = resultados_div.find("div", {"id": "ficha-tiempo"}).get_text(strip=True)
            resultado1 = resultados_div.find("div", {"id": "ficha-resultado1"}).get_text(strip=True)
            resultado2 = resultados_div.find("div", {"id": "ficha-resultado2"}).get_text(strip=True)
            
            horario_div = resultados_div.find("div", {"id": "ficha-horario"})
            
            if horario_div:
                elementos_refe = horario_div.find_all("span", class_="refe")
                br_elements = horario_div.find_all("br")
                nomequipo_elements = soup.find_all("td", class_="nomequipo")
                
                nombreequipo = [element.get_text(strip=True) for element in nomequipo_elements]
                fecha = br_elements[0].next_sibling.strip() if br_elements[0].next_sibling else ""
                todo = elementos_refe[0].get_text(strip=True) if len(elementos_refe) > 0 else ""
                arbitro = elementos_refe[1].get_text(strip=True) if len(elementos_refe) > 1 else ""
                tv = elementos_refe[2].get_text(strip=True) if len(elementos_refe) > 2 else ""
                # resumen = 

                estadio = todo.replace(arbitro, "").replace(tv, "")

                informacion = {
                    "Tiempo": tiempo,
                    "Equipo1": nombreequipo[0],
                    "Equipo2": nombreequipo[1],
                    "Resultado": {
                        "Equipo1": resultado1,
                        "Equipo2": resultado2
                    },
                    "Fecha": fecha,
                    "Estadio": estadio,
                    "Arbitro": arbitro,
                    "TV": tv,
                    "Resumen":
                }
                
                return json.dumps(informacion, ensure_ascii=False, indent=4)
    else:
        return json.dumps({"error": f"Error al realizar la solicitud GET. Status code: {response.status_code}"}, indent=4)

if __name__ == "__main__":
    result = scrap_estadisticas()
    # result = scrap_info()
    print(result)
