import requests, json
ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6ZmFsc2UsImlhdCI6MTc2NzA5MTM2MiwianRpIjoiYTg1NDMxMWItMjI4My00NTQwLWExNGMtMTZjZTlkNDk3OTNkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjIiLCJuYmYiOjE3NjcwOTEzNjIsImNzcmYiOiIzNGU5MWE4NC1iZjM4LTQ1NGQtYTE5NS0xMWFlMDFiYjllMTEiLCJleHAiOjE3NjcxMDkzNjIsInJvbGUiOiJhZG1pbiJ9.jVXi-KGeJuyQBinPcQN8RtaW3w4M8XSGufxM6D2jQZE'
headers = {'Authorization': 'Bearer '+ADMIN_TOKEN, 'Content-Type': 'application/json'}
# get students
resp = requests.get('http://127.0.0.1:5000/admin/students', headers=headers)
print('GET STUDENTS', resp.status_code)
try:
    data = resp.json()
    students = data.get('students') or []
    if not students:
        print('no students to test')
    else:
        sid = students[0]['id']
        print('Testing student id', sid)
        # check lecture_progress rows
        r = requests.get(f'http://127.0.0.1:5000/admin/students/{sid}', headers=headers)
        print('GET student', r.status_code, r.text)
        # Try to fetch lecture_progress via admin-only helper (not available) so use existing DB direct API - none present
        # Instead attempt delete via special admin endpoint that we will add temporarily: /admin/_diag_delete_student/<id>
        dd = requests.delete(f'http://127.0.0.1:5000/admin/students/{sid}', headers=headers)
        print('DELETE', dd.status_code, dd.text)
except Exception as e:
    print('ERR', e)
    print(resp.text)
