from scrapers.scrap_fecha import scrap_fechas
from scrapers.scrap_tablas import scrap_tablas
from scrapers.scrap_partido import scrap_partido
from scrapers.scrap_links import scrap_links
from scrapers.scrap_n_fecha import scrap_numero
from datetime import datetime
import json
import time
import re

def scrap_all():
    for n in range(1, 28):
        scrap_fechas(n)
        scrap_fichas(n)
    scrap_tablas()
# CUANDO EL PARTIDO ESTA EN VIVO EL LINK CAMBIA CUANDO TERMINO PERMANECE IGUAL HABRIA QUE BORRARLOS?

def scrap_fichas(n):
    links = scrap_links(n)
    for link in links:
        scrap_partido(link)


# def scrap_estado():
#     n = scrap_numero()
#     scrap_fechas(n)
    
#     with open(f"Scraper/jsons/fecha_{n}.json", "r", encoding="utf-8") as jsonfile:
#         partidos = json.load(jsonfile)

#     estado = "termino"

#     hora_pattern = re.compile(r'^\d{2}:\d{2}$')
#     tiempo_pattern = re.compile(r'^\d{1,2}\'?$')

#     for partido in partidos:
#         tiempo = partido.get("Tiempo", "").strip()
#         print(tiempo)
        
#     #     if tiempo == "A conf.":
#     #         return "no empezo"
#     #     elif hora_pattern.match(tiempo):
#     #         return "no empezo"
#     #     elif tiempo_pattern.match(tiempo) and tiempo:
#     #         estado = "jugando"
    
#     # return estado

# # print(estado())

# def scrap_estado():
#     n = scrap_numero()
#     scrap_fechas(n)
    
#     with open(f"Scraper/jsons/fecha_{n}.json", "r", encoding="utf-8") as jsonfile:
#         partidos = json.load(jsonfile)

#     tiempos = []  # Lista para almacenar los tiempos

#     for partido in partidos:
#         tiempo = partido.get("Tiempo", "").strip()
#         if tiempo:
#             tiempos.append(tiempo)
    
#     return tiempos

# def wait_until_next_check():
#     while True:
#         current_time = datetime.now()
#         current_minute = current_time.minute
#         if current_minute in [1, 3, 57, 46]:
#             return
#         # Espera 15 segundos antes de volver a verificar
#         time.sleep(15)

# def scrap_x_minuto():
#     n = scrap_numero()
#     print("Comprobando estado...")
#     print("Estado no es 'jugando'. Esperando hasta el próximo intervalo...")
#     while True:
#         estado = scrap_estado()
#         if estado == "jugando":
#             while estado == "jugando":
#                 scrap_fechas(n)
#                 scrap_fichas(n)
#                 time.sleep(50)
#                 estado = scrap_estado()
#         else:
#             wait_until_next_check()

# ACA TENDRIA QUE SER MAS INTELIGENTE EL USO DE LAS REQUESTS QUE SE HACEN...

def scrap_estado(n):
    # n = scrap_numero()
    # scrap_fechas(n)
    
    with open(f"Scraper/jsons/fecha_{n}.json", "r", encoding="utf-8") as jsonfile:
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
    # start_time = time.time()
    # scrap_all()
    scrap_x_minuto()
    # print(scrap_estado())
    # end_time = time.time()
    # total_time = end_time - start_time
    # print(f"Tiempo total de ejecución: {total_time} segundos")