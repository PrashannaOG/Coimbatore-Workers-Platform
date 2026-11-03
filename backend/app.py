
from flask import Flask, jsonify
from flask_cors import CORS

# Create Flask application
app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)


# Home API
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to Coimbatore Workers Platform Backend!",
        "status": "Running successfully"
    })


# Health check API
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Backend API is working correctly"
    })


# Run the application
if __name__ == "__main__":
    app.run(debug=True, port=5000)
