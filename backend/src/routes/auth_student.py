from flask import Blueprint, request, jsonify
from src.models.student import Student
from src.extensions import db
from flask_jwt_extended import create_access_token
from src.schemas.auth_student_login_schema import StudentLoginSchema
from src.schemas.auth_student_register_schema import StudentRegisterSchema
from marshmallow import ValidationError


auth_student_bp = Blueprint('auth_student', __name__)

# Student register route
@auth_student_bp.route('/api/student/register', methods=['POST'])
def student_register():
    data = request.get_json()
    schema = StudentRegisterSchema()

    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    if Student.query.filter_by(email=validated_data['email']).first():
        return jsonify({"message": "email already exists"}), 409

    new_student = Student(
        name=validated_data['name'],
        email=validated_data['email']
    )
    new_student.set_password(validated_data['password'])

    db.session.add(new_student)
    db.session.commit()

    return jsonify({"message": "student added successfully"}), 201



# Student login route
@auth_student_bp.route('/api/student/login', methods=['POST'])
def login():
    data = request.get_json()
    schema = StudentLoginSchema()

    try:
        validated_data = schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    student = Student.query.filter_by(email=validated_data['email']).first()

    if not student or not student.check_password(validated_data['password']):
        return jsonify({"message": "Invalid email or password"}), 401
    
    # token = create_access_token(identity=str(student.id))
    # token=create_access_token(identity=str({"id":admin.id,"role":admin.role}))
    token = create_access_token(
    identity=(str(student.id)),
    additional_claims={"role": "student"})

    return jsonify({
        "message": "student login successfully",
        "token": token
    }), 200
