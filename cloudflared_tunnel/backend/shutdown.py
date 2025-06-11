import os
import platform

def perform_shutdown():
    system = platform.system()
    if system == "Windows":
        os.system("shutdown /s /t 1")
    elif system == "Linux" or system == "Darwin":
        os.system("sudo shutdown now")
    else:
        return {"status": "unsupported platform"}
    return {"status": "shutting down"}