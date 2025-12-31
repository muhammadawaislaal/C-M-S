import requests, json
ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YSp4mLWJ2w5dJNjY1cUbgXwcY3gZhLu2c2CatwtdNxM'
resp = requests.get('http://127.0.0.1:5000/assess/quiz/1', headers={'Authorization': 'Bearer ' + ADMIN_TOKEN})
print('STATUS', resp.status_code)
try:
    print(json.dumps(resp.json(), indent=2))
except Exception:
    print(resp.text)
