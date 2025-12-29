from src.extensions import db
from datetime import datetime

class Lecture(db.Model):
    __tablename__ = "lectures"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # video / pdf
    content_url = db.Column(db.String(500), nullable=False)
    order_number = db.Column(db.Integer, nullable=False)  # sequence in course
    created_at = db.Column(db.DateTime, default=datetime.now)
