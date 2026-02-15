<div align="center">
  <h1>PocketRemote</h1>
</div>

## About
A mobile app for remotely monitoring and shutting down my PC. React Native frontend communicates with a Python/FastAPI backend, securely exposed over the internet through a Cloudflare tunnel. Authentication is handled via JWT tokens, delivered to the phone by scanning QR codes from the PC screen.

This is a personal project — I had the idea years ago and built it to get hands-on experience with token-based auth, tunneling, and mobile-to-backend communication.

## Architecture
The phone app talks to a Node.js CORS proxy on the local network, which forwards requests (with the JWT) through a Cloudflare Quick Tunnel to the FastAPI backend running on the PC. The tunnel assigns a random `*.trycloudflare.com` subdomain on each start — that's why the QR-code login flow exists: the URL changes every time.

### Backend (Python/FastAPI)
- `POST /shutdown` — detects the OS and runs the appropriate shutdown command
- `GET /status` — returns CPU, RAM, disk usage, uptime, hostname, and IP via `psutil`
- `GET /validate` — verifies the JWT token
- `GET /qr` — serves the generated QR code images

Every endpoint (except QR delivery) requires a valid `Bearer` token. The JWT is generated at startup by `setup.py` with a 30-day expiry, signed with HS256.

### Frontend (React Native / Expo)
- **Login screen** — scan two QR codes (tunnel URL + JWT) or enter them manually
- **Home tab** — displays live system metrics from `/status`
- **Shutdown tab** — one-tap shutdown button

Auth state is managed via React Context. Protected routes redirect to login if unauthenticated.

### CORS Proxy (Node.js/Express)
A minimal Express server sits between the phone and the tunnel to handle CORS headers — Expo's dev environment can't call the tunnel directly. Forwards the `Authorization` header transparently.

## Tech Stack
- **Frontend:** React Native, Expo SDK 53, TypeScript, NativeWind, expo-camera (QR scanning)
- **Backend:** Python 3, FastAPI, PyJWT, psutil
- **Proxy:** Node.js, Express
- **Infra:** Cloudflare Quick Tunnels (cloudflared), Bash scripting for automated setup

## Usage
Start the backend (creates venv, installs deps, starts tunnel, generates QR codes, launches everything):
```
cd cloudflared_tunnel
./install_cloudflared.sh
```

Start the mobile app:
```
cd mobile-app
npx expo start
```

Scan the two QR codes on the login screen, and you're connected.

## Screenshots

| Screenshot | Description |
|------------|-------------|
| ![Login](screenshots/1.JPG) | Login screen — scan or enter API URL and JWT |
| ![Home](screenshots/2.JPG) | System resource monitoring |
| ![Shutdown](screenshots/3.JPG) | Remote shutdown button |
