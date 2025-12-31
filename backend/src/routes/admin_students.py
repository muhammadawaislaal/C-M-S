from flask import Blueprint, request, jsonify
from src.models.student import Student
from src.extensions import db
from src.models.lecture_progress import LectureProgress
from src.models.enrollment import Enrollment
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy import text  # Import text from sqlalchemy
import traceback

# Add url_prefix here
admin_students_bp = Blueprint('admin_students', __name__, url_prefix='/admin')

# Helper function to check if user is admin
def admin_required():
    try:
        jwt_data = get_jwt()
        if jwt_data.get('role') != 'admin':
            return False
        return True
    except Exception as e:
        print(f"Error checking admin role: {e}")
        return False

# Get all students (Admin only)
@admin_students_bp.route('/students', methods=['GET'])
@jwt_required()
def get_all_students():
    try:
        # Check admin access
        if not admin_required():
            return jsonify({"message": "Admin access required"}), 403
        
        print("Admin access verified, fetching students...")
        
        # Use text() wrapper for raw SQL queries
        result = db.session.execute(
            text("SELECT id, name, email FROM students")
        )
        
        students_list = []
        for row in result:
            student_data = {
                "id": row[0],
                "name": row[1],
                "email": row[2]
            }
            students_list.append(student_data)
        
        return jsonify({
            "message": "Students retrieved successfully",
            "students": students_list,
            "count": len(students_list)
        }), 200
        
    except Exception as e:
        print(f"ERROR in get_all_students: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "message": f"Server error: {str(e)}"
        }), 500

# Get single student by ID
@admin_students_bp.route('/students/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_by_id(student_id):
    try:
        if not admin_required():
            return jsonify({"message": "Admin access required"}), 403
        
        # Use text() wrapper for raw SQL queries
        result = db.session.execute(
            text("SELECT id, name, email FROM students WHERE id = :id"),
            {"id": student_id}
        ).fetchone()
        
        if not result:
            return jsonify({"message": "Student not found"}), 404
        
        student_data = {
            "id": result[0],
            "name": result[1],
            "email": result[2]
        }
        
        return jsonify({
            "message": "Student retrieved successfully",
            "student": student_data
        }), 200
        
    except Exception as e:
        print(f"ERROR in get_student_by_id: {str(e)}")
        return jsonify({"message": f"Server error: {str(e)}"}), 500

# Search students
@admin_students_bp.route('/students/search', methods=['GET'])
@jwt_required()
def search_students():
    try:
        if not admin_required():
            return jsonify({"message": "Admin access required"}), 403
        
        search_term = request.args.get('q', '').strip()
        
        if not search_term:
            return jsonify({"message": "Search term is required"}), 400
        
        # Search using raw SQL with text() wrapper
        result = db.session.execute(
            text("SELECT id, name, email FROM students WHERE name LIKE :term OR email LIKE :term"),
            {"term": f"%{search_term}%"}
        )
        
        students_list = []
        for row in result:
            student_data = {
                "id": row[0],
                "name": row[1],
                "email": row[2]
            }
            students_list.append(student_data)
        
        return jsonify({
            "message": "Search completed",
            "students": students_list,
            "count": len(students_list)
        }), 200
        
    except Exception as e:
        print(f"ERROR in search_students: {str(e)}")
        return jsonify({"message": f"Server error: {str(e)}"}), 500

# Update student
@admin_students_bp.route('/students/<int:student_id>', methods=['PUT'])
@jwt_required()
def update_student(student_id):
    try:
        if not admin_required():
            return jsonify({"message": "Admin access required"}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({"message": "No data provided"}), 400
        
        # Check if student exists
        student = db.session.execute(
            text("SELECT id FROM students WHERE id = :id"),
            {"id": student_id}
        ).fetchone()
        
        if not student:
            return jsonify({"message": "Student not found"}), 404
        
        # Check email uniqueness if email is being updated
        if 'email' in data and data['email']:
            existing = db.session.execute(
                text("SELECT id FROM students WHERE email = :email AND id != :id"),
                {"email": data['email'], "id": student_id}
            ).fetchone()
            
            if existing:
                return jsonify({"message": "Email already in use"}), 409
        
        # Build update query
        update_fields = []
        params = {"id": student_id}
        
        if 'name' in data and data['name']:
            update_fields.append("name = :name")
            params["name"] = data['name']
        
        if 'email' in data and data['email']:
            update_fields.append("email = :email")
            params["email"] = data['email']
        
        if update_fields:
            update_query = f"UPDATE students SET {', '.join(update_fields)} WHERE id = :id"
            db.session.execute(text(update_query), params)
            db.session.commit()
            
            # Get updated student
            updated = db.session.execute(
                text("SELECT id, name, email FROM students WHERE id = :id"),
                {"id": student_id}
            ).fetchone()
            
            return jsonify({
                "message": "Student updated successfully",
                "student": {
                    "id": updated[0],
                    "name": updated[1],
                    "email": updated[2]
                }
            }), 200
        else:
            return jsonify({"message": "No fields to update"}), 400
        
    except Exception as e:
        db.session.rollback()
        print(f"ERROR in update_student: {str(e)}")
        return jsonify({"message": f"Server error: {str(e)}"}), 500

# Delete student
@admin_students_bp.route('/students/<int:student_id>', methods=['DELETE'])
@jwt_required()
def delete_student(student_id):
    try:
        if not admin_required():
            return jsonify({"message": "Admin access required"}), 403
        
        # Check if student exists
        student = db.session.execute(
            text("SELECT id FROM students WHERE id = :id"),
            {"id": student_id}
        ).fetchone()
        
        if not student:
            return jsonify({"message": "Student not found"}), 404
        
        # Delete using ORM so relationships with cascade handle dependent rows
        student_obj = Student.query.get(student_id)
        if not student_obj:
            return jsonify({"message": "Student not found"}), 404
        try:
            db.session.delete(student_obj)
            db.session.commit()
            return jsonify({"message": "Student deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            print(f"ERROR in delete_student (ORM delete): {e}")
            import traceback
            tb = traceback.format_exc()
            try:
                with open('logs/student_delete.log', 'a', encoding='utf-8') as f:
                    f.write('\n' + '-'*80 + '\n')
                    f.write(str(e) + '\n')
                    f.write(tb + '\n')
            except Exception:
                pass
            return jsonify({"message": f"Server error: {str(e)}"}), 500
        
    except Exception as e:
        db.session.rollback()
        err_msg = f"ERROR in delete_student: {str(e)}"
        print(err_msg)
        import traceback
        tb = traceback.format_exc()
        try:
            with open('logs/student_delete.log', 'a', encoding='utf-8') as f:
                f.write('\n' + '-'*80 + '\n')
                f.write(err_msg + '\n')
                f.write(tb + '\n')
        except Exception:
            pass
        return jsonify({"message": f"Server error: {str(e)}"}), 500