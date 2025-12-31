from flask import Blueprint, request, jsonify, current_app
from src.models.student import Student
from src.extensions import db
from flask_jwt_extended import create_access_token
from src.schemas.auth_student_login_schema import StudentLoginSchema
from src.schemas.auth_student_register_schema import StudentRegisterSchema
from marshmallow import ValidationError


auth_student_bp = Blueprint('auth_student', __name__)
@auth_student_bp.route('/api/student/register', methods=['POST'])
def student_register():
    try:
        raw = request.get_data(as_text=True)
    except Exception:
        raw = '<unreadable>'
    current_app.logger.info("[student_register] request headers: %s", dict(request.headers))
    current_app.logger.info("[student_register] raw body: %s", raw)
    data = request.get_json(silent=True)
    current_app.logger.info("[student_register] parsed json: %s", data)

    # Basic checks to provide clearer errors to frontend
    if not request.content_type or 'application/json' not in request.content_type:
        msg = 'Content-Type must be application/json'
        current_app.logger.info('[student_register] missing/incorrect content-type')
        return jsonify({'message': msg}), 400
    # Accept frontend aliases: some frontend pages send `username` instead of `name`, and may include a `role` field.
    if data and 'username' in data and 'name' not in data:
        data['name'] = data.pop('username')

    # Remove `role` if present (server assigns roles internally)
    if data and 'role' in data:
        data.pop('role', None)

    if not data:
        msg = 'Empty or invalid JSON body'
        current_app.logger.info('[student_register] empty/invalid json body')
        return jsonify({'message': msg}), 400
    if 'name' not in data or 'email' not in data or 'password' not in data:
        msg = 'Missing required fields: name, email, password'
        current_app.logger.info('[student_register] missing required fields')
        return jsonify({'message': msg}), 400
    schema = StudentRegisterSchema()

    try:
        validated_data = schema.load(data or {})
    except ValidationError as err:
        current_app.logger.info("[student_register] validation errors: %s", err.messages)
        # also persist debug info to a file for environments where stdout isn't captured
        try:
            import os, datetime, json
            log_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')
            os.makedirs(log_dir, exist_ok=True)
            with open(os.path.join(log_dir, 'student_register.log'), 'a', encoding='utf-8') as fh:
                fh.write(f"=== {datetime.datetime.utcnow().isoformat()}Z ===\n")
                fh.write("HEADERS:\n")
                fh.write(json.dumps(dict(request.headers), default=str) + "\n")
                fh.write("RAW_BODY:\n")
                fh.write((request.get_data(as_text=True) or '') + "\n")
                fh.write("PARSED_JSON:\n")
                fh.write(json.dumps(data or {}, ensure_ascii=False) + "\n")
                fh.write("VALIDATION_ERRORS:\n")
                fh.write(json.dumps(err.messages, ensure_ascii=False) + "\n\n")
        except Exception:
            current_app.logger.exception('Failed to write student_register.log')
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
@auth_student_bp.route('/api/student/login', methods=['POST'])
def login():
    try:
        raw = request.get_data(as_text=True)
    except Exception:
        raw = '<unreadable>'
    current_app.logger.info('[student_login] headers: %s', dict(request.headers))
    current_app.logger.info('[student_login] raw body: %s', raw)
    data = request.get_json(silent=True)
    schema = StudentLoginSchema()

    try:
        validated_data = schema.load(data or {})
    except ValidationError as err:
        current_app.logger.info('[student_login] validation errors: %s', err.messages)
        return jsonify({"errors": err.messages}), 400

    student = Student.query.filter_by(email=validated_data['email']).first()

    if not student or not student.check_password(validated_data['password']):
        return jsonify({"message": "Invalid email or password"}), 401
    token = create_access_token(identity=str(student.id), additional_claims={"role": "student"})

    return jsonify({
        "message": "student login successfully",
        "token": token
    }), 200
