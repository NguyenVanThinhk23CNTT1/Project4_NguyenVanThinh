import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

print("=" * 60)
print("STEP 1: Login")
print("=" * 60)
login_resp = requests.post(f"{BASE_URL}/api/tta_auth/login", json={
    "email": "admin@g5store.vn",
    "password": "admin123"
})
print(f"Status: {login_resp.status_code}")
print(f"Body: {login_resp.text[:300]}")

if login_resp.status_code != 200:
    print("FAIL: Login failed!")
    sys.exit(1)

token = login_resp.json().get("data", {}).get("token")
if not token:
    print("FAIL: No token in response!")
    sys.exit(1)

print(f"\nToken (50 chars): {token[:50]}...")

headers = {"Authorization": f"Bearer {token}"}

print("\n" + "=" * 60)
print("STEP 2: Test GET endpoints")
print("=" * 60)

endpoints = [
    "/api/tta_sanpham",
    "/api/tta_donhang",
    "/api/tta_user",
    "/api/tta_giatrithuoctinh",
    "/api/tta_danhmuc",
    "/api/tta_thuoctinh",
    "/api/tta_chitiet_donhang",
    "/api/tta_danhgia",
    "/api/tta_voucher",
]

for ep in endpoints:
    try:
        resp = requests.get(f"{BASE_URL}{ep}", headers=headers, timeout=10)
        status = resp.status_code
        ok = "OK" if status == 200 else "FAIL"
        body_preview = resp.text[:200]
        print(f"[{ok}] {status} {ep}")
        if status != 200:
            print(f"     -> {body_preview}")
    except Exception as e:
        print(f"[ERR] {ep} -> {e}")
