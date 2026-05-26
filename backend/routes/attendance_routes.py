from flask import Blueprint, request, jsonify
from config.db import db

attendance_bp = Blueprint('attendance', __name__)

# MongoDB Collection
attendance_collection = db["Attendance"]

# Mark Attendance
@attendance_bp.route('/mark-attendance', methods=['POST'])
def mark_attendance():

    data = request.json

    attendance_collection.insert_one(data)

    return jsonify({
        "message": "Attendance Marked"
    })

# Get Attendance
@attendance_bp.route('/get-attendance', methods=['GET'])
def get_attendance():

    all_attendance = list(
        attendance_collection.find({}, {"_id": 0})
    )

    return jsonify(all_attendance)