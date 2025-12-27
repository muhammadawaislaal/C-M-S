from src.extentions import db
from datetime import datetime

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    course_duration = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    videos = db.relationship("CourseVideo", backref="course", lazy=True)
    enrollments = db.relationship("CourseEnrollment", backref="course", lazy=True)
