import requests, json
ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2NzA5MTM2MiwianRpIjoiYTg1NDMxMWItMjI4My00NTQwLWExNGMtMTZjZTlkNDk3OTNkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjIiLCJuYmYiOjE3NjcwOTEzNjIsImNzcmYiOiIzNGU5MWE4NC1iZjM4LTQ1NGQtYTE5NS0xMWFlMDFiYjllMTEiLCJleHAiOjE3NjcxMDkzNjIsInJvbGUiOiJhZG1pbiJ9.jVXi-KGeJuyQBinPcQN8RtaW3w4M8XSGufxM6D2jQZE'
resp = requests.get('http://127.0.0.1:5000/admin/courses', headers={'Authorization': 'Bearer '+ADMIN_TOKEN})
print('STATUS', resp.status_code)
try:
    print(json.dumps(resp.json(), indent=2))
except Exception:
    print(resp.text)
