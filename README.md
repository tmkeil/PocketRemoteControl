# PocketRemoteAccess

Monitor system resources like CPU, RAM, and disk usage – and remotely trigger actions like shutdown – directly from your phone. All communication is securely tunneled via Cloudflare.

Authentication is handled either through the free Cloudflare Zero Trust plan or via a custom JWT token system.

---

## ✨ Features

* ✅ Cross-platform (Windows, Linux, macOS)
* ✅ Quick setup via script
* ✅ Secure remote access without any port forwarding
* ✅ Optional authentication: self-managed JWT or Cloudflare Zero Trust
* ✅ Modern API communication via HTTPS and JSON (FastAPI)

---

## ⚙️ Core Idea

A Python backend (FastAPI on port 8123) runs on your PC and is made publicly accessible via a secure Cloudflare Tunnel. This backend provides:

* System information (CPU, RAM, disk usage)
* Control actions (shutdown, restart)

The connection from the React Native app on the smartphone to the backend uses the public HTTPS URL provided by Cloudflare Tunnel.
The connection is secured via HTTPS and either self-managed JWT token-based authentication or Cloudflare Zero Trust.

---

## 🚀 Setup Steps for Users (Testing)

1. Create a Cloudflare account: [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Install `cloudflared` on your PC: [https://developers.cloudflare.com/cloudflared](https://developers.cloudflare.com/cloudflared)
3. Set up Zero Trust access (if used without own JWT authentication solution)
4. Run the `setup.py` script, that generates JWT token (if chosen) and starts tunnel or prints out domain/IP
5. Install the React Native app on your phone
6. Enter the domain (from tunnel) and token in the app to authenticate

---

## 📁 File Structure on the PC

```
pc_monitoring_app/
|
|│-- backend/                   # FastAPI app & Python scripts
|   |
|   |│-- main.py             # FastAPI server (GET/POST endpoints)
|   |│-- auth.py             # Token generation & auth logic
|   |│-- system_info.py      # Uses psutil to fetch system info
|   |│-- shutdown.py         # Cross-platform shutdown commands
|   |│-- requirements.txt    # Python dependencies
|
|│-- setup.py                # Setup script (token generation, tunnel)
|│-- README.md               # Instructions for users
|│-- config.yaml             # Config file (token, domain)
```

---

## ⚖️ Technical Components

### `setup.py`

* Generates JWT token (if custom auth is used)
* Optionally starts a cloudflared tunnel
* Displays domain or local IP
* Writes settings to `config.yaml`

### `backend/main.py`

* Starts FastAPI server on port 8123
* Provides endpoints:

  * `/status` → JSON with system stats
  * `/shutdown` → shutdown command

### `backend/auth.py`

* Contains `validate_token()` which checks the token via:

```
jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
```

### `backend/system_info.py`

* Uses `psutil` to fetch:

  * RAM, CPU, Disk

### `backend/shutdown.py`

* Platform-aware shutdown and restart commands

### `config.yaml`

* Stores: JWT token, domain from tunnel, server port

### `requirements.txt`

* `fastapi`, `uvicorn`, `pyjwt`, `psutil`, `pyyaml`, `python`

---

## 🔐 How Authentication Works

### With custom JWT tokens:

* The app sends an `Authorization` header with every request:

```
Authorization: Bearer <JWT-TOKEN>
```

* Server verifies the token:

```python
jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
```

* If invalid or expired → returns 401 Unauthorized

### With Cloudflare Zero Trust:

* Cloudflare handles authentication
* Only after a successful login does Cloudflare forward requests
* No token logic required in the backend

---

## ❓ Why use Cloudflare Tunnel instead of port forwarding?

* No need to access your router or use DynDNS
* No public IPs or open ports
* HTTPS support out of the box (Let's Encrypt)
* Protection against port scans and bots

---
