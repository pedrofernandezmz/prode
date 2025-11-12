#!/usr/bin/env python3
"""
api_stress_test.py

Prueba de carga / medición de latencia para endpoints GET con delays aleatorios.
Uso:
    python api_stress_test.py --urls urls.txt --mode count --requests 100 --concurrency 20 --min-delay 0.1 --max-delay 1.0
    python api_stress_test.py --urls https://a.com https://b.com --mode duration --duration 30 --concurrency 50 --min-delay 0.2 --max-delay 2.0
"""

import argparse
import asyncio
import csv
import json
import random
import sys
import time
from collections import Counter, defaultdict
from datetime import datetime
from statistics import mean, median

try:
    import aiohttp
except ImportError:
    print("Este script requiere aiohttp. Instálalo con: pip install aiohttp")
    sys.exit(1)


def parse_args():
    p = argparse.ArgumentParser(description="API GET stress/latency tester (async aiohttp, con delays aleatorios).")
    p.add_argument("--urls", nargs="+", required=True,
                   help="Archivo con URLs (ruta) o una o más URLs en la línea de comandos.")
    p.add_argument("--mode", choices=("count", "duration"), default="count",
                   help="count: N requests por URL. duration: enviar requests durante X segundos.")
    p.add_argument("--requests", type=int, default=100,
                   help="Número de requests por URL (modo count).")
    p.add_argument("--duration", type=int, default=30,
                   help="Segundos a correr la prueba (modo duration).")
    p.add_argument("--concurrency", type=int, default=50,
                   help="Número máximo de requests concurrentes (global).")
    p.add_argument("--timeout", type=float, default=10.0,
                   help="Timeout por request en segundos.")
    p.add_argument("--output-prefix", type=str, default="results",
                   help="Prefijo para archivos de salida (CSV y JSON).")
    p.add_argument("--ramp-up-seconds", type=int, default=0,
                   help="Si >0, sube la concurrencia gradualmente durante esos segundos.")
    p.add_argument("--workers-per-url", type=int, default=0,
                   help="(Opcional) número de 'workers' dedicados por URL (no obligatorio).")
    p.add_argument("--min-delay", type=float, default=0.1,
                   help="Delay mínimo (segundos) entre requests.")
    p.add_argument("--max-delay", type=float, default=1.0,
                   help="Delay máximo (segundos) entre requests.")
    return p.parse_args()


class StatsCollector:
    def __init__(self):
        self.records = []
        self._lock = asyncio.Lock()

    async def add(self, rec):
        async with self._lock:
            self.records.append(rec)

    def summarize(self):
        total = len(self.records)
        successes = [r for r in self.records if r.get("status") and 200 <= r["status"] < 400]
        failures = [r for r in self.records if not r.get("status") or r.get("status") >= 400]
        times = [r["elapsed_ms"] for r in self.records if r.get("elapsed_ms") is not None]
        status_counts = Counter(r.get("status", "ERR") for r in self.records)
        per_url = defaultdict(list)
        for r in self.records:
            per_url[r["url"]].append(r)

        def calc_stats(arr):
            if not arr:
                return {}
            arr_sorted = sorted(arr)
            n = len(arr_sorted)
            s = {
                "count": n,
                "min_ms": arr_sorted[0],
                "max_ms": arr_sorted[-1],
                "avg_ms": mean(arr_sorted),
                "median_ms": median(arr_sorted),
                "p50_ms": arr_sorted[max(0, int(0.50 * n) - 1)],
                "p90_ms": arr_sorted[max(0, int(0.90 * n) - 1)],
                "p95_ms": arr_sorted[max(0, int(0.95 * n) - 1)],
                "p99_ms": arr_sorted[max(0, int(0.99 * n) - 1)],
            }
            return s

        overall = calc_stats(times)
        per_url_stats = {
            url: calc_stats([r["elapsed_ms"] for r in recs if r.get("elapsed_ms") is not None])
            for url, recs in per_url.items()
        }

        return {
            "total_requests": total,
            "successful_requests": len(successes),
            "failed_requests": len(failures),
            "status_counts": dict(status_counts),
            "overall": overall,
            "per_url": per_url_stats,
        }


async def fetch_one(session, url, timeout, sem: asyncio.Semaphore, stats: StatsCollector):
    start = time.perf_counter()
    timestamp = datetime.utcnow().isoformat()
    try:
        async with sem:
            async with session.get(url, timeout=timeout) as resp:
                text = await resp.read()
                elapsed = (time.perf_counter() - start) * 1000.0
                rec = {
                    "timestamp": timestamp,
                    "url": url,
                    "status": resp.status,
                    "elapsed_ms": round(elapsed, 3),
                    "len_bytes": len(text),
                    "error": None,
                }
                await stats.add(rec)
                return rec
    except Exception as e:
        elapsed = (time.perf_counter() - start) * 1000.0
        rec = {
            "timestamp": timestamp,
            "url": url,
            "status": None,
            "elapsed_ms": round(elapsed, 3),
            "len_bytes": 0,
            "error": str(e),
        }
        await stats.add(rec)
        return rec


async def fetch_with_delay(session, url, timeout, sem, stats, min_delay, max_delay):
    delay = random.uniform(min_delay, max_delay)
    await asyncio.sleep(delay)
    return await fetch_one(session, url, timeout, sem, stats)


async def worker_count_mode(url, n_requests, session, timeout, sem, stats, min_delay, max_delay):
    results = []
    for _ in range(n_requests):
        rec = await fetch_with_delay(session, url, timeout, sem, stats, min_delay, max_delay)
        results.append(rec)
    return results


async def duration_mode(urls, duration_seconds, session, timeout, sem, stats, concurrency, min_delay, max_delay):
    end_time = time.monotonic() + duration_seconds
    in_flight = set()

    async def launch(url):
        return asyncio.create_task(fetch_with_delay(session, url, timeout, sem, stats, min_delay, max_delay))

    urls_count = len(urls)

    while time.monotonic() < end_time:
        while len(in_flight) < concurrency and time.monotonic() < end_time:
            url = urls[random.randint(0, urls_count - 1)]
            task = await launch(url)
            in_flight.add(task)

        if not in_flight:
            await asyncio.sleep(0.05)
            continue

        done, pending = await asyncio.wait(in_flight, return_when=asyncio.FIRST_COMPLETED, timeout=0.5)
        for d in done:
            in_flight.discard(d)

    if in_flight:
        await asyncio.wait(in_flight, return_when=asyncio.ALL_COMPLETED)


async def main_async(args):
    resolved_urls = []
    for u in args.urls:
        if u.startswith("http://") or u.startswith("https://"):
            resolved_urls.append(u)
        else:
            try:
                with open(u, "r", encoding="utf-8") as fh:
                    for line in fh:
                        line = line.strip()
                        if not line:
                            continue
                        resolved_urls.append(line)
            except FileNotFoundError:
                print(f"Warning: {u} no es URL ni archivo existente. Ignorando.", file=sys.stderr)

    if not resolved_urls:
        raise SystemExit("No se encontraron URLs válidas.")

    stats = StatsCollector()
    timeout = aiohttp.ClientTimeout(total=args.timeout)
    connector = aiohttp.TCPConnector(limit=0)
    sem = asyncio.Semaphore(args.concurrency)

    async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
        start_time = time.perf_counter()
        if args.mode == "count":
            all_tasks = []
            for url in resolved_urls:
                all_tasks.append(
                    asyncio.create_task(worker_count_mode(url, args.requests, session, timeout, sem, stats, args.min_delay, args.max_delay))
                )
            await asyncio.gather(*all_tasks)
        else:
            await duration_mode(resolved_urls, args.duration, session, timeout, sem, stats, args.concurrency, args.min_delay, args.max_delay)
        end_time = time.perf_counter()

    stats_data = stats.summarize()
    total_time = end_time - start_time
    total_requests = stats_data["total_requests"]
    throughput = (total_requests / total_time) if total_time > 0 else 0.0

    summary = {
        "started_at_utc": datetime.utcnow().isoformat(),
        "duration_seconds": round(total_time, 3),
        "concurrency": args.concurrency,
        "total_requests": total_requests,
        "throughput_req_per_sec": round(throughput, 3),
        "stats": stats_data,
    }

    csv_file = f"{args.output_prefix}.csv"
    json_file = f"{args.output_prefix}.json"
    with open(csv_file, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=["timestamp", "url", "status", "elapsed_ms", "len_bytes", "error"])
        writer.writeheader()
        for r in stats.records:
            writer.writerow({
                "timestamp": r.get("timestamp"),
                "url": r.get("url"),
                "status": r.get("status"),
                "elapsed_ms": r.get("elapsed_ms"),
                "len_bytes": r.get("len_bytes"),
                "error": r.get("error"),
            })

    with open(json_file, "w", encoding="utf-8") as fh:
        json.dump({"summary": summary, "records": stats.records}, fh, ensure_ascii=False, indent=2)

    print("\n=== RESUMEN ===")
    print(f"Tiempo total (s): {summary['duration_seconds']}")
    print(f"Requests totales: {summary['total_requests']}")
    print(f"Throughput (req/s): {summary['throughput_req_per_sec']}")
    print(f"Concurrencia máxima: {summary['concurrency']}")
    print(f"Éxitos: {summary['stats']['successful_requests']}, Fallos: {summary['stats']['failed_requests']}")
    print("Códigos HTTP:", summary['stats']['status_counts'])
    print("Estadísticas globales (ms):", summary['stats']['overall'])
    print("Estadísticas por URL (ms):")
    for url, st in summary['stats']['per_url'].items():
        print(f"  - {url}: {st}")

    print(f"\nResultados guardados en: {csv_file} y {json_file}")
    return summary


def main():
    args = parse_args()
    try:
        asyncio.run(main_async(args))
    except KeyboardInterrupt:
        print("Interrumpido por el usuario.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
