import requests
BASE='http://127.0.0.1:5000'
# login student
r = requests.post(BASE + '/api/student/login', json={'email':'smoke_student@example.com','password':'student123'})
print('student login', r.status_code, r.text)
if r.status_code!=200:
    print('no student token')
    exit(1)
student_token = r.json().get('token')
headers={'Authorization': f'Bearer {student_token}'}
# find a forum
rc = requests.get(BASE + '/admin/courses', headers=headers)
print('courses', rc.status_code)
course_id = rc.json()['courses'][0]['id']
rf = requests.post(BASE + f'/comm/forums/{course_id}/create', json={'title':'Student Forum'}, headers=headers)
print('create forum', rf.status_code, rf.text)
forum_id = rf.json().get('id')
# create post as student
rp = requests.post(BASE + f'/comm/forums/{forum_id}/posts', json={'content':'student posting'}, headers=headers)
print('student create post', rp.status_code, rp.text)
