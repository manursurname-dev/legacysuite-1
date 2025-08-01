from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from registration import Registration, db
from google_sheets_integration import google_sheets

registration_bp = Blueprint('registration', __name__)

# إعدادات رفع الملفات
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file, prefix=''):
    """حفظ الملف وإرجاع المسار"""
    if file and allowed_file(file.filename):
        # إنشاء مجلد الرفع إذا لم يكن موجوداً
        upload_path = os.path.join(current_app.root_path, UPLOAD_FOLDER)
        os.makedirs(upload_path, exist_ok=True)
        
        # إنشاء اسم ملف فريد
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        unique_filename = f"{prefix}_{timestamp}_{name}{ext}"
        
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)
        
        # إرجاع المسار النسبي
        return os.path.join(UPLOAD_FOLDER, unique_filename)
    return None

@registration_bp.route('/register', methods=['POST'])
def register():
    try:
        # استخراج البيانات من النموذج
        data = {
            'first_name': request.form.get('first_name'),
            'second_name': request.form.get('second_name'),
            'company_id': request.form.get('company_id'),
            'email': request.form.get('email'),
            'current_rank': request.form.get('current_rank'),
            'telegram_user': request.form.get('telegram_user'),
            'telegram_upline': request.form.get('telegram_upline'),
            'rooms_needed': int(request.form.get('rooms_needed', 0)),
            'stay_nights': request.form.get('stay_nights')
        }
        
        # التحقق من البيانات المطلوبة
        required_fields = ['first_name', 'second_name', 'company_id', 'email', 
                          'current_rank', 'telegram_user', 'telegram_upline', 
                          'rooms_needed', 'stay_nights']
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False, 
                    'error': f'الحقل {field} مطلوب'
                }), 400
        
        # معالجة الملفات المرفوعة
        rank_image_path = None
        payment_image_path = None
        
        if 'rank_image' in request.files:
            rank_image = request.files['rank_image']
            if rank_image.filename:
                rank_image_path = save_file(rank_image, 'rank')
        
        if 'payment_confirmation_image' in request.files:
            payment_image = request.files['payment_confirmation_image']
            if payment_image.filename:
                payment_image_path = save_file(payment_image, 'payment')
        
        # التحقق من وجود صورة تأكيد الدفع (مطلوبة)
        if not payment_image_path:
            return jsonify({
                'success': False,
                'error': 'صورة تأكيد الدفع مطلوبة'
            }), 400
        
        # إنشاء سجل جديد في قاعدة البيانات
        registration = Registration(
            first_name=data['first_name'],
            second_name=data['second_name'],
            company_id=data['company_id'],
            email=data['email'],
            current_rank=data['current_rank'],
            rank_image_path=rank_image_path,
            telegram_user=data['telegram_user'],
            telegram_upline=data['telegram_upline'],
            rooms_needed=data['rooms_needed'],
            stay_nights=data['stay_nights'],
            payment_confirmation_image_path=payment_image_path
        )
        
        db.session.add(registration)
        db.session.commit()
        
        # إضافة البيانات إلى جوجل شيت
        sheet_data = data.copy()
        sheet_data['rank_image_path'] = rank_image_path or ''
        sheet_data['payment_confirmation_image_path'] = payment_image_path or ''
        
        # محاولة إضافة البيانات إلى جوجل شيت
        try:
            google_sheets.add_registration(sheet_data)
        except Exception as e:
            print(f"خطأ في إضافة البيانات إلى جوجل شيت: {str(e)}")
            # لا نوقف العملية إذا فشل جوجل شيت
        
        return jsonify({
            'success': True,
            'message': 'تم تسجيل دخولك بنجاح! فريق الدعم سيتأكد من بياناتك وسيدخلك جروب التليجرام الخاص في أسرع وقت ممكن.',
            'registration_id': registration.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'حدث خطأ في التسجيل: {str(e)}'
        }), 500

@registration_bp.route('/registrations', methods=['GET'])
def get_registrations():
    """الحصول على جميع التسجيلات"""
    try:
        registrations = Registration.query.all()
        return jsonify({
            'success': True,
            'registrations': [reg.to_dict() for reg in registrations]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@registration_bp.route('/setup-google-sheet', methods=['POST'])
def setup_google_sheet():
    """إعداد رابط جوجل شيت"""
    try:
        data = request.get_json()
        sheet_url = data.get('sheet_url')
        worksheet_name = data.get('worksheet_name', 'Sheet1')
        
        if not sheet_url:
            return jsonify({
                'success': False,
                'error': 'رابط الشيت مطلوب'
            }), 400
        
        success = google_sheets.setup_sheet(sheet_url, worksheet_name)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'تم ربط جوجل شيت بنجاح'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'فشل في ربط جوجل شيت'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

