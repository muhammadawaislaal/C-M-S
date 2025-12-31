import requests

url = 'http://127.0.0.1:5000/api/student/register'
payload = {
    'name': 'UI Logger Test',
    'email': 'uilogger@example.com',
    'password': 'uiloginpass'
}
resp = requests.post(url, json=payload)
print('STATUS', resp.status_code)
print('BODY', resp.text)
