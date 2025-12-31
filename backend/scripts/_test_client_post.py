import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src import create_app
from flask_jwt_extended import create_access_token

app = create_app()
app.config['TESTING'] = True
with app.app_context():
    # create a token for existing student id 6 if present
    from src.models.student import Student
    s = Student.query.first()
    if not s:
        print('no students to test with')
        sys.exit(1)
    token = create_access_token(identity=str(s.id), additional_claims={'role':'student'})
    headers = {'Authorization': f'Bearer {token}', 'Content-Type':'application/json'}
    client = app.test_client()
    resp = client.post(f'/comm/forums/{1}/posts', json={'content':'test via client'}, headers=headers)
    print('status', resp.status_code)
    print('data', resp.get_data(as_text=True))
