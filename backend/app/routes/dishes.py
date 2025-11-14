from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Dish, Donation, User, Transaction
from datetime import datetime

bp = Blueprint('dishes', __name__, url_prefix='/api/dishes')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_dishes():
    status = request.args.get('status', 'pronto')
    dishes = Dish.query.filter_by(status=status).order_by(Dish.ready_at.desc()).all()
    return jsonify([d.to_dict() for d in dishes]), 200


@bp.route('/', methods=['POST'])
@jwt_required()
def create_dish():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.tipo != 'cozinheiro':
        return jsonify({'error': 'Apenas cozinheiros podem criar pratos'}), 403
    
    data = request.get_json()
    
    donation = Donation.query.get(data['donation_id'])
    if not donation or donation.cozinheiro_id != user_id:
        return jsonify({'error': 'Doação inválida'}), 400
    
    dish = Dish(
        cozinheiro_id=user_id,
        donation_id=data['donation_id'],
        titulo=data['titulo'],
        descricao=data['descricao'],
        status='pronto',
        ready_at=datetime.utcnow()
    )
    
    donation.status = 'finalizado'
    
    db.session.add(dish)
    
    transaction = Transaction(
        user_id=user_id,
        action='created',
        entity_type='dish',
        entity_id=dish.id
    )
    db.session.add(transaction)
    
    db.session.commit()
    
    return jsonify(dish.to_dict()), 201


@bp.route('/<int:dish_id>/accept', methods=['POST'])
@jwt_required()
def accept_dish(dish_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.tipo != 'distribuidor':
        return jsonify({'error': 'Apenas distribuidores podem aceitar pratos'}), 403
    
    dish = Dish.query.get(dish_id)
    
    if not dish:
        return jsonify({'error': 'Prato não encontrado'}), 404
    
    if dish.status != 'pronto':
        return jsonify({'error': 'Prato não está disponível'}), 400
    
    dish.status = 'distribuido'
    dish.distribuidor_id = user_id
    dish.distributed_at = datetime.utcnow()
    
    transaction = Transaction(
        user_id=user_id,
        action='distributed',
        entity_type='dish',
        entity_id=dish_id
    )
    db.session.add(transaction)
    
    db.session.commit()
    
    return jsonify(dish.to_dict()), 200


@bp.route('/my-dishes', methods=['GET'])
@jwt_required()
def get_my_dishes():
    user_id = get_jwt_identity()
    dishes = Dish.query.filter_by(cozinheiro_id=user_id).order_by(Dish.created_at.desc()).all()
    return jsonify([d.to_dict() for d in dishes]), 200


@bp.route('/distributed', methods=['GET'])
@jwt_required()
def get_distributed_dishes():
    user_id = get_jwt_identity()
    dishes = Dish.query.filter_by(distribuidor_id=user_id).order_by(Dish.distributed_at.desc()).all()
    return jsonify([d.to_dict() for d in dishes]), 200