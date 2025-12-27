from flask import Blueprint, request, jsonify
from src.extentions import db
from src.models.course import Course
from src.models.course_video import CourseVideo
from src.models.course_enrollment import CourseEnrollment
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os

course_management = Blueprint("course_management", __name__)

UPLOAD_DIR = "uploaded_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@course_management.route("/api/create_course", methods=["POST"])
def create_course():
    data = request.get_json()
    course = Course(
        name=data["name"],
        description=data.get("description"),
        course_duration=data["course_duration"]
    )
    db.session.add(course)
    db.session.commit()
    return jsonify({"message": "course created"})


@course_management.route("/api/show-courses", methods=["GET"])
def list_courses():
    courses = Course.query.all()
    return jsonify([
        {"id": c.id, "name": c.name, "description": c.description, "duration": c.course_duration}
        for c in courses
    ])


@course_management.route("/api/update_course/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "course not found"}), 404
    data = request.get_json()
    course.name = data.get("name", course.name)
    course.description = data.get("description", course.description)
    course.course_duration = data.get("course_duration", course.course_duration)
    db.session.commit()
    return jsonify({"message": "course updated"})


@course_management.route("/api/delete_course/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "course not found"}), 404
    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "course deleted"})


@course_management.route("/api/courses/<int:course_id>/videos", methods=["POST"])
def add_video(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"message": "course not found"}), 404

    title = request.form.get("title")
    description = request.form.get("description")

    file = request.files.get("file")
    file_path = None
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_DIR, filename)
        file.save(file_path)

    video = CourseVideo(
        course_id=course.id,
        title=title,
        description=description,
        file_path=file_path
    )
    db.session.add(video)
    db.session.commit()
    return jsonify({"message": "video added"})


@course_management.route("/api/enroll/<int:course_id>", methods=["POST"])
@jwt_required()
def enroll_course(course_id):
    user_id = get_jwt_identity()
    enrollment = CourseEnrollment(user_id=user_id, course_id=course_id)
    db.session.add(enrollment)
    db.session.commit()
    return jsonify({"message": "enrolled"})


@course_management.route("/api/my_courses", methods=["GET"])
@jwt_required()
def my_courses():
    user_id = get_jwt_identity()
    enrollments = CourseEnrollment.query.filter_by(user_id=user_id).all()
    return jsonify([{"course": e.course.name, "status": e.status} for e in enrollments])


@course_management.route("/api/completed_courses", methods=["GET"])
@jwt_required()
def completed_courses():
    user_id = get_jwt_identity()
    enrollments = CourseEnrollment.query.filter_by(user_id=user_id, status="completed").all()
    return jsonify([e.course.name for e in enrollments])
