"""Descarga del chat de una VOD de Kick (EXPERIMENTAL).

Kick no tiene una API pública documentada para el replay del chat: esto usa los
endpoints que usa su web. Si cambian o Cloudflare bloquea, el pipeline sigue
sin chat (solo audio + transcripción).
"""
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .util import fmt_ts, log, write_json


def _parse_time(value: str) -> datetime:
    dt = datetime.fromisoformat(value.replace("Z", "+00:00").replace(" ", "T"))
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def _iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def fetch_chat(vod_id: str, duration: float, out_json: Path) -> bool:
    try:
        from curl_cffi import requests
    except ImportError:
        log("Falta curl_cffi; sigo sin chat.")
        return False

    session = requests.Session(impersonate="chrome")
    try:
        video = session.get(f"https://kick.com/api/v1/video/{vod_id}", timeout=30).json()
        live = video["livestream"]
        channel_id = live["channel_id"]
        start = _parse_time(live["start_time"])
    except Exception as e:
        log(f"No pude leer los datos de la VOD en Kick ({e}); sigo sin chat.")
        return False

    log("Descargando chat de Kick (experimental)...")
    end = start + timedelta(seconds=duration)
    cursor = start
    seen: set = set()
    messages = []
    errors = 0
    last_report = time.time()
    while cursor < end:
        try:
            r = session.get(
                f"https://kick.com/api/v2/channels/{channel_id}/messages",
                params={"start_time": _iso(cursor)}, timeout=30,
            )
            batch = r.json()["data"]["messages"] or []
            errors = 0
        except Exception as e:
            errors += 1
            if errors >= 5:
                log(f"El chat falló varias veces seguidas ({e}); uso lo descargado hasta ahora.")
                break
            time.sleep(2 * errors)
            continue

        newest = cursor
        for m in batch:
            if m.get("id") in seen:
                continue
            seen.add(m.get("id"))
            t = _parse_time(m["created_at"])
            newest = max(newest, t)
            offset = (t - start).total_seconds()
            if 0 <= offset <= duration:
                messages.append([round(offset, 1), (m.get("content") or "")[:120]])
        # Si no hubo nada nuevo, avanzamos el cursor a mano.
        cursor = newest + timedelta(milliseconds=1) if newest > cursor else cursor + timedelta(seconds=10)

        if time.time() - last_report > 20:
            last_report = time.time()
            log(f"  chat hasta {fmt_ts((cursor - start).total_seconds())} ({len(messages)} mensajes)")
        time.sleep(0.15)

    if not messages:
        log("No se obtuvieron mensajes de chat; sigo sin chat.")
        return False
    messages.sort()
    write_json(out_json, {"messages": messages})
    log(f"Chat listo: {len(messages)} mensajes.")
    return True
