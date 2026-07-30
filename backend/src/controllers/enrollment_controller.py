import uuid
from src.models import enrollment_model, give_take_model, user_model
from src.db import get_connection

DEFAULT_CREDIT_COST = 1.00


def list_enrollment_posts(user_id):
    try:
        posts = give_take_model.list_open_posts(user_id)
        enrollable = [p for p in posts if p["type"] == "teach"]
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500
    return {"posts": enrollable}, 200


def enroll(data, learner_id):
    post_id = data.get("post_id")
    if not post_id:
        return {"error": "post_id is required"}, 400

    try:
        post = give_take_model.find_post_by_id(post_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500

    if not post:
        return {"error": "post not found"}, 404

    if post["user_id"] == learner_id:
        return {"error": "cannot enroll in your own post"}, 400

    if post["status"] != "open":
        return {"error": "post is no longer open"}, 400

    if post["type"] != "teach":
        return {"error": "can only enroll in teach posts"}, 400

    learner = user_model.find_by_id(learner_id)
    if not learner:
        return {"error": "learner not found"}, 404

    credit_cost = DEFAULT_CREDIT_COST
    if float(learner["credit_balance"]) < credit_cost:
        return {
            "error": f"Insufficient credits. You need {credit_cost} credit(s) but have {float(learner['credit_balance']):.2f}"
        }, 400

    existing = enrollment_model.find_enrollment(learner_id, post_id)
    if existing:
        return {"error": "already enrolled in this post"}, 400

    teacher_id = post["user_id"]
    enrollment_id = str(uuid.uuid4())

    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE users SET credit_balance = credit_balance - %s WHERE user_id = %s",
            (credit_cost, learner_id),
        )
        cursor.execute(
            "UPDATE users SET credit_balance = credit_balance + %s WHERE user_id = %s",
            (credit_cost, teacher_id),
        )
        cursor.execute(
            "INSERT INTO credit_transactions (transaction_id, user_id, amount, reason) VALUES (%s, %s, %s, 'spent')",
            (str(uuid.uuid4()), learner_id, credit_cost),
        )
        cursor.execute(
            "INSERT INTO credit_transactions (transaction_id, user_id, amount, reason) VALUES (%s, %s, %s, 'earned')",
            (str(uuid.uuid4()), teacher_id, credit_cost),
        )
        cursor.execute(
            "INSERT INTO enrollments (enrollment_id, post_id, learner_id, credits_paid, status) VALUES (%s, %s, %s, %s, 'enrolled')",
            (enrollment_id, post_id, learner_id, credit_cost),
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        return {"error": f"enrollment failed: {str(e)}"}, 500
    finally:
        conn.close()

    enrollment = enrollment_model.find_enrollment_by_id(enrollment_id)
    return {"enrollment": enrollment}, 201


def list_my_enrollments(learner_id):
    try:
        enrollments = enrollment_model.list_enrollments_for_learner(learner_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500
    return {"enrollments": enrollments}, 200


def list_my_students(teacher_id):
    try:
        students = enrollment_model.list_enrollments_for_teacher(teacher_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500
    return {"students": students}, 200
