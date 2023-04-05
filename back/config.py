from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

CORS(app)

from blueprint import api_blueprint, errors

app.register_blueprint(api_blueprint)
app.register_blueprint(errors)
