from src.models import give_take_model, match_model, user_model


def request_match(data, requester_id):
    post_id = data.get("post_id")
    if not post_id:
        return {"error": "post_id is required"}, 400

    try:
        post = give_take_model.find_post_by_id(post_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500

    if not post:
        return {"error": "post not found"}, 404

    if post["user_id"] == requester_id:
        return {"error": "cannot match your own post"}, 400

    if post["status"] != "open":
        return {"error": "post is no longer open"}, 400

    owner_id = post["user_id"]
    owner_skill_id = post["skill_id"]

    requester_skills = user_model.fetch_skills(requester_id)
    if not requester_skills:
        return {"error": "you must have skills on your profile to request a match"}, 400

    if post["type"] == "teach":
        teach_skill_id = owner_skill_id
        learn_skill_id = requester_skills[0]["skill_id"]
    else:
        learn_skill_id = owner_skill_id
        teach_skill_id = requester_skills[0]["skill_id"]

    try:
        match = match_model.create_match(post_id, requester_id, owner_id, teach_skill_id, learn_skill_id)
    except Exception as e:
        return {"error": "could not create match"}, 409

    return {"match": match}, 201


def list_matches(user_id):
    try:
        matches = match_model.list_matches_for_user(user_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500

    enriched = []
    for m in matches:
        is_owner = m["user1_id"] == user_id
        other_id = m["user2_id"] if is_owner else m["user1_id"]
        other = user_model.find_by_id(other_id)
        other_skills = user_model.fetch_skills(other_id)
        my_role = m["post_type"] if is_owner else ("learn" if m["post_type"] == "teach" else "teach")
        entry = {
            "match_id": m["match_id"],
            "post_id": m["post_id"],
            "post_title": m["post_title"],
            "post_skill_name": m["post_skill_name"],
            "post_type": m["post_type"],
            "my_role": my_role,
            "post_proficiency": m["post_proficiency"],
            "status": m["match_status"],
            "direction": "confirmed" if m["match_status"] == "confirmed" else ("incoming" if is_owner else "outgoing"),
            "other_user": {
                "user_id": other["user_id"],
                "name": other["name"],
                "bio": other["bio"],
                "meeting_link": other["meeting_link"],
                "rating_overall": float(other["rating_overall"]) if other["rating_overall"] is not None else None,
                "skills": other_skills,
            } if other else None,
            "created_at": m["created_at"].isoformat() if m["created_at"] else None,
        }
        enriched.append(entry)
    return {"matches": enriched}, 200


def respond_to_match(match_id, status, user_id):
    if status not in ("confirmed", "cancelled"):
        return {"error": "status must be 'confirmed' or 'cancelled'"}, 400

    try:
        match = match_model.find_match_by_id(match_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500

    if not match:
        return {"error": "match not found"}, 404

    if match["owner_user_id"] != user_id:
        return {"error": "only the post owner can accept or reject"}, 403

    if match["match_status"] != "pending":
        return {"error": "match already responded to"}, 400

    try:
        match_model.update_match_status(match_id, status)
        if status == "confirmed":
            give_take_model.update_post_status(match["post_id"], "matched")
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500

    try:
        updated = match_model.find_match_by_id(match_id)
    except Exception as e:
        return {"error": f"Database error: {str(e)}"}, 500
    return {"match": updated}, 200
