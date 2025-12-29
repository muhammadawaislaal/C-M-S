from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from marshmallow import ValidationError
from src.extensions import db
from src.models.lecture import Lecture
from src.models.course import Course
from src.schemas.lecture_schema import LectureSchema
from werkzeug.utils import secure_filename
import os
import time
admin_lectures_bp = Blueprint("admin_lectures", __name__)

# only admin can add lecture
@admin_lectures_bp.route("/lecture/add", methods=["POST"])
@jwt_required()
def add_lecture():
    try:

        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admin access required"}), 403

    
        data=request.get_json() if request.is_json else request.form
        schema = LectureSchema()
        validated = schema.load(data)

        # Check course exists
        course = Course.query.get(validated["course_id"])
        if not course:
            return jsonify({"msg": "Course not found"}), 404

        # Check lecture order uniqueness
        existing = Lecture.query.filter_by(
            course_id=validated["course_id"],
            order_number=validated["order_number"]
        ).first()
        if existing:
            return jsonify({
                "msg": "Lecture with this order already exists in the course"
            }), 400
         #  Handle content
        content_url = None

        if validated["type"] == "pdf":
            # Accept multiple possible file field names from different frontends
            file = request.files.get("content_url") or request.files.get("file") or request.files.get("pdf")
            if not file or not getattr(file, 'filename', None):
                return jsonify({"msg": "PDF file is required"}), 400

            filename = secure_filename(file.filename)
            # filename = f"{int(time.time())}_{filename}"
            # Check folder existence and save file
            save_dir = os.path.join('src', 'static', 'pdf_lectures')
            if not os.path.exists(save_dir):
                os.makedirs(save_dir)
            file_path = os.path.join(save_dir, filename)
            file.save(file_path)

            # Store the path relative to the Flask static folder so files can be
            # accessed via /static/pdf_lectures/{filename}
            content_url = f"static/pdf_lectures/{filename}"

        elif validated["type"] == "video":
            # video uses URL (YouTube / Vimeo / mp4 link)
            content_url = validated.get("content_url")
            if not content_url:
                return jsonify({"msg": "Video URL is required"}), 400

        else:
            return jsonify({"msg": "Invalid lecture type"}), 400

        lecture = Lecture(
            course_id=validated["course_id"],
            title=validated["title"],
            type=validated["type"],
            content_url=content_url,
            order_number=validated["order_number"]
        )

        db.session.add(lecture)
        db.session.commit()

        return jsonify({"msg": "Lecture added successfully",
                         "lecture_id": lecture.id}), 201

    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Something went wrong",
            "error": str(e)
        }), 500


