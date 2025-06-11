import sys
import qrcode

def generate_qr_code(url):
    img = qrcode.make(url)
    img.save("qr_code.png")
    print("QR-Code saved under qr_code.png")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)

    generate_qr_code(sys.argv[1])