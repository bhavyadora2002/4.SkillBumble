import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_PORT = int(os.getenv("DB_PORT", "3306"))
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "n3u3da!")
    DB_NAME = os.getenv("DB_NAME", "skillbumble")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-secret-change-in-production")

    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))
