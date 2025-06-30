import os
import requests

ids_str = "igg,ihe,iie,ihf,ihb,igi,igf,iid,ihg,igh,jafb,bbjea,beafh,hcch,hcbh,igj,hcah,ihh,hchc,ihd,fhid,jche,hcag,hbbh,iia,ihi,ihc,gbfc,hccd,hcai"
ids = ids_str.split(',')

base_url = "https://api.promiedos.com.ar/images/team/{id}/{num}"
folder = "logos"

def descargar_imagen(url, path):
    try:
        r = requests.get(url, stream=True)
        r.raise_for_status()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            for chunk in r.iter_content(1024):
                f.write(chunk)
        print(f"Descargada: {path}")
    except Exception as e:
        print(f"Error descargando {url}: {e}")

os.makedirs(folder, exist_ok=True)

for id_ in ids:
    for num in ['1', '4']:
        url = base_url.format(id=id_, num=num)
        filename = f"{id_}/{num}.png"
        path = os.path.join(folder, filename)
        descargar_imagen(url, path)
