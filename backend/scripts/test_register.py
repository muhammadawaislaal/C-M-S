import requests
import json

url = 'http://localhost:5000/api/student/register'
payload = {
    'name': 'Test Student',
    'email': 'student@example.com',
    'password': 'supersecurepassword'
}

resp = requests.post(url, json=payload)
print('STATUS', resp.status_code)
try:
    print('JSON:', json.dumps(resp.json(), indent=2))
except Exception:
    print('TEXT:', resp.text)
