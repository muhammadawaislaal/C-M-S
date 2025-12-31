from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from src.extensions import db
from src.models.assessment import Quiz, Question, Option, Submission, Answer
from src.models.course import Course
from marshmallow import ValidationError
from datetime import datetime

assess_bp = Blueprint('assessments', __name__, url_prefix='/assess')


def admin_required():
    try:
        return get_jwt().get('role') == 'admin'
    except Exception:
        return False


@assess_bp.route('/quiz', methods=['POST'])
@jwt_required()
def create_quiz():
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    data = request.get_json() or {}
    title = data.get('title')
    course_id = data.get('course_id')
    if not title or not course_id:
        return jsonify({'msg': 'title and course_id required'}), 400
    quiz = Quiz(title=title, course_id=course_id, description=data.get('description'), randomize_questions=bool(data.get('randomize_questions', False)))
    db.session.add(quiz)
    db.session.commit()
    return jsonify({'msg': 'Quiz created', 'quiz_id': quiz.id}), 201


@assess_bp.route('/quiz/<int:quiz_id>/question', methods=['POST'])
@jwt_required()
def add_question(quiz_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    data = request.get_json() or {}
    qtype = data.get('question_type')
    prompt = data.get('prompt')
    options = data.get('options', [])
    if not qtype or not prompt:
        return jsonify({'msg': 'question_type and prompt required'}), 400
    q = Question(quiz_id=quiz_id, question_type=qtype, prompt=prompt, points=int(data.get('points', 1)), order_number=int(data.get('order_number', 0)))
    db.session.add(q)
    db.session.commit()
    # add options if MCQ
    if qtype == 'mcq' and isinstance(options, list):
        for opt in options:
            o = Option(question_id=q.id, text=opt.get('text', ''), is_correct=bool(opt.get('is_correct', False)))
            db.session.add(o)
        db.session.commit()
    return jsonify({'msg': 'Question added', 'question_id': q.id}), 201


@assess_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'msg': 'Quiz not found'}), 404
    questions = Question.query.filter_by(quiz_id=quiz_id).order_by(Question.order_number).all()
    result = {
        'id': quiz.id,
        'title': quiz.title,
        'description': quiz.description,
        'questions': []
    }
    for q in questions:
        qobj = {
            'id': q.id,
            'question_type': q.question_type,
            'prompt': q.prompt,
            'points': q.points,
            'order_number': q.order_number
        }
        if q.question_type == 'mcq':
            opts = Option.query.filter_by(question_id=q.id).all()
            qobj['options'] = [{'id': o.id, 'text': o.text} for o in opts]
        result['questions'].append(qobj)
    return jsonify(result), 200


@assess_bp.route('/quiz/<int:quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz(quiz_id):
    student_id = int(get_jwt_identity())
    data = request.get_json() or {}
    answers = data.get('answers', [])
    # create submission
    submission = Submission(quiz_id=quiz_id, student_id=student_id, submitted_at=datetime.utcnow())
    db.session.add(submission)
    db.session.commit()
    total_score = 0.0
    max_score = 0.0
    for a in answers:
        qid = a.get('question_id')
        q = Question.query.get(qid)
        if not q:
            continue
        max_score += q.points or 0
        if q.question_type == 'mcq':
            selected = a.get('selected_option_id')
            opt = Option.query.get(selected) if selected else None
            points = q.points if opt and opt.is_correct else 0
            ans = Answer(submission_id=submission.id, question_id=qid, selected_option_id=selected, points_awarded=points)
            total_score += points
            db.session.add(ans)
        else:
            # essay: leave for manual grading, store text
            ta = a.get('text_answer')
            ans = Answer(submission_id=submission.id, question_id=qid, text_answer=ta)
            db.session.add(ans)
    submission.score = total_score
    db.session.commit()
    return jsonify({'msg': 'Submission received', 'score': total_score, 'max_score': max_score}), 200


@assess_bp.route('/quiz/<int:quiz_id>/submissions', methods=['GET'])
@jwt_required()
def list_submissions(quiz_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    subs = Submission.query.filter_by(quiz_id=quiz_id).order_by(Submission.submitted_at.desc()).all()
    out = []
    for s in subs:
        out.append({'id': s.id, 'student_id': s.student_id, 'submitted_at': s.submitted_at.isoformat(), 'score': s.score})
    return jsonify({'submissions': out}), 200


@assess_bp.route('/submission/<int:submission_id>', methods=['GET'])
@jwt_required()
def get_submission(submission_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    s = Submission.query.get(submission_id)
    if not s:
        return jsonify({'msg': 'Submission not found'}), 404
    answers = []
    for a in s.answers:  # relationship will be set if model defines backrefs
        answers.append({'id': a.id, 'question_id': a.question_id, 'selected_option_id': a.selected_option_id, 'text_answer': a.text_answer, 'points_awarded': a.points_awarded})
    return jsonify({'submission': {'id': s.id, 'student_id': s.student_id, 'submitted_at': s.submitted_at.isoformat(), 'score': s.score, 'answers': answers}}), 200


@assess_bp.route('/submission/<int:submission_id>/grade', methods=['PUT'])
@jwt_required()
def grade_submission(submission_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    data = request.get_json() or {}
    answers = data.get('answers', [])  # list of {answer_id, points_awarded}
    s = Submission.query.get(submission_id)
    if not s:
        return jsonify({'msg': 'Submission not found'}), 404
    total = 0.0
    for a in answers:
        aid = a.get('answer_id')
        pts = float(a.get('points_awarded', 0))
        ans = db.session.query(Answer).get(aid)
        if ans:
            ans.points_awarded = pts
            total += pts
    s.score = total
    db.session.commit()
    return jsonify({'msg': 'Graded', 'score': s.score}), 200


@assess_bp.route('/quiz/<int:quiz_id>', methods=['DELETE'])
@jwt_required()
def delete_quiz(quiz_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    q = Quiz.query.get(quiz_id)
    if not q:
        return jsonify({'msg': 'Quiz not found'}), 404
    db.session.delete(q)
    db.session.commit()
    return jsonify({'msg': 'Quiz deleted'}), 200


@assess_bp.route('/question/<int:question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    q = Question.query.get(question_id)
    if not q:
        return jsonify({'msg': 'Question not found'}), 404
    db.session.delete(q)
    db.session.commit()
    return jsonify({'msg': 'Question deleted'}), 200


@assess_bp.route('/option/<int:option_id>', methods=['DELETE'])
@jwt_required()
def delete_option(option_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    o = Option.query.get(option_id)
    if not o:
        return jsonify({'msg': 'Option not found'}), 404
    db.session.delete(o)
    db.session.commit()
    return jsonify({'msg': 'Option deleted'}), 200


@assess_bp.route('/submission/<int:submission_id>', methods=['DELETE'])
@jwt_required()
def delete_submission(submission_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    s = Submission.query.get(submission_id)
    if not s:
        return jsonify({'msg': 'Submission not found'}), 404
    db.session.delete(s)
    db.session.commit()
    return jsonify({'msg': 'Submission deleted'}), 200


@assess_bp.route('/answer/<int:answer_id>', methods=['DELETE'])
@jwt_required()
def delete_answer(answer_id):
    if not admin_required():
        return jsonify({'msg': 'Admin access required'}), 403
    a = Answer.query.get(answer_id)
    if not a:
        return jsonify({'msg': 'Answer not found'}), 404
    db.session.delete(a)
    db.session.commit()
    return jsonify({'msg': 'Answer deleted'}), 200
