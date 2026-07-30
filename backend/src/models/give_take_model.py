import uuid
from src.db import get_connection


def create_post(user_id, skill_id, post_type, proficiency_level, title, description):
    post_id = str(uuid.uuid4())
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """INSERT INTO posts (post_id, user_id, skill_id, type, proficiency_level, title, description, status)
               VALUES (%s, %s, %s, %s, %s, %s, %s, 'open')""",
            (post_id, user_id, skill_id, post_type, proficiency_level, title, description),
        )
        conn.commit()
        return find_post_by_id(post_id)
    finally:
        conn.close()


def list_open_posts(exclude_user_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT p.*, s.skill_name, s.category,
                      u.name AS user_name, u.bio AS user_bio
               FROM posts p
               JOIN skills s ON s.skill_id = p.skill_id
               JOIN users u ON u.user_id = p.user_id
               WHERE p.status = 'open' AND p.user_id != %s
               ORDER BY p.created_at DESC""",
            (exclude_user_id,),
        )
        return cursor.fetchall()
    finally:
        conn.close()


def find_post_by_id(post_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT p.*, s.skill_name, s.category,
                      u.name AS user_name, u.bio AS user_bio, u.rating_overall
               FROM posts p
               JOIN skills s ON s.skill_id = p.skill_id
               JOIN users u ON u.user_id = p.user_id
               WHERE p.post_id = %s""",
            (post_id,),
        )
        return cursor.fetchone()
    finally:
        conn.close()


def update_post_status(post_id, status):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE posts SET status = %s WHERE post_id = %s", (status, post_id))
        conn.commit()
    finally:
        conn.close()
