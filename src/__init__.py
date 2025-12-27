from flask import Flask
from src.extentions import db, jwt
from src.routes.coursess import course_management

def create_app():
    app = Flask(__name__)
    app.register_blueprint(course_management)

    app.config["JWT_SECRET_KEY"] = "secret"
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/cms"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    jwt.init_app(app)

   

    with app.app_context():
        db.create_all()

    return app
