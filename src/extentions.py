from flask_jwt_extended import JWTManager
jwt = JWTManager()
from flask import Flask
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()
from  flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()