import requests
BASE='http://127.0.0.1:5000'
r = requests.post(BASE + '/api/student/login', json={'email':'smoke_student@example.com','password':'student123'})
print('login', r.status_code, r.text)
token = r.json().get('token')
headers={'Authorization': f'Bearer {token}'}
rf = requests.post(BASE + f'/comm/forums/1/posts', json={'content':'student test post'}, headers=headers)
print('create post', rf.status_code, rf.text)
