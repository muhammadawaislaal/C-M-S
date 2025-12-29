from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()
jwt=JWTManager()
bcrypt=Bcrypt()