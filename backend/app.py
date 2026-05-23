from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth_bp
from routes.group_routes import group_bp
from routes.attendance_routes import attendance_bp
from routes.update_routes import update_bp

app = Flask(__name__)

# Secret Key for JWT
app.config['JWT_SECRET_KEY'] = 'projecthub_secret'

# Enable CORS
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(group_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(update_bp)

@app.route("/")
def home():
    return {"message": "ProjectHub Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)