import requests
import json
import os
import time
from datetime import datetime, timedelta

def obtener_fecha_actual():
    url = "https://api.promiedos.com.ar/league/tables_and_fixtures/hc"

    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return

    data = response.json()

    # ✅ Acceder correctamente al array de fechas
    filtros = data.get("games", {}).get("filters", [])

    # Buscar la fecha que tiene "selected": true
    fecha_seleccionada = next((f for f in filtros if isinstance(f, dict) and f.get("selected") == True), None)

    if not fecha_seleccionada:
        print("No se encontró una fecha seleccionada.")
        return

    partidos = fecha_seleccionada.get("games", [])
    if not partidos:
        print("No hay partidos en la fecha seleccionada.")
        return

    primer_partido = partidos[0]
    ultimo_partido = partidos[-1]

    stage_round_name = primer_partido.get("stage_round_name", "Fecha")
    start_time_primero = primer_partido.get("start_time")
    start_time_ultimo = ultimo_partido.get("start_time")

    # Convertir string de fecha a datetime
    def parsear_fecha(fecha_str):
        return datetime.strptime(fecha_str, "%d-%m-%Y %H:%M")

    date_begin = parsear_fecha(start_time_primero)
    date_end = parsear_fecha(start_time_ultimo) + timedelta(hours=2)

    resultado = {
        "name": stage_round_name,
        "number": int(''.join(filter(str.isdigit, stage_round_name))),
        "date_begin": date_begin.isoformat() + ".000Z",
        "date_end": date_end.isoformat() + ".000Z"
    }

    output_file = os.path.join("../jsons", "currentDate.json")
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(resultado, f, ensure_ascii=False, indent=4)

    print(f"Archivo guardado en {output_file}")

if __name__ == "__main__":
    start_time = time.time()
    obtener_fecha_actual()
    end_time = time.time()
    total_time = end_time - start_time
    print("Time:", total_time, "seconds")
