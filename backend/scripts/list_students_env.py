import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src import create_app
from src.models.student import Student
app = create_app()
with app.app_context():
    students = Student.query.all()
    for s in students:
        print(s.id, s.email, s.password)
    if not students:
        print('No students')
