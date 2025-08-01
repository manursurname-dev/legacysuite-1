import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Upload, User, Mail, Building, Star, MessageCircle, Hotel, Calendar, CheckCircle, PartyPopper } from 'lucide-react'
import Dashboard from './Dashboard.jsx'
import AdminLogin from './AdminLogin.jsx'
import './App.css'

// استخدام الصور من مجلد static
const logoImage = '/static/assets/Untitled-1Lcopy88.png'
const riyadhBlue = '/static/assets/kafd-buildings-riyadh-blue-hour.jpg'

function App() {
  const [currentView, setCurrentView] = useState('form') // 'form', 'admin-login', 'dashboard'
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    companyId: '',
    email: '',
    currentRank: '',
    rankImage: null,
    telegramUser: '',
    telegramUpline: '',
    roomsNeeded: '',
    stayNights: '',
    paymentConfirmationImage: null
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        rankImage: file
      }))
    }
  }

  const handlePaymentImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        paymentConfirmationImage: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('first_name', formData.firstName)
      formDataToSend.append('second_name', formData.secondName)
      formDataToSend.append('company_id', formData.companyId)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('current_rank', formData.currentRank)
      formDataToSend.append('telegram_user', formData.telegramUser)
      formDataToSend.append('telegram_upline', formData.telegramUpline)
      formDataToSend.append('rooms_needed', formData.roomsNeeded)
      formDataToSend.append('stay_nights', formData.stayNights)
      
      if (formData.rankImage) {
        formDataToSend.append('rank_image', formData.rankImage)
      }

      if (formData.paymentConfirmationImage) {
        formDataToSend.append('payment_confirmation_image', formData.paymentConfirmationImage)
      }

      const response = await fetch("/api/register", {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsSubmitted(true)
        // إعادة تعيين النموذج
        setFormData({
          firstName: '',
          secondName: '',
          companyId: '',
          email: '',
          currentRank: '',
          rankImage: null,
          telegramUser: '',
          telegramUpline: '',
          roomsNeeded: '',
          stayNights: '',
          paymentConfirmationImage: null
        })
      } else {
        setSubmitError(result.error || 'حدث خطأ في إرسال البيانات')
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewRegistration = () => {
    setIsSubmitted(false)
    setSubmitError('')
  }

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true)
    setCurrentView('dashboard')
  }

  const handleBackToForm = () => {
    setCurrentView('form')
    setIsAdminLoggedIn(false)
  }

  // للوصول إلى لوحة التحكم عبر رابط خاص
  const handleSecretAccess = () => {
    setCurrentView('admin-login')
  }

  // إذا كان في صفحة تسجيل دخول الإدارة
  if (currentView === 'admin-login') {
    return <AdminLogin onLoginSuccess={handleAdminLogin} />
  }

  // إذا كان المستخدم في لوحة التحكم
  if (currentView === 'dashboard' && isAdminLoggedIn) {
    return <Dashboard onBackToForm={handleBackToForm} />
  }

  // إذا تم إرسال النموذج بنجاح
  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* خلفية متحركة مع صور الرياض وألوان علم السعودية */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-white">
          <div className="absolute inset-0 bg-gradient-to-r from-green-800/40 to-white/30"></div>
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: `url(${riyadhBlue})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
        </div>

        <Card className="relative z-10 w-full max-w-lg mx-4 bg-white/15 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardContent className="p-10 text-center">
            <div className="mb-8">
              {/* أيقونة النجاح المحسنة */}
              <div className="relative mb-6">
                <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-2 animate-pulse" />
                <PartyPopper className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
              
              {/* العنوان الرئيسي */}
              <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
                🎉 تم التسجيل بنجاح! 🎉
              </h2>
              
              {/* الرسالة التفصيلية */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/30">
                <p className="text-white text-lg leading-relaxed mb-4">
                  <strong>تهانينا!</strong> تم تسجيل دخولك بنجاح في اجتماع الشركاء والقادة.
                </p>
                <p className="text-white/90 text-base leading-relaxed mb-4">
                  سيقوم فريق الدعم بمراجعة بياناتك وإضافتك إلى جروب التليجرام الخاص 
                  <strong className="text-green-300"> في أسرع وقت ممكن</strong>.
                </p>
                <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                  <p className="text-green-100 text-sm">
                    💬 ستصلك رسالة على التليجرام خلال الساعات القادمة
                  </p>
                </div>
              </div>
              
              {/* معلومات إضافية */}
              <div className="text-white/80 text-sm mb-6">
                <p>تاريخ التسجيل: {new Date().toLocaleDateString('ar-SA')}</p>
                <p>الوقت: {new Date().toLocaleTimeString('ar-SA')}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleNewRegistration}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              تسجيل جديد
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متحركة مع صور الرياض وألوان علم السعودية */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-white">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/40 to-white/30"></div>
        <div 
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: `url(${riyadhBlue})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* هيدر مع اللوجو */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src={logoImage} 
                alt="Legacy Suite Logo" 
                className="h-24 w-auto drop-shadow-2xl cursor-pointer"
                onClick={handleSecretAccess}
                title="انقر للوصول للإدارة"
              />
            </div>
            <h1 className="text-5xl font-black text-white mb-4 drop-shadow-2xl tracking-wide">
              اجتماع للشركاء والقادة
            </h1>
            <p className="text-white/90 text-xl font-semibold drop-shadow-lg">
              يرجى ملء جميع البيانات المطلوبة بدقة
            </p>
          </div>

          {/* النموذج */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl font-bold flex items-center justify-center gap-2">
                <User className="h-6 w-6" />
                نموذج التسجيل
              </CardTitle>
              <CardDescription className="text-white/80 text-lg">
                جميع الحقول مطلوبة، ما عدا صورة الرتبة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* البيانات الشخصية */}
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-bold">البيانات الشخصية</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white font-semibold">الاسم الأول *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondName" className="text-white font-semibold">الاسم الثاني *</Label>
                      <Input
                        id="secondName"
                        type="text"
                        value={formData.secondName}
                        onChange={(e) => handleInputChange('secondName', e.target.value)}
                        required
                        className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyId" className="text-white font-semibold flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      الـ ID الخاص بك *
                    </Label>
                    <Input
                      id="companyId"
                      type="text"
                      value={formData.companyId}
                      onChange={(e) => handleInputChange('companyId', e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      البريد الإلكتروني (Gmail) *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      الرتبة الحالية *
                    </Label>
                    <Select value={formData.currentRank} onValueChange={(value) => handleInputChange('currentRank', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                        <SelectValue placeholder="اختر رتبتك الحالية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Platinum Executive">Platinum Executive</SelectItem>
                        <SelectItem value="Global Executive">Global Executive</SelectItem>
                        <SelectItem value="Diamond Executive">Diamond Executive</SelectItem>
                        <SelectItem value="Ambassador">Ambassador</SelectItem>
                        <SelectItem value="Platinum Ambassador">Platinum Ambassador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rankImage" className="text-white font-semibold flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      صورة الرتبة الحالية (اختياري)
                    </Label>
                    <Input
                      id="rankImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="bg-white/20 border-white/30 text-white file:bg-white/20 file:border-0 file:text-white backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* حسابات التليجرام */}
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-bold">حسابات التليجرام</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telegramUser" className="text-white font-semibold flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      حساب التليجرام الشخصي *
                    </Label>
                    <Input
                      id="telegramUser"
                      type="text"
                      placeholder="@username"
                      value={formData.telegramUser}
                      onChange={(e) => handleInputChange('telegramUser', e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegramUpline" className="text-white font-semibold flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      حساب الكوتش بالتليجرام *
                    </Label>
                    <Input
                      id="telegramUpline"
                      type="text"
                      placeholder="@coach_username"
                      value={formData.telegramUpline}
                      onChange={(e) => handleInputChange('telegramUpline', e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* تفاصيل الإقامة */}
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-bold">تفاصيل الإقامة</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="roomsNeeded" className="text-white font-semibold flex items-center gap-2">
                      <Hotel className="h-4 w-4" />
                      عدد الغرف المطلوبة *
                    </Label>
                    <Input
                      id="roomsNeeded"
                      type="number"
                      min="1"
                      value={formData.roomsNeeded}
                      onChange={(e) => handleInputChange('roomsNeeded', e.target.value)}
                      required
                      className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      عدد ليالي الإقامة *
                    </Label>
                    <Select value={formData.stayNights} onValueChange={(value) => handleInputChange('stayNights', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                        <SelectValue placeholder="اختر عدد الليالي" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ليلة واحدة">ليلة واحدة</SelectItem>
                        <SelectItem value="ليلتان">ليلتان</SelectItem>
                        <SelectItem value="3 ليالي">3 ليالي</SelectItem>
                        <SelectItem value="4 ليالي">4 ليالي</SelectItem>
                        <SelectItem value="5 ليالي">5 ليالي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* تفاصيل الدفع */}
                <div className="space-y-4">
                  <h3 className="text-white text-xl font-bold">تفاصيل الدفع</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-white font-semibold">
                      رقم المحفظة والشبكة: TRC20
                    </Label>
                    <p className="text-white text-lg font-bold break-all bg-white/10 p-3 rounded border">
                      TQ9GwLpsMS6DV9RAMMVysEoVmx1gZsg9QB
                    </p>
                    <p className="text-red-400 text-sm font-semibold">
                      يجب دفع مبلغ 30$
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentConfirmationImage" className="text-white font-semibold flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      صورة تأكيد الدفع الخاص بك *
                    </Label>
                    <Input
                      id="paymentConfirmationImage"
                      type="file"
                      accept="image/*"
                      onChange={handlePaymentImageChange}
                      required
                      className="bg-white/20 border-white/30 text-white file:bg-white/20 file:border-0 file:text-white backdrop-blur-sm"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جاري التسجيل...' : 'تسجيل البيانات'}
                </Button>
                {submitError && <p className="text-red-400 text-center">{submitError}</p>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App

