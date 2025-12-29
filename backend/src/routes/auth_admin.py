from flask import Blueprint,request,jsonify
from src.models.admin import Admin
from src.extensions import db
from flask_jwt_extended import create_access_token

from src.schemas.auth_admin_login_schema import LoginSchema
from src.schemas.auth_admin_register_schema import RegisterSchema

from marshmallow import ValidationError


auth_admin_bp=Blueprint('auth_admin',__name__)
# Admin register route
@auth_admin_bp.route('/register', methods=['POST'])
def  register():

    data=request.get_json()
    Schema=RegisterSchema()
    try:
        validate_data=Schema.load(data)
    except ValidationError as err:
        return jsonify({
            "errors":err.messages
        })

    
    name = validate_data['name']
    email = validate_data['email']
    password = validate_data['password']
    

    if not name or not email or not password :
        return jsonify({
            "message":"name or email and  password    are required "
        })
    register_admin=Admin.query.filter_by(email=email).first()
    if register_admin:
        return jsonify({
            "message":"email already exists"
        })
   
    new_admin=Admin(name=name,email=email)
    new_admin.set_password(password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify ({
        "message":" Admin added successfully "
    })





# Admin login
@auth_admin_bp.route('/login', methods=['POST'])
def login():
    data=request.get_json()
    schema=LoginSchema()
    try:
       validate_data=schema.load(data)
    except ValidationError as err:
        return jsonify({
            "errors":err.messages
        })
    email = validate_data['email']
    password = validate_data['password']

    if not email or not password :
        return jsonify({
            "message":"email and password are required"
        })

    admin = Admin.query.filter_by(email=email).first()

    if not admin  or not admin.check_password(password):
        return jsonify({
            "message": "Invalid email or password "
        }), 401
    # token=create_access_token(identity=str({"id":admin.id,"role":"admin"}))
    token = create_access_token(
    identity=(str(admin.id)),
    additional_claims={"role": "admin"})

    return jsonify({
        "message":"Admin login successfully",
        "token":token
    })

     
