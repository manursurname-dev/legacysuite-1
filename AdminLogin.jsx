import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Lock, Eye, EyeOff } from 'lucide-react'
import logoImage from './assets/logo.png'
import riyadhNight from './assets/riyadh-night.jpg'
import riyadhBlue from './assets/riyadh-blue.jpg'
import './App.css'

function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // كلمة المرور الثابتة (يمكن تغييرها)
  const ADMIN_PASSWORD = 'admin2024'

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // محاكاة تأخير التحقق
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onLoginSuccess()
      } else {
        setError('كلمة المرور غير صحيحة')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* خلفية متحركة مع صور الرياض وألوان علم السعودية */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-white">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/40 to-white/30"></div>
        <div 
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: `url(${riyadhNight})` }}
        ></div>
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${riyadhBlue})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* هيدر مع اللوجو */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={logoImage} 
              alt="Legacy Suite Logo" 
              className="h-16 w-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 drop-shadow-2xl tracking-wide">
            تسجيل دخول الإدارة
          </h1>
          <p className="text-white/90 text-lg font-semibold drop-shadow-lg">
            للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              دخول محمي
            </CardTitle>
            <CardDescription className="text-white/80">
              أدخل كلمة المرور للوصول إلى البيانات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm pr-10"
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-200 text-center text-sm">{error}</p>
                </div>
              )}

              {/* زر تسجيل الدخول */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
                disabled={isLoading}
              >
                {isLoading ? 'جاري التحقق...' : 'دخول'}
              </Button>
            </form>

            {/* معلومات إضافية */}
            <div className="mt-4 text-center">
              <p className="text-white/60 text-xs">
                هذه المنطقة محمية ومخصصة للإدارة فقط
              </p>
            </div>
          </CardContent>
        </Card>

        {/* تلميح لكلمة المرور (يمكن إزالته في الإنتاج) */}
        <div className="mt-4 text-center">
          <p className="text-white/40 text-xs">
            كلمة المرور الافتراضية: admin2024
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

