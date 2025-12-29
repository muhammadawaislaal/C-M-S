
from src.extensions import db
from datetime import datetime

class Course(db.Model):
    __tablename__ = "courses"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)  
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default="inactive")
    created_at = db.Column(db.DateTime, default=datetime.now)


    lectures = db.relationship("Lecture", backref="course", cascade="all, delete-orphan")
    enrollments = db.relationship("Enrollment", backref="course", cascade="all, delete-orphan")