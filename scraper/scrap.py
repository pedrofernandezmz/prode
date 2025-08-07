from scrapers.scrap_matchdays import scrap_matchday
from scrapers.scrap_tables import scrap_tables
from scrapers.scrap_matchs import scrap_match, scrap_allmatchs
from datetime import datetime
import json
import time
import re

def scrap_all():
    for n in range(1, 17):
        scrap_matchday(n)
        scrap_allmatchs(n)
    scrap_tables()

def scrap_estado(n):
    # n = scrap_numero()
    # scrap_fechas(n)
    
    with open(f"./jsons/fecha_{n}.json", "r", encoding="utf-8") as jsonfile:
        partidos = json.load(jsonfile)

    tiempos = []  # Lista para almacenar los tiempos

    tiempo_pattern = re.compile(r'^\d{1,2}\'$|^E\. T\.$')

    for partido in partidos:
        tiempo = partido.get("Tiempo", "").strip()
        if tiempo_pattern.match(tiempo):
            tiempos.append(tiempo)
    # print(tiempos)
    
    return tiempos

def wait_until_next_check():
    while True:
        current_time = datetime.now()
        current_minute = current_time.minute
        # Espera hasta el próximo intervalo de 5 minutos
        if current_minute % 5 == 0:
        # if current_minute in [43, 41, 57, 46]:
            return
        # Espera 15 segundos antes de volver a verificar
        time.sleep(15)

def scrap_x_minuto():
    print("Comprobando estado...")
    while True:
        time.sleep(55)
        # wait_until_next_check()  # Espera hasta el próximo intervalo de 5 minutos antes de ejecutar la siguiente línea
        n = scrap_numero() #aca podria hacer que no busque n y directamente acceda a promiedos/primera.com tambien tablas con mismo soup
        scrap_fechas(n)
        tiempos = scrap_estado(n)
        # Verifica si hay algún tiempo en la lista que tenga el formato "nn'" o "E. T."
        if any(re.match(r'^\d{2}\'$|^E\. T\.$', tiempo) for tiempo in tiempos):
            # n = scrap_numero()
            # scrap_fechas(n)
            scrap_fichas(n)
            scrap_tablas()
            # time.sleep(55)
        else:
            print("NO HAY PARTIDO EN VIVO. Esperando hasta el próximo intervalo...")
            wait_until_next_check()  # Espera hasta el próximo intervalo de 5 minutos

if __name__ == '__main__':
    start_time = time.time()
    scrap_all()
    # scrap_x_minuto()
    # print(scrap_estado())
    # scrap fecha actual!!!!
    end_time = time.time()
    total_time = end_time - start_time
    print(f"Time: {total_time} segundos")