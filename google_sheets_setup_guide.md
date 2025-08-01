# دليل إعداد ربط جوجل شيت

## الخطوات المطلوبة لربط النظام بجوجل شيت

### 1. إنشاء مشروع في Google Cloud Console

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google Sheets API و Google Drive API

### 2. إنشاء Service Account

1. في Google Cloud Console، اذهب إلى "IAM & Admin" > "Service Accounts"
2. انقر على "Create Service Account"
3. أدخل اسم الحساب والوصف
4. انقر على "Create and Continue"
5. اختر دور "Editor" أو "Owner"
6. انقر على "Done"

### 3. إنشاء مفتاح JSON

1. انقر على Service Account الذي أنشأته
2. اذهب إلى تبويب "Keys"
3. انقر على "Add Key" > "Create new key"
4. اختر "JSON" وانقر على "Create"
5. سيتم تحميل ملف JSON - احفظه باسم `google_credentials.json`

### 4. إعداد جوجل شيت

1. أنشئ جوجل شيت جديد
2. انسخ رابط الشيت
3. شارك الشيت مع البريد الإلكتروني للـ Service Account (موجود في ملف JSON)
4. أعطه صلاحية "Editor"

### 5. إعداد النظام

1. ضع ملف `google_credentials.json` في مجلد المشروع
2. شغّل السيرفر
3. استخدم API endpoint لربط الشيت:

```bash
curl -X POST http://localhost:5000/api/setup-google-sheet \
  -H "Content-Type: application/json" \
  -d '{
    "sheet_url": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit",
    "worksheet_name": "Sheet1"
  }'
```

### 6. اختبار النظام

بعد إعداد جوجل شيت، ستتم إضافة البيانات تلقائياً إلى الشيت عند كل تسجيل جديد.

## هيكل البيانات في الشيت

سيتم إنشاء الأعمدة التالية تلقائياً:

- التاريخ والوقت
- الاسم الأول
- الاسم الثاني  
- ID الشركة
- البريد الإلكتروني
- الرتبة الحالية
- صورة الرتبة
- حساب التليجرام
- حساب الكوتش
- عدد الغرف
- عدد الليالي
- صورة تأكيد الدفع

## ملاحظات مهمة

- تأكد من أن Service Account له صلاحية الوصول للشيت
- احتفظ بملف `google_credentials.json` في مكان آمن
- لا تشارك ملف الاعتماد مع أي شخص
- يمكنك استخدام نفس Service Account لعدة شيتات

## استكشاف الأخطاء

### خطأ في الاتصال
- تأكد من أن APIs مفعلة في Google Cloud Console
- تأكد من صحة ملف الاعتماد

### خطأ في الصلاحيات
- تأكد من مشاركة الشيت مع Service Account
- تأكد من إعطاء صلاحية "Editor"

### خطأ في رابط الشيت
- تأكد من أن رابط الشيت صحيح
- تأكد من أن اسم الـ worksheet صحيح

