from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from src.config import Config
from src.controllers.auth_controller import bcrypt
from src.routes.auth_routes import auth_bp
from src.routes.skills_routes import skills_bp
from src.routes.give_take_routes import give_take_bp
from src.routes.match_routes import match_bp
from src.routes.user_routes import user_bp


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY

    CORS(app, origins=[Config.FRONTEND_ORIGIN])
    JWTManager(app)
    bcrypt.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(skills_bp)
    app.register_blueprint(give_take_bp)
    app.register_blueprint(match_bp)
    app.register_blueprint(user_bp)

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port=Config.FLASK_PORT, debug=True)
