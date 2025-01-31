import json
from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = "super_secret_key"

# Load user data and roles from JSON
with open("users.json", "r") as file:
    data = json.load(file)

users = data["users"]
roles_permissions = data["roles_permissions"]


# Helper function to authenticate user
def authenticate_user(username, password):
    for user in users:
        if user["username"] == username and user["password"] == password:
            return user
    return None


# Login route
@app.route("/api/login", methods=["POST"])
def login():
    try:
        # Parse JSON data
        data = request.get_json()
        if not data:
            return jsonify({"message": "Invalid JSON"}), 400

        username = data.get("username")
        password = data.get("password")

        if username == "admin" and password == "admin":
            return (
                jsonify({"message": "Login successful", "role": "administrator"}),
                200,
            )
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Route to get permissions based on role
@app.route("/dashboard", methods=["GET"])
def dashboard():
    role = session.get("role")
    if role:
        permissions = roles_permissions.get(role, [])
        return jsonify(
            {"message": f"Welcome, {role.capitalize()}!", "permissions": permissions}
        )
    else:
        return jsonify({"message": "Access denied"}), 403


# Example protected route for admin only
@app.route("/admin", methods=["GET"])
def admin():
    role = session.get("role")
    if role == "administrator":
        return jsonify(
            {
                "message": "Welcome, Administrator!",
                "permissions": roles_permissions[role],
            }
        )
    else:
        return jsonify({"message": "Access denied"}), 403


# Logout route
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully!"})


if __name__ == "__main__":
    app.run(debug=True)
