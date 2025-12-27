from src.extentions import db

# Legacy shim: some modules import `from src.db import db`.
# This file re-exports the SQLAlchemy `db` instance from `src.extentions`.
