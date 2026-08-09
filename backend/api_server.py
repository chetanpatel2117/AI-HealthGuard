#!/usr/bin/env python3
"""
AI HealthGuard - Python Standalone HTTP Microservice
Provides RESTful JSON endpoints for diabetes risk prediction, SHAP explanation, and ML benchmarks.
"""

import sys
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Dict, Any

from ml_engine import PythonMLEngine
from models_benchmark import PythonMLBenchmark
from shap_explainer import PythonSHAPExplainer

HOST = "127.0.0.1"
PORT = int(os.environ.get("PYTHON_PORT", "5005"))

class PythonHealthHandler(BaseHTTPRequestHandler):
    def _send_json_response(self, status_code: int, data: Any):
        response_bytes = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        if self.path == "/status" or self.path == "/":
            status_data = {
                "status": "healthy",
                "backend": "Python 3.10",
                "service": "AI HealthGuard Python ML Microservice",
                "pythonVersion": sys.version,
                "endpoints": [
                    "POST /predict",
                    "GET /benchmark",
                    "POST /explain",
                    "GET /status"
                ]
            }
            self._send_json_response(200, status_data)
        elif self.path == "/benchmark":
            benchmark_data = PythonMLBenchmark.get_benchmark_metrics()
            self._send_json_response(200, benchmark_data)
        else:
            self._send_json_response(404, {"error": "Endpoint not found"})

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_length).decode("utf-8")

        try:
            body_json = json.loads(post_body) if post_body else {}
        except Exception:
            self._send_json_response(400, {"error": "Invalid JSON in request body"})
            return

        if self.path == "/predict":
            try:
                user_id = body_json.get("userId", "usr_demo")
                result = PythonMLEngine.predict(body_json, user_id=user_id)
                self._send_json_response(200, result)
            except Exception as e:
                self._send_json_response(500, {"error": f"Prediction failed: {str(e)}"})
        elif self.path == "/shap":
            try:
                features = body_json.get("features", {})
                base_prob = float(body_json.get("baseProbability", 34.9))
                model_prob = float(body_json.get("modelProbability", 50.0))
                shaps = PythonSHAPExplainer.calculate_shap_attributions(features, base_prob, model_prob)
                self._send_json_response(200, {"shapContributions": shaps})
            except Exception as e:
                self._send_json_response(500, {"error": f"SHAP calculation failed: {str(e)}"})
        else:
            self._send_json_response(404, {"error": "Endpoint not found"})

    def log_message(self, format, *args):
        # Keep logs minimal for speed
        return

def run_server():
    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, PythonHealthHandler)
    print(f"🐍 AI HealthGuard Python Microservice running on http://{HOST}:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()

if __name__ == "__main__":
    run_server()
