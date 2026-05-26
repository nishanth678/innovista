from flask import Blueprint, request, jsonify
from config.db import db
from werkzeug.security import generate_password_hash, check_password_hash

# Blueprint
auth_bp = Blueprint('auth', __name__)

# MongoDB Collection
users = db["Users"]

# Register API
@auth_bp.route('/register', methods=['POST'])
def register():

    data = request.json

    username = data['username']
    email = data['email']
    password = generate_password_hash(data['password'])
    role = data['role']

    user = {
        "username": username,
        "email": email,
        "password": password,
        "role": role
    }

    users.insert_one(user)

    return jsonify({
        "message": "User Registered Successfully"
    })

# Login API
@auth_bp.route('/login', methods=['POST'])
def login():

    data = request.json

    user = users.find_one({"email": data['email']})

    if user and check_password_hash(user['password'], data['password']):

        return jsonify({
            "message": "Login Successful",
            "role": user['role'],
            "user": {
                "username": user['username'],
                "email": user['email'],
                "role": user['role']
            }
        })

    return jsonify({
        "message": "Invalid Credentials"
    }), 401

# Profile API
@auth_bp.route('/profile/<email>', methods=['GET'])
def get_profile(email):

    user = users.find_one(
        {"email": email},
        {"_id": 0, "password": 0}
    )

    return jsonify(user)

# Get All Students
@auth_bp.route('/students', methods=['GET'])
def get_students():

    students = list(
        users.find(
            {"role": "Student"},
            {"_id": 0, "password": 0}
        )
    )

    return jsonify(students)