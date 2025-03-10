import requests
from bs4 import BeautifulSoup
import json
from .scrap_info import scrap_info, scrap_estadisticas
from .scrap_incidencias import scrap_incidencias
import time

def scrap_partido(link):
    url = "https://www.promiedos.com.ar/" + link
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        info = json.loads(scrap_info(soup))
        estadisticas = json.loads(scrap_estadisticas(soup))
        incidencias1 = scrap_incidencias(soup, 1)
        incidencias2 = scrap_incidencias(soup, 2)

        data = {
        **info,
        "formacion1": {
            "equipo": "",
            "titulares": [],
            "dt": {},
            "suplentes": [],
            **incidencias1
        },
        "formacion2": {
            "equipo": "",
            "titulares": [],
            "dt": {},
            "suplentes": [],
            **incidencias2
        },
        **estadisticas
    }

        for formacion in data.keys():
            tabla = soup.find("table", {"id": formacion})
            if not tabla:
                continue

            data[formacion]["equipo"] = tabla.find("td", {"class": "nomequipo"}).get_text(strip=True)
            seccion_actual = ""
            filas = tabla.find_all("tr")

            for fila in filas:
                celdas = fila.find_all(["th", "td"])
                texto_celdas = [celda.get_text(strip=True) for celda in celdas]
                imagenes = [img['src'] for img in fila.find_all('img')]

                if len(texto_celdas) == 1:
                    seccion_texto = texto_celdas[0].lower()
                    if "titulares" in seccion_texto:
                        seccion_actual = "titulares"
                    elif "suplentes" in seccion_texto:
                        seccion_actual = "suplentes"
                elif seccion_actual == "titulares" or seccion_actual == "suplentes":
                    if len(texto_celdas) == 5:
                        jugador = {
                            "Pos": texto_celdas[0],
                            "N°": texto_celdas[1],
                            "Jugador": texto_celdas[2],
                            "Edad": texto_celdas[3],
                            "Alt(cm)": texto_celdas[4],
                            "Imagenes": imagenes
                        }
                        data[formacion][seccion_actual].append(jugador)

            # Extraer información del DT
            dt_row = tabla.find('tr', class_='dttr')
            if dt_row:
                data[formacion]['dt']['Pos'] = "DT"
                data[formacion]['dt']['Nombre'] = dt_row.find('td', colspan='2').get_text(strip=True).replace('img', '').strip()
                data[formacion]['dt']['Edad'] = dt_row.find_all('td')[2].get_text(strip=True)
                data[formacion]['dt']['Imagen'] = dt_row.find('img')['src'] if dt_row.find('img') else None

        # Guardar los datos en un archivo JSON ACA TENGO QUE PONER LINK
        with open(f"./jsons/{link}.json", "w", encoding="utf-8") as jsonfile:
            json.dump(data, jsonfile, ensure_ascii=False, indent=4)
        print(f"Los datos se han guardado correctamente en el archivo {link}.json.")
    else:
        print("Error al realizar la solicitud GET.")

if __name__ == "__main__":
    start_time = time.time()
    link = "ficha=xjpnxjsxjzrd&c=14&v=sOIpEil5tKE"
    scrap_partido(link)
    end_time = time.time()
    total_time = end_time - start_time
    print("Tiempo total de ejecución:", total_time, "segundos")
