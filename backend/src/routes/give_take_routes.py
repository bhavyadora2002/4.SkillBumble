from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.controllers import give_take_controller

give_take_bp = Blueprint("give_take", __name__, url_prefix="/api/give-take")


@give_take_bp.route("/posts", methods=["POST"])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    body = request.get_json(silent=True) or {}
    result, status = give_take_controller.create_post(body, user_id)
    return jsonify(result), status


@give_take_bp.route("/posts", methods=["GET"])
@jwt_required()
def list_posts():
    user_id = get_jwt_identity()
    result, status = give_take_controller.list_posts(user_id)
    return jsonify(result), status


@give_take_bp.route("/posts/<post_id>", methods=["GET"])
@jwt_required()
def get_post(post_id):
    result, status = give_take_controller.get_post(post_id)
    return jsonify(result), status
