import jwt
import yaml
import socket
import sys
import qrcode
from backend import system_info
from datetime import datetime, timedelta

CONFIG_FILE = "config.yaml"
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
TOKEN_EXPIRY_DAYS = 30

def generate_jwt():
    payload = {
        "hostname": socket.gethostname(),
        "ip": system_info.get_public_ip(),
        "exp": datetime.utcnow() + timedelta(days=TOKEN_EXPIRY_DAYS)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def generate_qr_code(token):
    img = qrcode.make(token)
    img.save("token.png")

def save_to_config(data):
    with open(CONFIG_FILE, "w") as file:
        yaml.dump(data, file)

def main():
    token = generate_jwt()
    config_data = {
        "hostname": socket.gethostname(),
        "ip_address": system_info.get_public_ip(),
        "ip_address_private": system_info.get_ip(),
        "jwt": token,
        "secret_key": SECRET_KEY,
    }
    save_to_config(config_data)
    generate_qr_code(token)

# # main to test the JWT generation and config saving
if __name__ == "__main__":
    main()