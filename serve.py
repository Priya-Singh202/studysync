"""
StudySync Local Web Server Runner
Launches a local HTTP server and automatically opens StudySync in your default browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Try preferred port, or fall back to an available one
    global PORT
    for attempt in range(10):
        try:
            with socketserver.TCPServer(("", PORT), Handler) as httpd:
                url = f"http://localhost:{PORT}"
                print(f"==================================================")
                print(f"🚀 StudySync Platform is running at: {url}")
                print(f"📁 Root directory: {os.getcwd()}")
                print(f"🛑 Press Ctrl+C in this terminal to stop the server.")
                print(f"==================================================")
                webbrowser.open(url)
                httpd.serve_forever()
                break
        except OSError:
            PORT += 1
            continue

if __name__ == "__main__":
    try:
        run_server()
    except KeyboardInterrupt:
        print("\n👋 StudySync server stopped.")
        sys.exit(0)
