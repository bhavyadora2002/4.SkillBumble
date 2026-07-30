from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.controllers import match_controller

match_bp = Blueprint("match", __name__, url_prefix="/api/matches")


@match_bp.route("", methods=["POST"])
@jwt_required()
def request_match():
    user_id = get_jwt_identity()
    body = request.get_json(silent=True) or {}
    result, status = match_controller.request_match(body, user_id)
    return jsonify(result), status


@match_bp.route("", methods=["GET"])
@jwt_required()
def list_matches():
    user_id = get_jwt_identity()
    result, status = match_controller.list_matches(user_id)
    return jsonify(result), status


@match_bp.route("/<match_id>", methods=["PUT"])
@jwt_required()
def respond_to_match(match_id):
    user_id = get_jwt_identity()
    body = request.get_json(silent=True) or {}
    status_val = body.get("status")
    result, status_code = match_controller.respond_to_match(match_id, status_val, user_id)
    return jsonify(result), status_code
