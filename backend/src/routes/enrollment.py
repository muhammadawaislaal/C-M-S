# src/routes/enrollment.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from src.extensions import db
from src.models.enrollment import Enrollment
from src.models.course import Course

student_enrollment_bp = Blueprint("student_enrollment", __name__)

# student enroll in a course
@student_enrollment_bp.route("/enroll/<int:course_id>", methods=["POST"])
@jwt_required()
def enroll_course(course_id):
    try:
        claims = get_jwt()
        if claims.get("role") != "student":
            return jsonify({"msg": "Student access required"}), 403

        # student_id = get_jwt_identity()["id"]
        student_id = int(get_jwt_identity())

        course = Course.query.get(course_id)
        if not course or course.status != "active":
            return jsonify({"msg": "Course not available"}), 404

        existing = Enrollment.query.filter_by(
            student_id=student_id,
            course_id=course_id
        ).first()

        if existing:
            return jsonify({"msg": "Already enrolled"}), 400

        enrollment = Enrollment(
            student_id=student_id,
            course_id=course_id
        )

        db.session.add(enrollment)
        db.session.commit()

        return jsonify({"msg": "Enrolled successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
