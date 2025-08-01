import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS
from registration import db
from routes import registration_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# تمكين CORS للسماح بالطلبات من الواجهة الأمامية
CORS(app)

# تسجيل مسارات API
app.register_blueprint(registration_bp, url_prefix='/api')

# إعداد قاعدة البيانات
database_dir = os.path.join(os.path.dirname(__file__), 'database')
os.makedirs(database_dir, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(database_dir, 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

db.init_app(app)

# إنشاء الجداول
with app.app_context():
    db.create_all()

# تهيئة جوجل شيت عند بدء التشغيل
from routes import google_sheets

with app.app_context():
    try:
        google_sheets.setup_sheet(
            "https://docs.google.com/spreadsheets/d/18blJu_7yQ2CDBNZtchM353JTff1X2Z9pF90WlX-h9g0/edit?usp=sharing",
            "Sheet1"
        )
        print("تم تهيئة جوجل شيت بنجاح عند بدء التشغيل")
    except Exception as e:
        print(f"خطأ في تهيئة جوجل شيت عند بدء التشغيل: {e}")

# خدمة الملفات الثابتة للواجهة الأمامية
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

