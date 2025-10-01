import os
import shutil
from http.server import HTTPServer, SimpleHTTPRequestHandler
import signal
import sys

os.makedirs("./wnm", exist_ok=True)

files = ["whyneedmore.js", "whyneedmore-router.js"]

for f in files:
    src = os.path.join("..", f)
    dst = os.path.join("wnm", f)
    shutil.copyfile(src, dst)

def shutdown(sig, frame):
    print("\nShutting down server...")
    sys.exit(0)

signal.signal(signal.SIGINT, shutdown)
signal.signal(signal.SIGTERM, shutdown)

PORT = 8000

class SPAHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/assets/"):
            return super().do_GET()  # Serve from assets folder
        if self.path != "/" and not os.path.exists(self.translate_path(self.path)):
            self.path = "/index.html"
        return super().do_GET()

    def translate_path(self, path):
        if path.startswith("/assets/"):
            return os.path.join(os.getcwd(), path.lstrip("/"))
        return super().translate_path(path)


httpd = HTTPServer(("0.0.0.0", PORT), SPAHandler)

print(f"Serving on port http://localhost:{PORT}/")
httpd.serve_forever()
