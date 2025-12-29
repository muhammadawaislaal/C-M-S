from flask import Flask
from src.extensions import bcrypt,jwt,db
from datetime import timedelta
from flask_cors import CORS

from src.routes.auth_student import auth_student_bp
from src.routes.auth_admin import auth_admin_bp
from src.routes.admin_courses import admin_courses_bp
from src.routes.student_courses import student_courses_bp
from src.routes.admin_lectures import admin_lectures_bp
from src.routes.enrollment import student_enrollment_bp
from src.routes.student_lectures import student_lecture_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
    app.register_blueprint(auth_student_bp)
    app.register_blueprint(admin_courses_bp)
    app.register_blueprint(student_courses_bp)
    app.register_blueprint(admin_lectures_bp)
    app.register_blueprint(student_enrollment_bp)
    app.register_blueprint(student_lecture_bp)
    app.register_blueprint(auth_admin_bp)
    app.config['JWT_SECRET_KEY']='I_AM_Awais_laal'
    app.config['SQLALCHEMY_DATABASE_URI'] = (
    'mysql+pymysql://root:@localhost/cms'
)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)



    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    with app.app_context():
        db.create_all()


    return app
