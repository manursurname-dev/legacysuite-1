# نظام تسجيل البيانات - اجتماع الشركاء والقادة

## وصف المشروع
نظام متكامل لتسجيل بيانات المشاركين في اجتماع الشركاء والقادة مع ربط تلقائي بجوجل شيت وعرض رسائل تأكيد مخصصة.

## المميزات
- ✅ واجهة مستخدم جميلة بألوان علم السعودية
- ✅ ربط تلقائي بجوجل شيت لحفظ البيانات
- ✅ رسالة تأكيد مخصصة بعد التسجيل
- ✅ معلومات الدفع (الشبكة وعنوان المحفظة)
- ✅ رفع الملفات (صورة الرتبة وصورة تأكيد الدفع)
- ✅ تصميم متجاوب يعمل على جميع الأجهزة

## متطلبات التشغيل
- Python 3.11+
- Node.js 20+
- ملف `google_credentials.json` (Service Account)

## طريقة التشغيل

### 1. إعداد الواجهة الخلفية (Flask)
```bash
cd landing_page
pip install -r requirements.txt
python main.py
```

### 2. إعداد الواجهة الأمامية (React) - للتطوير
```bash
cd landing-page-react
npm install
npm run dev
```

### 3. التشغيل المتكامل
الواجهة الخلفية تخدم الواجهة الأمامية تلقائياً من مجلد `static`
```bash
cd landing_page
python main.py
```
ثم افتح المتصفح على: http://localhost:5000

## إعداد جوجل شيت

### 1. إنشاء Service Account
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google Sheets API و Google Drive API
4. أنشئ Service Account وحمّل ملف JSON
5. ضع الملف في مجلد `landing_page` باسم `google_credentials.json`

### 2. مشاركة الشيت
1. أنشئ جوجل شيت جديد
2. شارك الشيت مع البريد الإلكتروني للـ Service Account
3. أعطه صلاحية "محرر"
4. انسخ رابط الشيت وضعه في ملف `main.py`

## هيكل المشروع
```
landing_page/                 # الواجهة الخلفية (Flask)
├── main.py                  # الملف الرئيسي
├── routes.py                # مسارات API
├── registration.py          # نموذج قاعدة البيانات
├── google_sheets_integration.py  # ربط جوجل شيت
├── google_credentials.json  # بيانات اعتماد جوجل
├── requirements.txt         # متطلبات Python
└── static/                  # ملفات الواجهة الأمامية المبنية

landing-page-react/          # الواجهة الأمامية (React)
├── src/
│   ├── App.jsx             # المكون الرئيسي
│   └── components/         # مكونات UI
├── package.json            # متطلبات Node.js
└── vite.config.js          # إعدادات Vite
```

## الاستخدام
1. افتح الموقع في المتصفح
2. املأ جميع البيانات المطلوبة
3. ارفع صورة تأكيد الدفع (مطلوبة)
4. اضغط "تسجيل البيانات"
5. ستظهر رسالة تأكيد النجاح
6. البيانات ستُحفظ تلقائياً في جوجل شيت

## معلومات الدفع
- **الشبكة:** TRC 20
- **عنوان المحفظة:** TQ9GwLpsMS6DV9RAMMVysEoVmx1gZsg9QB

## الدعم الفني
في حالة وجود أي مشاكل، تأكد من:
- تفعيل Google Sheets API و Google Drive API
- صحة ملف `google_credentials.json`
- مشاركة الشيت مع Service Account
- تشغيل السيرفر على المنفذ الصحيح

---
تم تطوير هذا النظام بواسطة Manus AI

