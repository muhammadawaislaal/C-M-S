import sys
import os

# Ensure the project root is on sys.path so `src` can be imported
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from src import create_app
from src.models.admin import Admin

app = create_app()
with app.app_context():
    admins = Admin.query.all()
    print('ADMINS COUNT', len(admins))
    for a in admins:
        print(a.id, a.email, a.password)
