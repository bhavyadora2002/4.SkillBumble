from src.models import user_model


def get_profile(target_user_id):
    try:
        user = user_model.find_by_id(target_user_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500

    if not user:
        return {"error": "user not found"}, 404

    user.pop("password_hash", None)
    user.pop("email", None)
    if user.get("rating_overall") is not None:
        user["rating_overall"] = float(user["rating_overall"])
    try:
        skills = user_model.fetch_skills(target_user_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500
    user["skills"] = skills
    return {"user": user}, 200
