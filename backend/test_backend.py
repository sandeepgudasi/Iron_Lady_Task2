import requests
import json
import time

url = "http://localhost:8000/applications/"
payload = {
    "applicant_name": "Test User",
    "email": "test@user.com",
    "role": "Tester",
    "career_stage": "Mid",
    "goal": "Test Goal",
    "challenge": "Test Challenge",
    "program_id": 1
}

print(f"Sending request to {url}...")
start = time.time()
try:
    response = requests.post(url, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Time Taken: {time.time() - start:.2f}s")
    print("Response:", response.json())
except Exception as e:
    print(f"Error: {e}")
