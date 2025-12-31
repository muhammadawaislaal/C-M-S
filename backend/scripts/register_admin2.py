import requests
import json

url = 'http://127.0.0.1:5000/register'
payload = {
    'name': 'Admin Two',
    'email': 'admin2@example.com',
    'password': 'adminpass2'
}
resp = requests.post(url, json=payload)
print('ADMIN2 REGISTER STATUS', resp.status_code)
try:
    print('JSON:', json.dumps(resp.json(), indent=2))
except Exception:
    print('TEXT:', resp.text)
