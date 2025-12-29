from marshmallow import Schema, fields, validate, ValidationError


class CourseSchema(Schema):
    title = fields.String(required=True, error_messages={"required": "Title is required"})
    description = fields.String(required=False, allow_none=True)
    status = fields.String(required=False, allow_none=True)
