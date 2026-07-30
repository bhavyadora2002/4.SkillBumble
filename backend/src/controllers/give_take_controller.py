from src.models import give_take_model

VALID_TYPES = {"teach", "learn"}
VALID_PROFICIENCY = {"beginner", "intermediate", "advanced", "expert"}


def create_post(data, user_id):
    skill_id = data.get("skill_id")
    post_type = data.get("type")
    proficiency_level = data.get("proficiency_level", "beginner")
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()

    if not all([skill_id, post_type, title]):
        return {"error": "skill_id, type, and title are required"}, 400

    if post_type not in VALID_TYPES:
        return {"error": "type must be 'teach' or 'learn'"}, 400

    if proficiency_level not in VALID_PROFICIENCY:
        return {"error": "invalid proficiency_level"}, 400

    try:
        post = give_take_model.create_post(user_id, skill_id, post_type, proficiency_level, title, description)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500

    return {"post": post}, 201


def list_posts(user_id):
    try:
        posts = give_take_model.list_open_posts(user_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500
    return {"posts": posts}, 200


def get_post(post_id):
    try:
        post = give_take_model.find_post_by_id(post_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500
    if not post:
        return {"error": "post not found"}, 404
    return {"post": post}, 200
