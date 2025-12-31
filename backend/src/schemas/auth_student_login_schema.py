from marshmallow import Schema,fields, validate


class StudentLoginSchema(Schema):
    email = fields.Email(required=True)
    # allow longer passwords (match register schema)
    password = fields.String(required=True, validate=validate.Length(min=6, max=128))
