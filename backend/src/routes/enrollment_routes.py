from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from src.controllers import enrollment_controller

enrollment_bp = Blueprint("enrollment", __name__, url_prefix="/api/enrollment")


@enrollment_bp.route("/posts", methods=["GET"])
@jwt_required()
def list_enrollment_posts():
    user_id = get_jwt_identity()
    result, status = enrollment_controller.list_enrollment_posts(user_id)
    return jsonify(result), status


@enrollment_bp.route("/enroll", methods=["POST"])
@jwt_required()
def enroll():
    user_id = get_jwt_identity()
    body = request.get_json(silent=True) or {}
    result, status = enrollment_controller.enroll(body, user_id)
    return jsonify(result), status


@enrollment_bp.route("/my-enrollments", methods=["GET"])
@jwt_required()
def list_my_enrollments():
    user_id = get_jwt_identity()
    result, status = enrollment_controller.list_my_enrollments(user_id)
    return jsonify(result), status


@enrollment_bp.route("/my-students", methods=["GET"])
@jwt_required()
def list_my_students():
    user_id = get_jwt_identity()
    result, status = enrollment_controller.list_my_students(user_id)
    return jsonify(result), status
