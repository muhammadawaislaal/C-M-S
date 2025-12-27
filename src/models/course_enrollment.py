from src.extentions import db
from datetime import datetime

class CourseEnrollment(db.Model):
    __tablename__ = "course_enrollments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    status = db.Column(db.String(50), default="enrolled")
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
