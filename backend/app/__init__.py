from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    db.init_app(app)
    jwt.init_app(app)
    
    from app.routes import auth, donations, dishes, dashboard
    app.register_blueprint(auth.bp)
    app.register_blueprint(donations.bp)
    app.register_blueprint(dishes.bp)
    app.register_blueprint(dashboard.bp)
    
    with app.app_context():
        db.create_all()
    
    return app