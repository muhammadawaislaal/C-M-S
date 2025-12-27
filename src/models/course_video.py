from src.extentions import db
from datetime import datetime

class CourseVideo(db.Model):
    __tablename__ = "course_videos"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    file_path = db.Column(db.String(500))
    embed_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
