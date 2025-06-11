# Remote Access App

A lightweight and secure application enabling remote machine monitoring and shutdown via a React Native mobile app, a Python backend, and a Cloudflare tunnel. This setup is perfect for users who want to control and inspect local machines from anywhere without exposing their system to the open internet.

---

## 🚀 Features

### 🔒 Secure Remote Control

* **JWT Token Authentication**: Only clients with a valid JSON Web Token (JWT) can access protected endpoints.
* **Cloudflare Tunnel Integration**: Easily expose localhost to the internet through a secure tunnel.

### ⚙️ Backend Services

* **Quick Tunnel Startup**: Automatically starts a local server at `http://localhost:8000` and exposes it via `cloudflared`.
* **System Monitoring**: Query current machine resource usage (CPU, memory, etc.).
* **Shutdown Command**: Remotely shut down the machine with a single button.

### 📱 React Native Mobile App

* **API Login**: Scan QR codes for API URL and JWT token to connect securely.
* **Home Tab**: Display live system resource data.
* **Shutdown Tab**: One-tap remote shutdown.

---

## 💡 Use Case

This app is ideal for:

* IT administrators needing remote access to machines behind firewalls.
* Developers and power users wanting secure remote control without setting up complex VPNs.
* Anyone needing to access system stats or perform emergency shutdowns remotely.

---

## ⚙️ Tech Stack

### 🔧 Backend

* **Python 3** – REST API with endpoint handling and JSON Web Token authentication
* **FastAPI** – Provides REST endpoints: `GET /status`, `POST /shutdown`, `GET /qr`
* **Bash Scripting** – Automates environment setup and cloudflared tunnel management
* **cloudflared** – Establishes a secure tunnel to `localhost:8000`

### 📱 Frontend

* **React Native** – Cross-platform mobile app interface
* **Expo Go** – Quick deployment and testing on Android/iOS devices
* **Node.js Proxy Server** – Handles CORS by forwarding frontend requests to the backend

---

## 🧩 Setup Process

### Step 1: Backend Setup

1. **Run `install_cloudflared.sh`**

   * Creates a Python virtual environment
   * Installs requirements
   * Installs `cloudflared`
   * Starts a Cloudflare tunnel to `http://localhost:8000`
   * Extracts the tunnel URL
   * Generates QR codes:

     * For the URL via `generate_qr_code.py`
     * For the JWT via `setup.py`
   * Starts the backend: `backend/main.py`
   * Starts a Node.js server to forward frontend requests and avoid CORS issues

### Step 2: React Native App

1. Start the app on a physical device using **Expo Go**
2. On the **Login Screen**:

   * Enter (or scan) the **Cloudflare URL** and **JWT Token**
   * Press **Login** to authenticate
3. Access the **Home Tab** to monitor resources
4. Use the **Shutdown Tab** to turn off the connected machine

---

## 🖼️ Screenshots

| Screenshot              | Description                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| ![1](screenshots/1.jpg) | **Login Screen** – Enter or scan the API URL and JWT token to log in.              |
| ![2](screenshots/2.jpg) | **Home Tab** – Displays system resource usage like CPU and memory stats.           |
| ![3](screenshots/3.jpg) | **Shutdown Tab** – Allows secure shutdown of the connected PC with a button press. |

---

## 📂 Project Structure

```
RemoteAccessApp/
├── backend/
│   ├── main.py             # FastAPI backend providing REST endpoints
│   ├── auth.py             # JWT token generation and validation
│   └── utils.py            # System status and shutdown helpers
├── frontend/
│   └── App.js              # React Native mobile app code
├── node-server/
│   └── index.js            # CORS proxy between frontend and backend
├── scripts/
│   ├── install_cloudflared.sh  # Installs dependencies, starts tunnel and backend
│   ├── generate_qr_code.py     # QR code for Cloudflare URL
│   └── setup.py                # Generates JWT and QR code
├── requirements.txt        # Python dependencies
└── README.md               # Project overview
```

---

## 🧑‍💻 Author

Built with ❤️ to provide simple and secure remote machine access, developed as a learning and utility project for remote IT control.
