from src.db import get_connection


def list_all():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT skill_id, skill_name, category FROM skills ORDER BY category, skill_name")
        return cursor.fetchall()
    finally:
        conn.close()
