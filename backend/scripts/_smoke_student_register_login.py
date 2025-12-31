import requests
BASE='http://127.0.0.1:5000'
print('Registering student...')
r = requests.post(BASE + '/api/student/register', json={'name':'Smoke Student','email':'smoke_student@example.com','password':'student123'})
print('register', r.status_code, r.text)
print('Logging in student...')
r2 = requests.post(BASE + '/api/student/login', json={'email':'smoke_student@example.com','password':'student123'})
print('login', r2.status_code, r2.text)
