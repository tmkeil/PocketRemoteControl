import jwt
import yaml
from fastapi import Request, HTTPException, status
from fastapi import Depends
from jwt import ExpiredSignatureError, InvalidTokenError

CONFIG_FILE = "../config.yaml"
ALGORITHM = "HS256"

def load_config():
    with open(CONFIG_FILE, "r") as f:
        return yaml.safe_load(f)

def validate_token(token: str):
    # config = load_config()
    secret_key = "supersecretkey" #config["secret_key"] # or config.get("secret_key")
    print(token)
    try:
        decoded = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        return {
            "valid": True,
            "data": decoded
        }
    except ExpiredSignatureError:
        print("\nExpiredSignatureError\n")
        return {
            "valid": False,
            "error": "Token expired"
        }
    except InvalidTokenError as e:
        print("\nInvalidTokenError\n")
        return {
            "valid": False,
            "error": f"Invalid token: {str(e)}"
        }

def auth_dependency(request: Request):
    auth_header = request.headers.get("Authorization")
    print(auth_header)
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = auth_header.split(" ")[1]
    result = validate_token(token)

    if not result["valid"]:
        raise HTTPException(status_code=401, detail=result["error"])

    return result["data"]

# main to test the validation

# if __name__ == "__main__":
#     config = load_config()
#     token = config["jwt"]
#     result = validate_token(token)
#     print(result)
