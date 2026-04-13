import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import psycopg2

SCHEMA = "t_p58262826_telegram_like_messen"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователей в NeoChat"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action", "")

    conn = get_conn()
    cur = conn.cursor()

    # register
    if method == "POST" and action == "register":
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not name or not email or not password:
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"error": "Заполните все поля"})}

        if len(password) < 6:
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = '{email}'")
        if cur.fetchone():
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"error": "Email уже занят"})}

        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, email, password_hash) VALUES ('{name}', '{email}', '{pw_hash}') RETURNING id"
        )
        user_id = cur.fetchone()[0]

        token = secrets.token_hex(32)
        expires = (datetime.utcnow() + timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES ({user_id}, '{token}', '{expires}')"
        )
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"token": token, "user": {"id": user_id, "name": name, "email": email}}),
        }

    # login
    if method == "POST" and action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or not password:
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"error": "Заполните все поля"})}

        pw_hash = hash_password(password)
        cur.execute(
            f"SELECT id, name, email FROM {SCHEMA}.users WHERE email = '{email}' AND password_hash = '{pw_hash}'"
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"error": "Неверный email или пароль"})}

        user_id, name, user_email = row
        token = secrets.token_hex(32)
        expires = (datetime.utcnow() + timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token, expires_at) VALUES ({user_id}, '{token}', '{expires}')"
        )
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"token": token, "user": {"id": user_id, "name": name, "email": user_email}}),
        }

    # me — проверка сессии
    if method == "GET":
        token = (event.get("headers") or {}).get("X-Session-Token", "")
        if not token:
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"error": "Не авторизован"})}

        now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        cur.execute(
            f"SELECT u.id, u.name, u.email FROM {SCHEMA}.sessions s "
            f"JOIN {SCHEMA}.users u ON u.id = s.user_id "
            f"WHERE s.token = '{token}' AND s.expires_at > '{now}'"
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"error": "Сессия истекла"})}

        user_id, name, email = row
        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"user": {"id": user_id, "name": name, "email": email}}),
        }

    # logout
    if method == "POST" and action == "logout":
        token = (event.get("headers") or {}).get("X-Session-Token", "")
        if token:
            now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = '{now}' WHERE token = '{token}'")
            conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 200, "headers": cors, "body": json.dumps({"error": "Unknown action"})}