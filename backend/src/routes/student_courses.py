from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from src.models.course import Course
from src.models.enrollment import Enrollment
from src.extensions import db

student_courses_bp = Blueprint("student_courses", __name__)

# student view active courses
@student_courses_bp.route("/api/student/view_active/courses", methods=["GET"])
@jwt_required()
def active_courses():
    claims = get_jwt()
    if claims.get("role") != "student":
        return jsonify({"msg": "Student access required"}), 403

    courses = Course.query.filter_by(status="active").all()
    result = [{"id": c.id, "title": c.title, "description": c.description} for c in courses]
    return jsonify(result), 200




