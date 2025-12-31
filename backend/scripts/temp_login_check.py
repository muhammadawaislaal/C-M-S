import requests
print('login...')
r = requests.post('http://127.0.0.1:5000/api/student/login', json={"email":"persist_test2@example.com","password":"persistpass123"})
print('STATUS', r.status_code)
print('BODY', r.text)
