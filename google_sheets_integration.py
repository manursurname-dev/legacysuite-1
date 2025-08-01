import gspread
from google.oauth2.service_account import Credentials
import json
import os
from datetime import datetime

class GoogleSheetsIntegration:
    def __init__(self):
        self.gc = None
        self.sheet = None
        self.setup_credentials()
    
    def setup_credentials(self):
        """إعداد بيانات الاعتماد لجوجل شيت"""
        try:
            # يمكن للمستخدم إضافة ملف service account JSON هنا
            # أو استخدام متغيرات البيئة
            credentials_path = os.path.join(os.path.dirname(__file__), 'google_credentials.json')
            
            if os.path.exists(credentials_path):
                # استخدام ملف الاعتماد إذا كان موجوداً
                scope = [
                    'https://spreadsheets.google.com/feeds',
                    'https://www.googleapis.com/auth/drive'
                ]
                
                creds = Credentials.from_service_account_file(credentials_path, scopes=scope)
                self.gc = gspread.authorize(creds)
                print("تم تهيئة جوجل شيت بنجاح")
            else:
                print("ملف الاعتماد غير موجود. يرجى إضافة google_credentials.json")
                
        except Exception as e:
            print(f"خطأ في تهيئة جوجل شيت: {str(e)}")
    
    def setup_sheet(self, sheet_url_or_key, worksheet_name="Sheet1"):
        """إعداد الشيت المحدد"""
        try:
            if self.gc:
                # فتح الشيت باستخدام URL أو المفتاح
                if sheet_url_or_key.startswith('http'):
                    self.sheet = self.gc.open_by_url(sheet_url_or_key).worksheet(worksheet_name)
                else:
                    self.sheet = self.gc.open_by_key(sheet_url_or_key).worksheet(worksheet_name)
                
                # إضافة العناوين إذا كان الشيت فارغاً
                self.setup_headers()
                return True
        except Exception as e:
            print(f"خطأ في فتح الشيت: {type(e).__name__}: {str(e)}")
            return False
    
    def setup_headers(self):
        """إعداد عناوين الأعمدة"""
        headers = [
            'التاريخ والوقت',
            'الاسم الأول', 
            'الاسم الثاني',
            'ID الشركة',
            'البريد الإلكتروني',
            'الرتبة الحالية',
            'صورة الرتبة',
            'حساب التليجرام',
            'حساب الكوتش',
            'عدد الغرف',
            'عدد الليالي',
            'صورة تأكيد الدفع'
        ]
        
        try:
            # التحقق من وجود العناوين
            existing_headers = self.sheet.row_values(1)
            if not existing_headers:
                self.sheet.insert_row(headers, 1)
                print("تم إضافة عناوين الأعمدة")
        except Exception as e:
            print(f"خطأ في إضافة العناوين: {str(e)}")
    
    def add_registration(self, registration_data):
        """إضافة تسجيل جديد إلى الشيت"""
        try:
            if not self.sheet:
                print("الشيت غير مهيأ")
                return False
            
            # تحضير البيانات للإدراج
            row_data = [
                datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                registration_data.get('first_name', ''),
                registration_data.get('second_name', ''),
                registration_data.get('company_id', ''),
                registration_data.get('email', ''),
                registration_data.get('current_rank', ''),
                registration_data.get('rank_image_path', ''),
                registration_data.get('telegram_user', ''),
                registration_data.get('telegram_upline', ''),
                str(registration_data.get('rooms_needed', '')),
                registration_data.get('stay_nights', ''),
                registration_data.get('payment_confirmation_image_path', '')
            ]
            
            # إضافة الصف الجديد
            self.sheet.append_row(row_data)
            print("تم إضافة التسجيل إلى جوجل شيت بنجاح")
            return True
            
        except Exception as e:
            print(f"خطأ في فتح الشيت: {type(e).__name__}: {str(e)}")
            return False
    
    def get_all_registrations(self):
        """الحصول على جميع التسجيلات"""
        try:
            if not self.sheet:
                return []
            
            records = self.sheet.get_all_records()
            return records
        except Exception as e:
            print(f"خطأ في إضافة التسجيل: {type(e).__name__}: {str(e)}")
            return False
# إنشاء مثيل عام للاستخدام
google_sheets = GoogleSheetsIntegration()

