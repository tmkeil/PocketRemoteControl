from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.responses import FileResponse
from . import system_info, shutdown, auth
import uvicorn
import qrcode

app = FastAPI()

@app.get("/validate")
def validate(auth_data=Depends(auth.auth_dependency)):
    return {"message": "Token valid", "data": auth_data}

@app.get("/status")
def get_status(auth_data = Depends(auth.auth_dependency)):
    try:
        return system_info.get_system_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/shutdown")
def shutdown_pc(auth_data = Depends(auth.auth_dependency)):
    try:
        return shutdown.perform_shutdown()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/qr")
def get_qr_code(auth_data = Depends(auth.auth_dependency)):
    return FileResponse("qr_code.png", media_type="image/png")

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="localhost", port=8000)
