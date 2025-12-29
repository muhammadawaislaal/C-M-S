from src.extensions import db
from datetime import datetime

class LectureProgress(db.Model):
    __tablename__ = "lecture_progress"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    lecture_id = db.Column(db.Integer, db.ForeignKey("lectures.id"), nullable=False)
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)
