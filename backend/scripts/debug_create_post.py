import requests
BASE='http://127.0.0.1:5000'
admin_email='smoke_admin@example.com'
admin_pass='Password123'

r = requests.post(BASE + '/login', json={'email':admin_email,'password':admin_pass})
print('login', r.status_code, r.text)
token = r.json().get('token')
headers={'Authorization': f'Bearer {token}'}

# list courses
rc = requests.get(BASE + '/admin/courses', headers=headers)
print('courses', rc.status_code, rc.text)
course_id = rc.json()['courses'][0]['id']

# create forum
rf = requests.post(BASE + f'/comm/forums/{course_id}/create', json={'title':'DBG Forum'}, headers=headers)
print('create forum', rf.status_code, rf.text)
forum_id = rf.json().get('id')

# create post as admin (should be allowed)
rp = requests.post(BASE + f'/comm/forums/{forum_id}/posts', json={'content':'Testing post creation'}, headers=headers)
print('create post', rp.status_code, rp.text)
