from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email já cadastrado'}), 400
    
    if data['tipo'] not in ['produtor', 'cozinheiro', 'distribuidor']:
        return jsonify({'error': 'Tipo de usuário inválido'}), 400
    
    user = User(
        email=data['email'],
        nome=data['nome'],
        telefone=data['telefone'],
        cidade=data['cidade'],
        estado=data['estado'],
        tipo=data['tipo']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Usuário cadastrado com sucesso',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Email ou senha inválidos'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404
    
    return jsonify(user.to_dict()), 200