
from src.extensions import bcrypt,db


class Admin(db.Model):
    __tablename__="admin"

    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(80), nullable=False)
    email=db.Column(db.String(80),nullable=False,unique=True)
    password=db.Column(db.String(80), nullable=False)
    

    def set_password(self,password):
        self.password=bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self,password):
        return bcrypt.check_password_hash(self.password,password)
