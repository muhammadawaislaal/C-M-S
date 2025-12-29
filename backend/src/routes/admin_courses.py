from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from marshmallow import ValidationError
from src.extensions import db
from src.models.course import Course
from src.schemas.course_schema import CourseSchema
from src.models.lecture_progress import LectureProgress
from src.models.lecture import Lecture


admin_courses_bp = Blueprint('admin_courses', __name__, url_prefix='/admin')  # Added url_prefix

# Admin add course
@admin_courses_bp.route("/add_course", methods=["POST"])
@jwt_required()
def add_course():
    try:
        # Role check
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admin access required"}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({"msg": "No data provided"}), 400
        
        schema = CourseSchema()
        validated = schema.load(data)

        # Check if course with same title already exists
        existing_course = Course.query.filter_by(title=validated["title"]).first()
        if existing_course:
            return jsonify({"msg": "Course with this title already exists"}), 409
        
        course = Course(**validated)
        db.session.add(course)
        db.session.commit()
        
        return jsonify({
            "msg": "Course added successfully",
            "course": {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "status": course.status
            }
        }), 201
        
    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500


# Admin update course
@admin_courses_bp.route("/update_course/<int:course_id>", methods=["PUT"])
@jwt_required()
def update_course(course_id):
    try:
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admin access required"}), 403
        
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"msg": "Course not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"msg": "No data provided"}), 400
        
        schema = CourseSchema()
        validated = schema.load(data, partial=True)

        for key, value in validated.items():
            setattr(course, key, value)

        db.session.commit()
        return jsonify({"msg": "Course updated successfully"}), 200

    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500


# Admin delete course
@admin_courses_bp.route("/delete_course/<int:course_id>", methods=["DELETE"])
@jwt_required()
def delete_course(course_id):
    try:
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admin access required"}), 403

        course = Course.query.get(course_id)
        if not course:
            return jsonify({"msg": "Course not found"}), 404

        # Get all lectures of the course
        lectures = Lecture.query.filter_by(course_id=course_id).all()

        # Delete lecture progress first
        lecture_ids = [lec.id for lec in lectures]

        if lecture_ids:
            LectureProgress.query.filter(
                LectureProgress.lecture_id.in_(lecture_ids)
            ).delete(synchronize_session=False)

        # Delete lectures
        Lecture.query.filter_by(course_id=course_id).delete()

        # Delete course
        db.session.delete(course)

        db.session.commit()
        return jsonify({"msg": "Course and all related data deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500

 
# Admin get all courses - IMPORTANT: Fixed endpoint
@admin_courses_bp.route("/courses", methods=["GET"])  # This will be /admin/courses
@jwt_required()
def get_all_courses():
    try:
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admin access required"}), 403

        courses = Course.query.all()
        schema = CourseSchema(many=True)
        courses_data = schema.dump(courses)

        # Ensure each course has an 'id' field
        for course in courses_data:
            # If your schema doesn't include id, add it manually
            if 'id' not in course:
                course_obj = Course.query.filter_by(title=course['title']).first()
                if course_obj:
                    course['id'] = course_obj.id
        
        return jsonify({"courses": courses_data}), 200

    except Exception as e:
        return jsonify({"msg": str(e)}), 500