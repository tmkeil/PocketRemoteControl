#!/bin/bash

# Creating the virtual environment
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
fi

# Activating the virtual environment
OS="$(uname -s)"
if [[ "$OS" == *"NT"* || "$OS" == "MINGW"* || "$OS" == "MSYS"* ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Installing dependencies
echo "📦 Installing Python dependencies from requirements.txt..."
pip install --upgrade pip
pip install -r requirements.txt

# Function to check if cloudflared is installed
is_installed() {
    if [[ "$OS" == "Linux" || "$OS" == "Darwin" ]]; then
        command -v cloudflared >/dev/null 2>&1
    elif [[ "$OS" == *"NT"* || "$OS" == "MINGW"* || "$OS" == "MSYS"* ]]; then
        where cloudflared >nul 2>&1
    else
        return 1
    fi
}

if is_installed; then
    echo "cloudflared is already installed."
else
    # https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
    if [[ "$OS" == "Linux" ]]; then
        echo "Installing cloudflared on Linux..."
        if ! command -v curl &> /dev/null; then
            sudo apt update && sudo apt install -y curl
        fi
        sudo mkdir -p --mode=0755 /usr/share/keyrings
        curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
        echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' | sudo tee /etc/apt/sources.list.d/cloudflared.list
        sudo apt-get update && sudo apt-get install -y cloudflared

    elif [[ "$OS" == "Darwin" ]]; then
        echo "Installing cloudflared on macOS..."
        brew install cloudflared

    elif [[ "$OS" == *"NT"* ]]; then
        echo "Installing cloudflared on Windows..."
        winget install --id Cloudflare.cloudflared -e --silent
    else
        echo "Unsupported OS: $OS"
        exit 1
    fi
    echo "cloudflared installed."
fi

# Starting the tunnel
echo "🚀 Starting cloudflared tunnel to http://localhost:8000"
cloudflared tunnel --url http://localhost:8000 > tunnel.log 2>&1 &

MAX_WAIT=15
WAITED=0
URL=""

echo "🚀 Waiting for the URL to be created"
while [[ -z "$URL" && $WAITED -lt $MAX_WAIT ]]; do
    if [[ "$OS" == "Linux" || "$OS" == "Darwin" || "$OS" == *"MINGW"* || "$OS" == *"MSYS"* ]]; then
        URL=$(grep 'trycloudflare.com' tunnel.log | grep -o 'https://[^ ]*' | head -1)
    else
        URL=$(powershell -NoProfile -ExecutionPolicy Bypass -File ./extract_url_windows.ps1)
        URL=$(echo "$URL" | tr -d '\r\n')
    fi
    sleep 1
    ((WAITED++))
done

if [[ -z "$URL" ]]; then
    echo "❌ Tunnel URL not found after $MAX_WAIT seconds!"
    exit 1
fi

echo "URL has been created"
echo "Tunnel URL: $URL"

# Saving the URL
echo "Saving the URL"
echo "$URL" > tunnel_url.txt

# Creating the QR-Code from the URL
echo "Generating URL-QR code..."
python generate_qr_code.py "$URL"

# Generating the JWT and saving it to config.yaml
echo "Generating JWT and generating QR code from it..."
python setup.py

# Starting the Backend
echo "Starting backend (http://localhost:8000)..."
python -m backend.main
