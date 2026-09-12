"""Small SQLite-backed catalog store for the local PS16 admin workflow."""
from __future__ import annotations
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import time
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).resolve().parent / "ps16_admin.sqlite3"
TOKEN_SECRET = os.getenv("PS16_ADMIN_TOKEN_SECRET", "local-ps16-change-this-secret").encode()
ADMIN_USERNAME = os.getenv("PS16_ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("PS16_ADMIN_PASSWORD", "ps16-demo-admin")

def _hash(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

def _connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("CREATE TABLE IF NOT EXISTS schemes (id TEXT PRIMARY KEY, payload TEXT NOT NULL, status TEXT NOT NULL, version TEXT NOT NULL, updated_at TEXT NOT NULL)")
    connection.execute("CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, actor TEXT NOT NULL, scheme_id TEXT, version TEXT, details TEXT NOT NULL, created_at TEXT NOT NULL)")
    connection.commit()
    return connection

def authenticate(username: str, password: str) -> str | None:
    if not hmac.compare_digest(username, ADMIN_USERNAME) or not hmac.compare_digest(_hash(password), _hash(ADMIN_PASSWORD)):
        return None
    timestamp = str(int(time.time()))
    raw = f"{username}:{timestamp}"
    signature = hmac.new(TOKEN_SECRET, raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}:{signature}"

def verify_token(token: str | None) -> str | None:
    try:
        username, timestamp, signature = (token or "").split(":", 2)
        raw = f"{username}:{timestamp}"
        if time.time() - int(timestamp) > 8 * 60 * 60: return None
        expected = hmac.new(TOKEN_SECRET, raw.encode(), hashlib.sha256).hexdigest()
        return username if hmac.compare_digest(signature, expected) else None
    except (ValueError, TypeError):
        return None

def list_schemes() -> list[dict[str, Any]]:
    with _connection() as connection:
        return [{**json.loads(row["payload"]), "status": row["status"], "version": row["version"], "updatedAt": row["updated_at"]} for row in connection.execute("SELECT * FROM schemes ORDER BY updated_at DESC")]

def save_scheme(payload: dict[str, Any], actor: str) -> dict[str, Any]:
    scheme_id = str(payload.get("id", "")).strip()
    if not scheme_id or not payload.get("name") or not str(payload.get("officialSourceUrl", "")).startswith("https://"):
        raise ValueError("id, name, and an HTTPS officialSourceUrl are required")
    version = str(payload.get("kbVersion") or "registry-2026.1")
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    with _connection() as connection:
        connection.execute("INSERT INTO schemes(id,payload,status,version,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,status='REVIEW_REQUIRED',version=excluded.version,updated_at=excluded.updated_at", (scheme_id, json.dumps(payload), "REVIEW_REQUIRED", version, now))
        connection.execute("INSERT INTO audit(action,actor,scheme_id,version,details,created_at) VALUES(?,?,?,?,?,?)", ("SAVE_DRAFT", actor, scheme_id, version, "Scheme saved for review", now))
        connection.commit()
    return {**payload, "status": "REVIEW_REQUIRED", "version": version, "updatedAt": now}

def publish_scheme(scheme_id: str, actor: str) -> dict[str, Any]:
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    with _connection() as connection:
        row = connection.execute("SELECT payload,version FROM schemes WHERE id=?", (scheme_id,)).fetchone()
        if not row: raise KeyError(scheme_id)
        connection.execute("UPDATE schemes SET status='PUBLISHED',updated_at=? WHERE id=?", (now, scheme_id))
        connection.execute("INSERT INTO audit(action,actor,scheme_id,version,details,created_at) VALUES(?,?,?,?,?,?)", ("PUBLISH", actor, scheme_id, row["version"], "Scheme published after review", now))
        connection.commit()
        return {**json.loads(row["payload"]), "status": "PUBLISHED", "version": row["version"], "updatedAt": now}

def audit_log() -> list[dict[str, Any]]:
    with _connection() as connection:
        return [dict(row) for row in connection.execute("SELECT * FROM audit ORDER BY id DESC LIMIT 100")]
