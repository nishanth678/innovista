from flask import Blueprint, request, jsonify
from config.db import db

group_bp = Blueprint('group', __name__)

groups = db["Groups"]

# Create Group API
@group_bp.route('/create-group', methods=['POST'])
def create_group():

    data = request.json

    group = {
        "group_name": data['group_name'],
        "members": data['members'],
        "department": data['department']
    }

    groups.insert_one(group)

    return jsonify({
        "message": "Group Created Successfully"
    })