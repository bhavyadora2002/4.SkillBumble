import uuid
import mysql.connector
from datetime import datetime
from src.db import get_connection


def create_match(post_id, requester_id, owner_id, owner_skill_id, requester_skill_id):
    match_id = str(uuid.uuid4())
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """INSERT INTO matches (match_id, post_id, user1_id, user2_id, skill_from_user1_id, skill_from_user2_id, match_status)
               VALUES (%s, %s, %s, %s, %s, %s, 'pending')""",
            (match_id, post_id, owner_id, requester_id, owner_skill_id, requester_skill_id),
        )
        conn.commit()
        return find_match_by_id(match_id)
    except mysql.connector.IntegrityError:
        conn.rollback()
        raise
    finally:
        conn.close()


def find_match_by_id(match_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT m.*, p.title AS post_title, p.skill_id AS post_skill_id,
                      s.skill_name AS post_skill_name, p.type AS post_type, p.description AS post_description,
                      u1.name AS owner_name, u1.user_id AS owner_user_id,
                      u2.name AS requester_name, u2.user_id AS requester_user_id
               FROM matches m
               JOIN posts p ON p.post_id = m.post_id
               JOIN users u1 ON u1.user_id = m.user1_id
               JOIN users u2 ON u2.user_id = m.user2_id
               LEFT JOIN skills s ON s.skill_id = p.skill_id
               WHERE m.match_id = %s""",
            (match_id,),
        )
        return cursor.fetchone()
    finally:
        conn.close()


def list_matches_for_user(user_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT m.*, p.title AS post_title, p.skill_id AS post_skill_id,
                      s.skill_name AS post_skill_name, p.type AS post_type,
                      p.proficiency_level AS post_proficiency,
                      u1.name AS owner_name, u2.name AS requester_name,
                      u1.user_id AS owner_user_id, u2.user_id AS requester_user_id
               FROM matches m
               JOIN posts p ON p.post_id = m.post_id
               JOIN skills s ON s.skill_id = p.skill_id
               JOIN users u1 ON u1.user_id = m.user1_id
               JOIN users u2 ON u2.user_id = m.user2_id
               WHERE m.user1_id = %s OR m.user2_id = %s
               ORDER BY m.created_at DESC""",
            (user_id, user_id),
        )
        return cursor.fetchall()
    finally:
        conn.close()


def update_match_status(match_id, status):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        now = datetime.utcnow()
        if status == "confirmed":
            cursor.execute(
                "UPDATE matches SET match_status = %s, confirmed_at = %s WHERE match_id = %s",
                (status, now, match_id),
            )
        else:
            cursor.execute(
                "UPDATE matches SET match_status = %s WHERE match_id = %s",
                (status, match_id),
            )
        conn.commit()
    finally:
        conn.close()
