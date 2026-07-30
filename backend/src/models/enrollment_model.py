import uuid
from src.db import get_connection


def create_enrollment(post_id, learner_id, credits_paid):
    enrollment_id = str(uuid.uuid4())
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """INSERT INTO enrollments (enrollment_id, post_id, learner_id, credits_paid, status)
               VALUES (%s, %s, %s, %s, 'enrolled')""",
            (enrollment_id, post_id, learner_id, credits_paid),
        )
        conn.commit()
        return find_enrollment_by_id(enrollment_id)
    finally:
        conn.close()


def find_enrollment_by_id(enrollment_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT e.*, p.title, p.description, p.user_id AS teacher_id,
                      s.skill_name, s.category,
                      u.name AS teacher_name, u.meeting_link AS meeting_link,
                      u.rating_overall AS teacher_rating
               FROM enrollments e
               JOIN posts p ON p.post_id = e.post_id
               JOIN skills s ON s.skill_id = p.skill_id
               JOIN users u ON u.user_id = p.user_id
               WHERE e.enrollment_id = %s""",
            (enrollment_id,),
        )
        return cursor.fetchone()
    finally:
        conn.close()


def find_enrollment(learner_id, post_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM enrollments WHERE learner_id = %s AND post_id = %s",
            (learner_id, post_id),
        )
        return cursor.fetchone()
    finally:
        conn.close()


def list_enrollments_for_learner(learner_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT e.*, p.title, p.description, p.user_id AS teacher_id,
                      s.skill_name, s.category,
                      u.name AS teacher_name, u.meeting_link AS meeting_link,
                      u.rating_overall AS teacher_rating
               FROM enrollments e
               JOIN posts p ON p.post_id = e.post_id
               JOIN skills s ON s.skill_id = p.skill_id
               JOIN users u ON u.user_id = p.user_id
               WHERE e.learner_id = %s
               ORDER BY e.created_at DESC""",
            (learner_id,),
        )
        return cursor.fetchall()
    finally:
        conn.close()


def list_enrollments_for_teacher(teacher_id):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT e.*, p.title, p.description, p.user_id AS teacher_id,
                      s.skill_name, s.category,
                      u.name AS learner_name, u.meeting_link AS learner_meeting_link,
                      u.rating_overall AS learner_rating
               FROM enrollments e
               JOIN posts p ON p.post_id = e.post_id
               JOIN skills s ON s.skill_id = p.skill_id
               JOIN users u ON u.user_id = e.learner_id
               WHERE p.user_id = %s
               ORDER BY e.created_at DESC""",
            (teacher_id,),
        )
        return cursor.fetchall()
    finally:
        conn.close()
