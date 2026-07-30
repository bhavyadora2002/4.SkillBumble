from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from src.controllers import user_controller

user_bp = Blueprint("user", __name__, url_prefix="/api/users")


@user_bp.route("/<user_id>", methods=["GET"])
@jwt_required()
def get_profile(user_id):
    result, status = user_controller.get_profile(user_id)
    return jsonify(result), status
