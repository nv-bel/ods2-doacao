from app.extensions import db
from datetime import datetime
import bcrypt

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.String(2), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    donations = db.relationship('Donation', backref='produtor', lazy=True, foreign_keys='Donation.produtor_id')
    dishes = db.relationship('Dish', backref='cozinheiro', lazy=True, foreign_keys='Dish.cozinheiro_id')
    
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'nome': self.nome,
            'telefone': self.telefone,
            'cidade': self.cidade,
            'estado': self.estado,
            'tipo': self.tipo,
            'created_at': self.created_at.isoformat()
        }


class Donation(db.Model):
    __tablename__ = 'donations'
    
    id = db.Column(db.Integer, primary_key=True)
    produtor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    quantidade = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='disponivel')
    cozinheiro_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    accepted_at = db.Column(db.DateTime, nullable=True)
    
    dishes = db.relationship('Dish', backref='donation', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'produtor_id': self.produtor_id,
            'produtor_nome': self.produtor.nome,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'quantidade': self.quantidade,
            'status': self.status,
            'cozinheiro_id': self.cozinheiro_id,
            'cozinheiro_nome': User.query.get(self.cozinheiro_id).nome if self.cozinheiro_id else None,
            'created_at': self.created_at.isoformat(),
            'accepted_at': self.accepted_at.isoformat() if self.accepted_at else None
        }


class Dish(db.Model):
    __tablename__ = 'dishes'
    
    id = db.Column(db.Integer, primary_key=True)
    cozinheiro_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    donation_id = db.Column(db.Integer, db.ForeignKey('donations.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='preparando')
    distribuidor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    ready_at = db.Column(db.DateTime, nullable=True)
    distributed_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'cozinheiro_id': self.cozinheiro_id,
            'cozinheiro_nome': self.cozinheiro.nome,
            'donation_id': self.donation_id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'status': self.status,
            'distribuidor_id': self.distribuidor_id,
            'distribuidor_nome': User.query.get(self.distribuidor_id).nome if self.distribuidor_id else None,
            'created_at': self.created_at.isoformat(),
            'ready_at': self.ready_at.isoformat() if self.ready_at else None,
            'distributed_at': self.distributed_at.isoformat() if self.distributed_at else None
        }


class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    entity_type = db.Column(db.String(20), nullable=False)
    entity_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='transactions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'created_at': self.created_at.isoformat()
        }