import requests
from bs4 import BeautifulSoup
import json

def scrap_estadisticas(soup):

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
    
def scrap_info(soup):
        
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
                iframe = soup.find("iframe")
                
                nombreequipo = [element.get_text(strip=True) for element in nomequipo_elements]
                # SOLUCION CUANDO NO HAY FECHA
                fecha = ""
                if br_elements and br_elements[0]:
                    next_sibling = br_elements[0].next_sibling
                    if isinstance(next_sibling, str):
                        fecha = next_sibling.strip()
                
                todo = elementos_refe[0].get_text(strip=True) if len(elementos_refe) > 0 else ""
                arbitro = elementos_refe[1].get_text(strip=True) if len(elementos_refe) > 1 else ""
                tv = elementos_refe[2].get_text(strip=True) if len(elementos_refe) > 2 else ""
                src = ""
                if iframe is not None:
                    src = "https:" + iframe.get("src", "")
                # ACA PUEDE DAR ERROR SI NO ENCUENTRA LINK

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
                    "Resumen": src
                }
                
                return json.dumps(informacion, ensure_ascii=False, indent=4)
        else:
            return json.dumps({"error": f"Error al realizar la solicitud GET. Status code: {response.status_code}"}, indent=4)

if __name__ == "__main__":
    url = "https://www.promiedos.com.ar/ficha=xjpnxjsktrdz&c=14&v=xrWW5cxlARI"
    # url = "https://www.promiedos.com.ar/ficha=xjpnxjsxjgcv&c=14" ACA NO HAY VIDEO
    # url = "https://www.promiedos.com.ar/ficha=xjpnxjsxjzrd&c=14&v=sOIpEil5tKE" ACA NO HAY FECHA
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
    else:
        print({"error": f"Error al realizar la solicitud GET. Status code: {response.status_code}"}, indent=4)
    # result = scrap_estadisticas(soup)
    result = scrap_info(soup)
    print(result)
