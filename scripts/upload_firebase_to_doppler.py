#!/usr/bin/env python3
"""Convert Firebase service account JSON to env format and upload to Doppler."""
import json
import os
import subprocess
import sys

JSON_PATH = "firebase-service-account.json"
if not os.path.exists(JSON_PATH):
    print(f"Create {JSON_PATH} first: Firebase Console → Project settings → Service accounts → Generate new private key")
    sys.exit(1)

with open(JSON_PATH) as f:
    data = json.load(f)

env_lines = [
    f"FIREBASE_PROJECT_ID={data.get('project_id', '')}",
    f"FIREBASE_PRIVATE_KEY_ID={data.get('private_key_id', '')}",
    f"FIREBASE_CLIENT_EMAIL={data.get('client_email', '')}",
    f"FIREBASE_CLIENT_ID={data.get('client_id', '')}",
]
pk = data.get("private_key", "")
if pk:
    env_lines.append(f'FIREBASE_PRIVATE_KEY="{pk.replace(chr(10), chr(92) + chr(110))}"')

tmp = "firebase-env-upload.txt"
with open(tmp, "w") as f:
    f.write("\n".join(env_lines))

result = subprocess.run(["doppler", "secrets", "upload", tmp], capture_output=True, text=True)
os.remove(tmp)
if result.returncode != 0:
    print("Upload failed:", result.stderr or result.stdout)
    sys.exit(1)
print("Firebase service account credentials uploaded to Doppler.")
