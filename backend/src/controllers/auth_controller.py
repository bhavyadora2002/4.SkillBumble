from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
import mysql.connector
from src.models import user_model

bcrypt = Bcrypt()

VALID_TYPES = {"teach", "learn"}
VALID_PROFICIENCY = {"beginner", "intermediate", "advanced", "expert"}


def _public_user(user_row):
    user = dict(user_row)
    user.pop("password_hash", None)
    return user


def _validate_skills(skills):
    for skill in skills:
        if skill.get("type") not in VALID_TYPES:
            return f"invalid skill type: {skill.get('type')}"
        if skill.get("proficiency_level", "beginner") not in VALID_PROFICIENCY:
            return f"invalid proficiency_level: {skill.get('proficiency_level')}"
        if not skill.get("skill_id"):
            return "each skill entry requires a skill_id"
    return None


def signup(data):
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    bio = data.get("bio")
    meeting_link = (data.get("meeting_link") or "").strip()
    skills = data.get("skills") or []

    if not name or not email or not password or not meeting_link:
        return {"error": "name, email, password, and meeting_link are required"}, 400

    skill_error = _validate_skills(skills)
    if skill_error:
        return {"error": skill_error}, 400

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    try:
        user_row = user_model.create_user(name, email, password_hash, bio, meeting_link)
        if skills:
            user_model.add_user_skills(user_row["user_id"], skills)
        user_row = user_model.find_by_id(user_row["user_id"])
    except mysql.connector.IntegrityError as exc:
        err_str = str(exc).lower()
        if "email" in err_str:
            return {"error": "email already registered"}, 409
        if "meeting_link" in err_str:
            return {"error": "meeting link already in use"}, 409
        return {"error": "could not create user"}, 409

    user = _public_user(user_row)
    user["skills"] = user_model.fetch_skills(user_row["user_id"])
    token = create_access_token(identity=user_row["user_id"])
    return {"token": token, "user": user}, 201


def login(data):
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return {"error": "email and password are required"}, 400

    user_row = user_model.find_by_email(email)
    if not user_row or not bcrypt.check_password_hash(user_row["password_hash"], password):
        return {"error": "invalid email or password"}, 401

    user = _public_user(user_row)
    user["skills"] = user_model.fetch_skills(user_row["user_id"])
    token = create_access_token(identity=user_row["user_id"])
    return {"token": token, "user": user}, 200


def get_me(user_id):
    user_row = user_model.find_by_id(user_id)
    if not user_row:
        return {"error": "user not found"}, 404

    user = _public_user(user_row)
    user["skills"] = user_model.fetch_skills(user_id)
    return {"user": user}, 200
