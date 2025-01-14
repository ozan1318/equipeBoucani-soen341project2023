from dotenv import load_dotenv
#Avoid (dotenv.find_dotenv(".myenvfilename"))
import os
#import redis #do from_url(), >redis-cli to get localhost redis uri
import enum


ENV_FILE_NAME = ".flaskenv"
WDIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(WDIR + os.sep + ENV_FILE_NAME)

class CurrentDatabaseConnection(enum.Enum): #TODO: Locally Hosted test database only
    """
    Current Test Database connection info...
    locally hosted tables using XAMMP and mysql+apache server
    Antoine Cantin
    """
    RDBMS_ALCHEMY_HNAME = 'mysql'
    DB_NAME = "flask_test_mysql_db"
    DB_USER = "root"
    DB_PASS = "" #else -> ":'pass'"
    DB_HOST = "localhost"
    DB_PORT = ""#e.g. :5000, :3306
    
    @classmethod
    def exportToNameSpace(cls,namespace : dict):
        namespace.update(cls.__members__)
        return tuple(map(lambda enum_field: enum_field.value,
                         cls._member_map_.values()))

RDBMS_ALCHEMY_HNAME,DB_NAME,DB_USER,DB_PASS,DB_HOST,DB_PORT = \
    CurrentDatabaseConnection.exportToNameSpace(globals())

class ApplicationSessionConfig:
    SECRET_KEY = os.environ["SECRET_KEY"] # should set flask.Flask.secret_key
    SESSION_TYPE = 'filesystem'

    TEMP_UPLOAD_PATH = "uploads_cache"

    CORS_HEADERS = "Content-Type"

    SESSION_COOKIE_SECURE = False #when True, limit the cookies to HTTPS traffic only [for production].
    # SESSION_COOKIE_HTTPONLY=True #when True, prevents any client-side usage of the session cookie
    # REMEMBER_COOKIE_HTTPONLY=True
    # SESSION_COOKIE_SAMESITE="Strict"

    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True

    SQLALCHEMY_DATABASE_URI = f"{RDBMS_ALCHEMY_HNAME}://{DB_USER}@{DB_HOST}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_ECHO = False

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = 'equipeboucani@gmail.com'
    MAIL_PASSWORD = os.environ["FLASK_MAIL_APP_PW"]
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # todo SQLALCHEMY_BINDS for cors or many db?
