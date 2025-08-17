import os
import json

# Rutas de las carpetas
carpetas = [
    './jsons',  # 🔁 Cambiá esto por la primera ruta real
    './hasta fecha 14 apertura jsons',
    './JSONs ACA HAY PARTIDOS EN VIVO'   # 🔁 Cambiá esto por la segunda ruta real
]

country_ids = set()
archivos_analizados = 0

# Función recursiva para buscar "country_id"
def buscar_country_id(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == 'country_id':
                country_ids.add(v)
            else:
                buscar_country_id(v)
    elif isinstance(obj, list):
        for item in obj:
            buscar_country_id(item)

# Procesar ambas carpetas
for carpeta in carpetas:
    if not os.path.isdir(carpeta):
        print(f"⚠️  Carpeta no encontrada: {carpeta}")
        continue

    for archivo in os.listdir(carpeta):
        if archivo.endswith('.json'):
            archivos_analizados += 1
            ruta_archivo = os.path.join(carpeta, archivo)
            try:
                with open(ruta_archivo, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    buscar_country_id(data)
            except Exception as e:
                print(f"⚠️  Error leyendo {archivo}: {e}")

# Resultados
print("\n✅ Country IDs únicos encontrados:")
for cid in sorted(country_ids):
    print(cid)

print(f"\n📁 Total de carpetas analizadas: {len(carpetas)}")
print(f"📄 Archivos .json analizados: {archivos_analizados}")
print(f"🔢 Cantidad de country_id únicos: {len(country_ids)}")

# ba bai baj bba bbb bbc bcf bf bfd bh bi c cb ci db eg ej fb fe ic
