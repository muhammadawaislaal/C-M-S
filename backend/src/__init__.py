from flask import Flask, jsonify, request
import logging
from src.extensions import bcrypt, jwt, db
from datetime import timedelta
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    # ensure logger prints INFO messages to console for debugging
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s %(levelname)s: %(message)s')
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    app.config['JWT_SECRET_KEY'] = 'I_AM_Awais_laal'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/cms'
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # global request logger to capture raw incoming requests for debugging
    @app.before_request
    def log_request():
        try:
            import os, datetime, json
            log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
            os.makedirs(log_dir, exist_ok=True)
            path = os.path.join(log_dir, 'requests.log')
            raw = ''
            try:
                raw = request.get_data(as_text=True)
            except Exception:
                raw = '<unreadable>'
            entry = {
                'time': datetime.datetime.utcnow().isoformat() + 'Z',
                'method': request.method,
                'path': request.path,
                'headers': dict(request.headers),
                'body': raw
            }
            with open(path, 'a', encoding='utf-8') as fh:
                fh.write(json.dumps(entry, ensure_ascii=False) + '\n')
        except Exception:
            app.logger.exception('Failed to write requests.log')

    from src.routes.auth_student import auth_student_bp
    from src.routes.auth_admin import auth_admin_bp
    from src.routes.admin_courses import admin_courses_bp
    from src.routes.student_courses import student_courses_bp
    from src.routes.admin_lectures import admin_lectures_bp
    from src.routes.enrollment import student_enrollment_bp
    from src.routes.student_lectures import student_lecture_bp
    from src.routes.admin_students import admin_students_bp
    from src.routes.assessments import assess_bp
    from src.routes.communication import comm_bp

    app.register_blueprint(auth_student_bp)
    app.register_blueprint(auth_admin_bp)
    app.register_blueprint(admin_courses_bp)
    app.register_blueprint(student_courses_bp)
    app.register_blueprint(admin_lectures_bp)
    app.register_blueprint(student_enrollment_bp)
    app.register_blueprint(student_lecture_bp)
    app.register_blueprint(admin_students_bp)
    app.register_blueprint(assess_bp)
    app.register_blueprint(comm_bp)

    with app.app_context():
        # By default do not drop existing tables to avoid data loss on restart.
        # To reset the DB in development, set environment variable FLASK_ENV_DEV_RESET_DB=1
        import os
        if os.environ.get('FLASK_ENV_DEV_RESET_DB') == '1':
            db.drop_all()
            app.logger.info('DB reset requested via FLASK_ENV_DEV_RESET_DB=1; dropped all tables')
        db.create_all()
        app.logger.info('Database tables ensured (create_all called)')

    @app.route('/')
    def home():
        return jsonify({
            "message": "CMS Backend API",
            "status": "running"
        }), 200

    @app.errorhandler(Exception)
    def handle_exception(e):
        try:
            import os, traceback, datetime
            log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
            os.makedirs(log_dir, exist_ok=True)
            with open(os.path.join(log_dir, 'error.log'), 'a', encoding='utf-8') as fh:
                fh.write('=== ' + datetime.datetime.utcnow().isoformat() + 'Z ===\\n')
                fh.write(traceback.format_exc() + '\\n')
        except Exception:
            pass
        # re-raise to let Flask produce its default response after logging
        raise e

    return app