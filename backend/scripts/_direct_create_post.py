import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src import create_app
from src.extensions import db
from src.models.communication import Forum, Post

app = create_app()
with app.app_context():
    try:
        f = Forum.query.first()
        print('forum', f and f.id)
        p = Post(forum_id=f.id, author_id=6, content='direct create')
        db.session.add(p)
        db.session.commit()
        print('created', p.id)
    except Exception as e:
        import traceback
        print('EXC', e)
        traceback.print_exc()
        db.session.rollback()
