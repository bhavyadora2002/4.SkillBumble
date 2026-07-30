from flask import Blueprint, jsonify
from src.controllers import skills_controller

skills_bp = Blueprint("skills", __name__, url_prefix="/api/skills")


@skills_bp.route("", methods=["GET"])
def list_skills():
    result, status = skills_controller.list_skills()
    return jsonify(result), status
