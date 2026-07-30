import uuid
import mysql.connector
from src.db import get_connection


def create_user(name, email, password_hash, bio, meeting_link):
    user_id = str(uuid.uuid4())
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO users (user_id, name, email, password_hash, bio, meeting_link) VALUES (%s, %s, %s, %s, %s, %s)",
            (user_id, name, email, password_hash, bio, meeting_link),
        )
        conn.commit()
        return find_by_id(user_id)
    except mysql.connector.IntegrityError:
        conn.rollback()
        raise
    finally:
        conn.close()


def find_by_email(email):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        return cursor.fetchone()
    finally:
        conn.close()


def find_by_id(user_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        return cursor.fetchone()
    finally:
        conn.close()


def add_user_skills(user_id, skills):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        for skill in skills:
            cursor.execute(
                "INSERT INTO user_skills (user_skill_id, user_id, skill_id, type, proficiency_level, description) VALUES (%s, %s, %s, %s, %s, %s)",
                (str(uuid.uuid4()), user_id, skill["skill_id"], skill["type"], skill.get("proficiency_level", "beginner"), skill.get("description")),
            )
        conn.commit()
    finally:
        conn.close()


def fetch_skills(user_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT us.user_skill_id, us.skill_id, s.skill_name, s.category,
                      us.type, us.proficiency_level, us.description
               FROM user_skills us
               JOIN skills s ON s.skill_id = us.skill_id
               WHERE us.user_id = %s
               ORDER BY us.created_at""",
            (user_id,),
        )
        return cursor.fetchall()
    finally:
        conn.close()
