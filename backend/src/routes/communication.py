from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from src.extensions import db
from src.models.communication import Forum, Post, Message, Announcement

comm_bp = Blueprint('communication', __name__, url_prefix='/comm')


@comm_bp.route('/forums/<int:course_id>', methods=['GET'])
@jwt_required()
def list_forums(course_id):
    fs = Forum.query.filter_by(course_id=course_id).all()
    return jsonify({'forums': [{'id': f.id, 'title': f.title} for f in fs]}), 200


@comm_bp.route('/forums/<int:course_id>/create', methods=['POST'])
@jwt_required()
def create_forum(course_id):
    data = request.get_json() or {}
    title = data.get('title')
    if not title:
        return jsonify({'msg': 'title required'}), 400
    f = Forum(course_id=course_id, title=title)
    db.session.add(f)
    db.session.commit()
    return jsonify({'msg': 'Forum created', 'id': f.id}), 201


@comm_bp.route('/forums/<int:forum_id>/posts', methods=['GET'])
@jwt_required()
def get_posts(forum_id):
    posts = Post.query.filter_by(forum_id=forum_id).order_by(Post.created_at.desc()).all()
    return jsonify({'posts': [{'id': p.id, 'author_id': p.author_id, 'content': p.content, 'created_at': p.created_at.isoformat()} for p in posts]}), 200


@comm_bp.route('/forums/<int:forum_id>/posts', methods=['POST'])
@jwt_required()
def create_post(forum_id):
    try:
        # only students may create forum posts (posts are linked to students)
        if get_jwt().get('role') != 'student':
            return jsonify({'msg': 'Student access required to create post'}), 403
        # ensure forum exists
        forum = Forum.query.get(forum_id)
        if not forum:
            return jsonify({'msg': 'Forum not found'}), 404
        data = request.get_json() or {}
        content = data.get('content')
        if not content:
            return jsonify({'msg': 'content required'}), 400
        author_id = int(get_jwt_identity())
        p = Post(forum_id=forum_id, author_id=author_id, content=content)
        db.session.add(p)
        db.session.commit()
        return jsonify({'msg': 'Post created', 'id': p.id}), 201
    except Exception as e:
        try:
            import os, traceback, datetime, json
            log_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')
            os.makedirs(log_dir, exist_ok=True)
            with open(os.path.join(log_dir, 'communication_errors.log'), 'a', encoding='utf-8') as fh:
                fh.write('=== ' + datetime.datetime.utcnow().isoformat() + 'Z ===\\n')
                fh.write(traceback.format_exc() + '\\n')
        except Exception:
            pass
        db.session.rollback()
        return jsonify({'msg': 'Server error creating post', 'error': str(e)}), 500


@comm_bp.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    data = request.get_json() or {}
    to = data.get('to')
    content = data.get('content')
    if not to or not content:
        return jsonify({'msg': 'to and content required'}), 400
    sender = int(get_jwt_identity())
    m = Message(sender_id=sender, recipient_id=int(to), content=content)
    db.session.add(m)
    db.session.commit()
    return jsonify({'msg': 'Message sent', 'id': m.id}), 201


@comm_bp.route('/announcements/<int:course_id>', methods=['POST'])
@jwt_required()
def create_announcement(course_id):
    if get_jwt().get('role') != 'admin':
        return jsonify({'msg': 'Admin access required'}), 403
    data = request.get_json() or {}
    title = data.get('title')
    content = data.get('content')
    if not title or not content:
        return jsonify({'msg': 'title and content required'}), 400
    a = Announcement(course_id=course_id, title=title, content=content)
    db.session.add(a)
    db.session.commit()
    return jsonify({'msg': 'Announcement created', 'id': a.id}), 201


@comm_bp.route('/announcements/<int:course_id>', methods=['GET'])
@jwt_required()
def list_announcements(course_id):
    anns = Announcement.query.filter((Announcement.course_id==course_id) | (Announcement.course_id.is_(None))).order_by(Announcement.created_at.desc()).all()
    return jsonify({'announcements': [{'id': a.id, 'title': a.title, 'content': a.content, 'created_at': a.created_at.isoformat()} for a in anns]}), 200


@comm_bp.route('/forums/<int:forum_id>', methods=['DELETE'])
@jwt_required()
def delete_forum(forum_id):
    # admin-only
    if get_jwt().get('role') != 'admin':
        return jsonify({'msg': 'Admin access required'}), 403
    f = Forum.query.get(forum_id)
    if not f:
        return jsonify({'msg': 'Forum not found'}), 404
    db.session.delete(f)
    db.session.commit()
    return jsonify({'msg': 'Forum deleted'}), 200


@comm_bp.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    # allow authors or admins
    p = Post.query.get(post_id)
    if not p:
        return jsonify({'msg': 'Post not found'}), 404
    caller = int(get_jwt_identity())
    if p.author_id != caller and get_jwt().get('role') != 'admin':
        return jsonify({'msg': 'Not authorized'}), 403
    db.session.delete(p)
    db.session.commit()
    return jsonify({'msg': 'Post deleted'}), 200


@comm_bp.route('/messages/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    # allow sender or recipient or admin
    m = Message.query.get(message_id)
    if not m:
        return jsonify({'msg': 'Message not found'}), 404
    caller = int(get_jwt_identity())
    if m.sender_id != caller and m.recipient_id != caller and get_jwt().get('role') != 'admin':
        return jsonify({'msg': 'Not authorized'}), 403
    db.session.delete(m)
    db.session.commit()
    return jsonify({'msg': 'Message deleted'}), 200


@comm_bp.route('/announcements/<int:announcement_id>', methods=['DELETE'])
@jwt_required()
def delete_announcement(announcement_id):
    if get_jwt().get('role') != 'admin':
        return jsonify({'msg': 'Admin access required'}), 403
    a = Announcement.query.get(announcement_id)
    if not a:
        return jsonify({'msg': 'Announcement not found'}), 404
    db.session.delete(a)
    db.session.commit()
    return jsonify({'msg': 'Announcement deleted'}), 200
