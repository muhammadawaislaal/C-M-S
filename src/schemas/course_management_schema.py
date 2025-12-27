from marshmallow import Schema, fields


class CourseVideoSchema(Schema):
    id = fields.Int()
    course_id = fields.Int()
    title = fields.Str()
    description = fields.Str()
    file_path = fields.Str()
    embed_url = fields.Str()
    created_at = fields.DateTime()


class CourseSchema(Schema):
    id = fields.Int()
    name = fields.Str(required=True)
    description = fields.Str()
    course_duration = fields.Int(required=True)
    created_at = fields.DateTime()
    is_active = fields.Bool()
    videos = fields.List(fields.Nested(CourseVideoSchema))


class CourseEnrollmentSchema(Schema):
    id = fields.Int()
    user_id = fields.Int()
    course_id = fields.Int()
    status = fields.Str()
    enrolled_at = fields.DateTime()


courseManagementSchema = CourseEnrollmentSchema
