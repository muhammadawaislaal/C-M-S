import requests, json
ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2NzA5MTM2MiwianRpIjoiYTg1NDMxMWItMjI4My00NTQwLWExNGMtMTZjZTlkNDk3OTNkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjIiLCJuYmYiOjE3NjcwOTEzNjIsImNzcmYiOiIzNGU5MWE4NC1iZjM4LTQ1NGQtYTE5NS0xMWFlMDFiYjllMTEiLCJleHAiOjE3NjcxMDkzNjIsInJvbGUiOiJhZG1pbiJ9.jVXi-KGeJuyQBinPcQN8RtaW3w4M8XSGufxM6D2jQZE'
headers = {'Authorization': 'Bearer '+ADMIN_TOKEN, 'Content-Type': 'application/json'}
# First get students
resp = requests.get('http://127.0.0.1:5000/admin/students', headers=headers)
print('GET STUDENTS', resp.status_code)
try:
    data = resp.json()
    print(json.dumps(data, indent=2))
    students = data.get('students') or []
    if not students:
        print('no students to test')
    else:
        sid = students[0]['id']
        # try update
        up = requests.put(f'http://127.0.0.1:5000/admin/students/{sid}', headers=headers, json={'name': 'Updated Name'})
        print('UPDATE', up.status_code, up.text)
        # try delete
        dl = requests.delete(f'http://127.0.0.1:5000/admin/students/{sid}', headers=headers)
        print('DELETE', dl.status_code, dl.text)
except Exception as e:
    print('ERR', e)
    print(resp.text)
