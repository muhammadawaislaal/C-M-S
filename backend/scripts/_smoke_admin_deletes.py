import requests, json, sys
BASE='http://127.0.0.1:5000'
admin_email='smoke_admin@example.com'
admin_pass='Password123'

print('Login admin...')
r = requests.post(BASE + '/login', json={'email':admin_email,'password':admin_pass})
print('login', r.status_code, r.text)
if r.status_code!=200:
    print('Ensure admin exists and credentials are correct'); sys.exit(1)
token = r.json().get('token')
headers={'Authorization': f'Bearer {token}'}

# ensure course
rc = requests.get(BASE + '/admin/courses', headers=headers)
print('list courses', rc.status_code)
course_id=None
if rc.status_code==200:
    courses = rc.json().get('courses', [])
    if courses:
        course_id = courses[0]['id']

if not course_id:
    rc = requests.post(BASE + '/admin/add_course', json={'title':'Auto Course','description':'auto'}, headers=headers)
    print('add course', rc.status_code, rc.text)
    if rc.status_code==201:
        course_id = rc.json().get('course', {}).get('id')
print('course_id', course_id)

# create quiz
rq = requests.post(BASE + '/assess/quiz', json={'title':'Auto Quiz','course_id': course_id}, headers=headers)
print('create quiz', rq.status_code, rq.text)
quiz_id = None
if rq.status_code==201:
    quiz_id = rq.json().get('quiz_id')

# add question
if quiz_id:
    rq2 = requests.post(BASE + f'/assess/quiz/{quiz_id}/question', json={'question_type':'mcq','prompt':'Pick 1','points':2, 'options':[{'text':'A','is_correct':True},{'text':'B','is_correct':False}]}, headers=headers)
    print('add question', rq2.status_code, rq2.text)
    question_id = rq2.json().get('question_id') if rq2.status_code==201 else None
else:
    question_id = None

# create forum & post
rf = requests.post(BASE + f'/comm/forums/{course_id}/create', json={'title':'Auto Forum'}, headers=headers)
print('create forum', rf.status_code, rf.text)
forum_id = rf.json().get('id') if rf.status_code==201 else None
if forum_id:
    rp = requests.post(BASE + f'/comm/forums/{forum_id}/posts', json={'content':'Hello world'}, headers=headers)
    print('create post', rp.status_code, rp.text)
    post_id = rp.json().get('id') if rp.status_code==201 else None
else:
    post_id = None

# delete answer/question/quiz
if question_id:
    # fetch options to delete them
    # list quiz to find options
    gq = requests.get(BASE + f'/assess/quiz/{quiz_id}', headers=headers)
    print('get quiz', gq.status_code)
    if gq.status_code==200:
        qdata = gq.json()
        for q in qdata.get('questions', []):
            for opt in q.get('options', []):
                oid = opt['id']
                rd = requests.delete(BASE + f'/assess/option/{oid}', headers=headers)
                print('delete option', oid, rd.status_code, rd.text)
    rdq = requests.delete(BASE + f'/assess/question/{question_id}', headers=headers)
    print('delete question', rdq.status_code, rdq.text)

if quiz_id:
    rdquiz = requests.delete(BASE + f'/assess/quiz/{quiz_id}', headers=headers)
    print('delete quiz', rdquiz.status_code, rdquiz.text)

# delete post & forum
if post_id:
    rdp = requests.delete(BASE + f'/comm/posts/{post_id}', headers=headers)
    print('delete post', rdp.status_code, rdp.text)
if forum_id:
    rdf = requests.delete(BASE + f'/comm/forums/{forum_id}', headers=headers)
    print('delete forum', rdf.status_code, rdf.text)

print('Done')
