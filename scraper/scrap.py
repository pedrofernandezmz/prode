import schedule
import time
from datetime import datetime
import threading

from scrapers.scrap_currentdate import scrap_currentdate
from scrapers.scrap_matchdays import scrap_matchday
from scrapers.scrap_tables import scrap_tables
from scrapers.scrap_matchs import scrap_match, scrap_allmatchs
from scrapers.scrap_allnews import scrap_news

from pymongo import MongoClient

# ---- Global connection (one instance) ----
client = MongoClient("mongodb://localhost:27017/")
db = client["prode_mongodb"]

def scrap_all():
    print("\n### OBTAINING ALL INFO ###\n")
    for n in range(1, 17):
        scrap_matchday(n)
        scrap_allmatchs(n)
    scrap_tables()

def get_currentdate():
    print("\n### OBTAINING CURRENT DATE ###\n")
    scrap_currentdate()

    current = db.currentDate.find_one({}, {"number": 1, "_id": 0})

    if current and "number" in current:
        return current["number"]
    else:
        raise ValueError("\n<<ERROR>> Current date number not found\n")

def scrap_match_and_tables(match_id):
    scrap_match(match_id)
    # Solo un hilo actualiza tablas usando lock
    if table_lock.acquire(blocking=False):
        try:
            scrap_tables()
        finally:
            table_lock.release()

def get_status():
    print("\n### OBTAINING LIVE MATCHES IDs ###\n")
    global actual_date
    scrap_matchday(actual_date)

    collection_name = f"fecha_{actual_date}"

    doc = db[collection_name].find_one({}, {"games": 1})

    live_ids = []
    if doc and "games" in doc:
        live_ids = [
            game["id"]
            for game in doc["games"]
            if game.get("status", {}).get("enum") == 2
        ]

    return live_ids

def update_news():
    print("\n### OBTAINING ALL NEWS ###\n")
    scrap_news()

# ---------- Global Variables ----------
def update_currentdate():
    global actual_date
    actual_date = get_currentdate()

# actual_date = get_currentdate()
live_match_ids = set()
stop_flags = {}
threads = {}  # Diccionary for controlar threads per match_id
table_lock = threading.Lock()  # ⬅️ Lock para que solo un hilo actualice tablas


# ---------- Task Functions ----------
def task_get_allmatchs():
    global actual_date
    scrap_allmatchs(actual_date)

def task_get_status():
    global live_match_ids, threads, stop_flags
    current_live_ids = set(get_status())

    # New live games
    for match_id in current_live_ids - live_match_ids:
        stop_flags[match_id] = False
        thread = threading.Thread(target=match_updater, args=(match_id,), daemon=True)
        thread.start()
        threads[match_id] = thread

    # Remove old live games
    for match_id in live_match_ids - current_live_ids:
        stop_flags[match_id] = True
        if match_id in threads:
            threads.pop(match_id)

    live_match_ids = current_live_ids

def match_updater(match_id):
    while not stop_flags.get(match_id, True):  # Threads stops if flag is not active
        scrap_match_and_tables(match_id)
        time.sleep(55)


# ---------- Principal Scheduler ----------
def main_loop():
    print("\n### INITIALIZING SCRAPER ###\n")
    global actual_date
    # Ejecutar scrap_total al iniciar
    scrap_all()
    actual_date = get_currentdate()

    # Programar tareas
    schedule.every(15).minutes.do(task_get_allmatchs)
    schedule.every(5).minutes.do(task_get_status)
    schedule.every(30).minutes.do(update_currentdate)
    # schedule.every(60).minutes.do(update_news)

    while True:
        now = datetime.now()
        # This code only executes itself between 13:00 hs & 01:00 hs
        if now.hour >= 13 or now.hour < 1:
            schedule.run_pending()
        else:
            print("\nNot in workin time (13:00-01:00), trying again in 15 minutes\n")
            time.sleep(900)
        time.sleep(1)

if __name__ == "__main__":
    main_loop()
