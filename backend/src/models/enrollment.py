from src.extensions import db
from datetime import datetime

class Enrollment(db.Model):
    __tablename__ = "enrollments"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    status = db.Column(db.String(50), default="enrolled")  # enrolled / completed
    created_at = db.Column(db.DateTime, default=datetime.now)
