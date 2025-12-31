import requests
import json

url = 'http://127.0.0.1:5000/api/student/login'
payload = {
    'email': 'student@example.com',
    'password': 'studentpass'
}
resp = requests.post(url, json=payload)
print('STUDENT STATUS', resp.status_code)
try:
    print('JSON:', json.dumps(resp.json(), indent=2))
except Exception:
    print('TEXT:', resp.text)
