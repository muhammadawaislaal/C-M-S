import requests, json, time
BASE='http://127.0.0.1:5000'

# create admin if none exists - try registering a test admin
print('Registering admin...')
try:
    r = requests.post(BASE + '/register', json={'name':'smoke admin','email':'smoke_admin@example.com','password':'Password123'})
    print('register', r.status_code, r.text)
except Exception as e:
    print('register exception', e)

# login admin
print('Logging in admin...')
r = requests.post(BASE + '/login', json={'email':'smoke_admin@example.com','password':'Password123'})
print('login', r.status_code, r.text)
if r.status_code!=200:
    print('Cannot continue without admin token')
    exit(1)

token = r.json().get('token')
headers={'Authorization': f'Bearer {token}'}

# create course quickly (if endpoint exists)
print('Creating sample course...')
rc = requests.post(BASE + '/admin/add_course', json={'title':'Smoke Course', 'description':'smoke'}, headers=headers)
print('add course', rc.status_code, rc.text)
course_id = None
if rc.status_code==201:
    course_id = rc.json().get('course_id')
else:
    # fall back to listing courses and picking first
    rc2 = requests.get(BASE + '/admin/courses', headers=headers)
    print('list courses', rc2.status_code)
    if rc2.status_code==200 and rc2.json().get('courses'):
        course_id = rc2.json()['courses'][0]['id']
print('course_id', course_id)

# create quiz
print('Creating quiz...')
rq = requests.post(BASE + '/assess/quiz', json={'title':'Smoke Quiz','course_id': course_id}, headers=headers)
print('create quiz', rq.status_code, rq.text)
quiz_id = rq.json().get('quiz_id') if rq.status_code==201 else None

# add question
print('Adding question...')
rq2 = requests.post(BASE + f'/assess/quiz/{quiz_id}/question', json={'question_type':'essay','prompt':'Explain X','points':5}, headers=headers)
print('add question', rq2.status_code, rq2.text)

# create announcement
print('Creating announcement...')
ra = requests.post(BASE + f'/comm/announcements/{course_id}', json={'title':'Smoke','content':'smoke announcement'}, headers=headers)
print('create ann', ra.status_code, ra.text)
ann_id = ra.json().get('id') if ra.status_code==201 else None

# delete quiz
if quiz_id:
    print('Deleting quiz', quiz_id)
    rd = requests.delete(BASE + f'/assess/quiz/{quiz_id}', headers=headers)
    print('delete quiz', rd.status_code, rd.text)

# delete announcement
if ann_id:
    print('Deleting announcement', ann_id)
    rd2 = requests.delete(BASE + f'/comm/announcements/{ann_id}', headers=headers)
    print('delete ann', rd2.status_code, rd2.text)

print('Smoke test complete')
