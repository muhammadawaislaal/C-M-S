# src/routes/student_lectures.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from datetime import datetime

from src.extensions import db
from src.models.lecture import Lecture
from src.models.lecture_progress import LectureProgress

student_lecture_bp = Blueprint("student_lectures",__name__)

# student get course lectures with progress
@student_lecture_bp.route("/get_course/lectures/<int:course_id>", methods=["GET"])
@jwt_required()
def get_course_lectures(course_id):
    try:
        claims = get_jwt()
        if claims.get("role") != "student":
            return jsonify({"msg": "Student access required"}), 403

        student_id = int(get_jwt_identity())

        lectures = Lecture.query.filter_by(course_id=course_id) \
            .order_by(Lecture.order_number).all()

        response = []
        unlocked = True

        for lecture in lectures:
            progress = LectureProgress.query.filter_by(
                student_id=student_id,
                lecture_id=lecture.id
            ).first()

            response.append({
                "id": lecture.id,
                "title": lecture.title,
                "type": lecture.type,
                "content_url": lecture.content_url if unlocked else None,
                "is_locked": not unlocked,
                "is_completed": progress.is_completed if progress else False
            })

            if not progress or not progress.is_completed:
                unlocked = False

        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            "msg": "Failed to fetch course lectures",
            "error": str(e)
        }), 500


# student complete lecture
@student_lecture_bp.route("/lecture/complete/<int:lecture_id>", methods=["POST"])
@jwt_required()
def complete_lecture(lecture_id):
    try:
        claims = get_jwt()
        if claims.get("role") != "student":
            return jsonify({"msg": "Student access required"}), 403

        student_id = int(get_jwt_identity())
         # Check if lecture exists
        lecture = Lecture.query.get(lecture_id)
        if not lecture:
            return jsonify({
                "msg": f"Lecture with order number {lecture_id} does not exist in this course."
            }), 404

        progress = LectureProgress.query.filter_by(
            student_id=student_id,
            lecture_id=lecture_id
        ).first()

        if progress and progress.is_completed:
            return jsonify({"msg": "Lecture already completed"}), 400

        if not progress:
            progress = LectureProgress(
                student_id=student_id,
                lecture_id=lecture_id,
                is_completed=True,
                completed_at=datetime.utcnow()
            )
            db.session.add(progress)
        else:
            progress.is_completed = True
            progress.completed_at = datetime.now()

        db.session.commit()

        return jsonify({"msg": "Lecture marked as completed"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Failed to complete lecture",
            "error": str(e)
        }), 500

