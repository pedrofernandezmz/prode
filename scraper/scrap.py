import time
from scrapers.scrap_fecha import scrap_fechas
# from scrapers.scrap_tablas import scrap_tablas
from scrapers.scrap_partido import scrap_partido
from scrapers.scrap_links import scrap_links

# Medir el tiempo de ejecución
start_time = time.time()

for n in range(1, 28):
    scrap_fechas(n)
    links = scrap_links(n)
    for link in links:
        scrap_partido(link)

# scrap_tablas()

end_time = time.time()
total_time = end_time - start_time

print(f"Tiempo total de ejecución: {total_time} segundos")
