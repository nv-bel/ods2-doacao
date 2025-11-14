from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User, Donation, Dish, Transaction

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    stats = {}
    
    if user.tipo == 'produtor':
        total_donations = Donation.query.filter_by(produtor_id=user_id).count()
        accepted_donations = Donation.query.filter_by(produtor_id=user_id, status='aceito').count()
        finalized_donations = Donation.query.filter_by(produtor_id=user_id, status='finalizado').count()
        
        stats = {
            'total_doacoes': total_donations,
            'doacoes_aceitas': accepted_donations,
            'doacoes_finalizadas': finalized_donations,
            'doacoes_disponiveis': total_donations - accepted_donations - finalized_donations
        }
    
    elif user.tipo == 'cozinheiro':
        accepted_donations = Donation.query.filter_by(cozinheiro_id=user_id).count()
        total_dishes = Dish.query.filter_by(cozinheiro_id=user_id).count()
        distributed_dishes = Dish.query.filter_by(cozinheiro_id=user_id, status='distribuido').count()
        
        stats = {
            'doacoes_aceitas': accepted_donations,
            'pratos_criados': total_dishes,
            'pratos_distribuidos': distributed_dishes,
            'pratos_disponiveis': total_dishes - distributed_dishes
        }
    
    elif user.tipo == 'distribuidor':
        distributed_dishes = Dish.query.filter_by(distribuidor_id=user_id).count()
        
        stats = {
            'pratos_distribuidos': distributed_dishes
        }
    
    return jsonify(stats), 200


@bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.created_at.desc()).limit(50).all()
    return jsonify([t.to_dict() for t in transactions]), 200