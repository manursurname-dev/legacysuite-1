from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    # البيانات الشخصية
    first_name = db.Column(db.String(100), nullable=False)
    second_name = db.Column(db.String(100), nullable=False)
    company_id = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    
    # الرتبة الحالية
    current_rank = db.Column(db.String(100), nullable=False)
    rank_image_path = db.Column(db.String(255), nullable=True)
    
    # حسابات التليجرام
    telegram_user = db.Column(db.String(100), nullable=False)
    telegram_upline = db.Column(db.String(100), nullable=False)
    
    # تفاصيل الإقامة
    rooms_needed = db.Column(db.Integer, nullable=False)
    stay_nights = db.Column(db.String(50), nullable=False)
    payment_confirmation_image_path = db.Column(db.String(255), nullable=False)
    
    # تاريخ التسجيل
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Registration {self.first_name} {self.second_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'second_name': self.second_name,
            'company_id': self.company_id,
            'email': self.email,
            'current_rank': self.current_rank,
            'rank_image_path': self.rank_image_path,
            'telegram_user': self.telegram_user,
            'telegram_upline': self.telegram_upline,
            'rooms_needed': self.rooms_needed,
            'stay_nights': self.stay_nights,
            'payment_confirmation_image_path': self.payment_confirmation_image_path,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

