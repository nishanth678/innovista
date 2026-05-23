from flask import Blueprint, request, jsonify
from config.db import db

update_bp = Blueprint('update', __name__)

updates = db["ProjectUpdates"]

# Upload Update
@update_bp.route('/upload-update', methods=['POST'])
def upload_update():

    data = request.json

    updates.insert_one(data)

    return jsonify({
        "message": "Update Uploaded Successfully"
    })

# Get Updates
@update_bp.route('/get-updates', methods=['GET'])
def get_updates():

    all_updates = list(
        updates.find({}, {"_id": 0})
    )

    return jsonify(all_updates)

# Student Projects
@update_bp.route('/student-projects', methods=['GET'])
def student_projects():

    all_projects = list(
        updates.find({}, {"_id": 0})
    )

    return jsonify(all_projects)