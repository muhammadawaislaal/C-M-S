from marshmallow import Schema, fields, validate

class LectureSchema(Schema):
    course_id = fields.Integer(required=True)
    title = fields.String(required=True, validate=validate.Length(min=3))
    type = fields.String(required=True, validate=validate.OneOf(["video", "pdf"]))
    content_url = fields.String(required=False)
    order_number = fields.Integer(required=True)
