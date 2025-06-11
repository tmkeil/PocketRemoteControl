import socket
import jwt
import requests
import yaml
import os
import psutil
import platform

def get_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "N/A"

def get_public_ip():
    try:
        response = requests.get("https://api.ipify.org?format=json", timeout=5)
        return response.json().get("ip", "N/A")
    except Exception as e:
        print("Fehler beim Abrufen der öffentlichen IP:", e)
        return "N/A"

def get_cpu():
    try:
        return psutil.cpu_percent()
    except Exception as e:
        return "N/A"

def get_ram():
    try:
        return psutil.virtual_memory().percent
    except Exception as e:
        return "N/A"

def get_disk():
    try:
        return psutil.disk_usage("/").percent
    except Exception as e:
        return "N/A"

def get_uptime():
    try:
        return psutil.boot_time()
    except Exception as e:
        return "N/A"

def get_os():
    try:
        return platform.system()
    except Exception as e:
        return "N/A"

def get_hostname():
    try:
        return socket.gethostname()
    except Exception as e:
        return "N/A"

def get_system_info():
    return {
        "cpu": get_cpu(),
        "ram": get_ram(),
        "disk": get_disk(),
        "uptime": get_uptime(),
        "os": get_os(),
        "hostname": get_hostname(),
        "ip_address": get_ip()
}

