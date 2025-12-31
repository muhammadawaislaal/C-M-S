from src import create_app
from src.extensions import db
from src.models.student import Student

app = create_app()
with app.app_context():
    students = Student.query.all()
    for s in students:
        print(s.id, s.name, s.email, s.password)
    if not students:
        print('No students found')
