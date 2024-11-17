# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from main.data import promptAI

# Initialize Flask app
app = Flask(__name__)
app.config.from_object('config.Config')  
CORS(app, origins=["http://localhost:5173"])

# Initialize Firebase Admin
cred = credentials.Certificate("./firebase-adminsdk.json.local")
firebase_admin.initialize_app(cred)
db = firestore.client()

from routes.authenticate import authentication_bp
from routes.data import data_bp

# Register blueprints with a URL prefix
app.register_blueprint(authentication_bp, url_prefix='/api')
app.register_blueprint(data_bp, url_prefix='/api')

# Run the app
if __name__ == '__main__':
    app.run()