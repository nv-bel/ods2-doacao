from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Donation, User, Transaction
from datetime import datetime

bp = Blueprint('donations', __name__, url_prefix='/api/donations')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_donations():
    status = request.args.get('status', 'disponivel')
    donations = Donation.query.filter_by(status=status).order_by(Donation.created_at.desc()).all()
    return jsonify([d.to_dict() for d in donations]), 200


@bp.route('/', methods=['POST'])
@jwt_required()
def create_donation():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.tipo != 'produtor':
        return jsonify({'error': 'Apenas produtores podem criar doações'}), 403
    
    data = request.get_json()
    
    donation = Donation(
        produtor_id=user_id,
        titulo=data['titulo'],
        descricao=data['descricao'],
        quantidade=data['quantidade']
    )
    
    db.session.add(donation)
    
    transaction = Transaction(
        user_id=user_id,
        action='created',
        entity_type='donation',
        entity_id=donation.id
    )
    db.session.add(transaction)
    
    db.session.commit()
    
    return jsonify(donation.to_dict()), 201


@bp.route('/<int:donation_id>/accept', methods=['POST'])
@jwt_required()
def accept_donation(donation_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.tipo != 'cozinheiro':
        return jsonify({'error': 'Apenas cozinheiros podem aceitar doações'}), 403
    
    donation = Donation.query.get(donation_id)
    
    if not donation:
        return jsonify({'error': 'Doação não encontrada'}), 404
    
    if donation.status != 'disponivel':
        return jsonify({'error': 'Doação não está disponível'}), 400
    
    donation.status = 'aceito'
    donation.cozinheiro_id = user_id
    donation.accepted_at = datetime.utcnow()
    
    transaction = Transaction(
        user_id=user_id,
        action='accepted',
        entity_type='donation',
        entity_id=donation_id
    )
    db.session.add(transaction)
    
    db.session.commit()
    
    return jsonify(donation.to_dict()), 200


@bp.route('/my-donations', methods=['GET'])
@jwt_required()
def get_my_donations():
    user_id = get_jwt_identity()
    donations = Donation.query.filter_by(produtor_id=user_id).order_by(Donation.created_at.desc()).all()
    return jsonify([d.to_dict() for d in donations]), 200


@bp.route('/accepted', methods=['GET'])
@jwt_required()
def get_accepted_donations():
    user_id = get_jwt_identity()
    donations = Donation.query.filter_by(cozinheiro_id=user_id).order_by(Donation.accepted_at.desc()).all()
    return jsonify([d.to_dict() for d in donations]), 200