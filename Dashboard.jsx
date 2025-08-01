import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Search, Download, Eye, Trash2, Users, Calendar, Hotel, MessageCircle, ArrowLeft } from 'lucide-react'
import logoImage from './assets/logo.png'
import riyadhNight from './assets/riyadh-night.jpg'
import riyadhBlue from './assets/riyadh-blue.jpg'
import './App.css'

function Dashboard({ onBackToForm }) {
  const [registrations, setRegistrations] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    // تصفية البيانات بناءً على البحث
    const filtered = registrations.filter(reg => 
      reg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.second_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.company_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.current_rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.telegram_user.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredData(filtered)
  }, [searchTerm, registrations])

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/registrations')
      const result = await response.json()
      
      if (response.ok && result.success) {
        setRegistrations(result.data)
      } else {
        setError(result.error || 'حدث خطأ في جلب البيانات')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRegistration = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا التسجيل؟')) return
    
    try {
      const response = await fetch(`http://localhost:5000/api/registrations/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      
      if (response.ok && result.success) {
        // إعادة جلب البيانات بعد الحذف
        fetchRegistrations()
      } else {
        alert(result.error || 'حدث خطأ في حذف التسجيل')
      }
    } catch (err) {
      alert('حدث خطأ في الاتصال بالخادم')
      console.error('Error:', err)
    }
  }

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert('لا توجد بيانات للتصدير')
      return
    }

    const headers = [
      'الاسم الأول',
      'الاسم الثاني', 
      'معرف الشركة',
      'البريد الإلكتروني',
      'الرتبة الحالية',
      'حساب التليجرام',
      'حساب الكوتش',
      'عدد الغرف',
      'عدد الليالي',
      'تاريخ التسجيل'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredData.map(reg => [
        reg.first_name,
        reg.second_name,
        reg.company_id,
        reg.email,
        reg.current_rank,
        reg.telegram_user,
        reg.telegram_upline,
        reg.rooms_needed,
        reg.stay_nights,
        new Date(reg.created_at).toLocaleDateString('ar-SA')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
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

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* هيدر مع اللوجو */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={logoImage} 
                alt="Legacy Suite Logo" 
                className="h-20 w-auto drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 drop-shadow-2xl tracking-wide">
              لوحة تحكم البيانات
            </h1>
            <p className="text-white/90 text-lg font-semibold drop-shadow-lg">
              إدارة ومراجعة بيانات التسجيل
            </p>
          </div>

          {/* أزرار التحكم */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              onClick={onBackToForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للنموذج
            </Button>
            <Button 
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2"
              disabled={filteredData.length === 0}
            >
              <Download className="h-4 w-4" />
              تصدير CSV
            </Button>
            <Button 
              onClick={fetchRegistrations}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              تحديث البيانات
            </Button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{registrations.length}</p>
                <p className="text-white/80 text-sm">إجمالي التسجيلات</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <Hotel className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {registrations.reduce((sum, reg) => sum + (reg.rooms_needed || 0), 0)}
                </p>
                <p className="text-white/80 text-sm">إجمالي الغرف</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {new Set(registrations.map(reg => reg.telegram_upline)).size}
                </p>
                <p className="text-white/80 text-sm">عدد الكوتشز</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {registrations.filter(reg => {
                    const today = new Date()
                    const regDate = new Date(reg.created_at)
                    return regDate.toDateString() === today.toDateString()
                  }).length}
                </p>
                <p className="text-white/80 text-sm">تسجيلات اليوم</p>
              </CardContent>
            </Card>
          </div>

          {/* البحث */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-white" />
                <Input
                  type="text"
                  placeholder="البحث في البيانات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* جدول البيانات */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white font-bold">
                بيانات التسجيل ({filteredData.length} من {registrations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-white">جاري تحميل البيانات...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-300">{error}</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/80">لا توجد بيانات للعرض</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-white font-bold">الاسم</TableHead>
                        <TableHead className="text-white font-bold">معرف الشركة</TableHead>
                        <TableHead className="text-white font-bold">البريد الإلكتروني</TableHead>
                        <TableHead className="text-white font-bold">الرتبة</TableHead>
                        <TableHead className="text-white font-bold">التليجرام</TableHead>
                        <TableHead className="text-white font-bold">الإقامة</TableHead>
                        <TableHead className="text-white font-bold">تاريخ التسجيل</TableHead>
                        <TableHead className="text-white font-bold">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((registration) => (
                        <TableRow key={registration.id} className="border-white/20">
                          <TableCell className="text-white">
                            {registration.first_name} {registration.second_name}
                          </TableCell>
                          <TableCell className="text-white">{registration.company_id}</TableCell>
                          <TableCell className="text-white">{registration.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-white border-white/30">
                              {registration.current_rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="text-sm">
                              <div>👤 {registration.telegram_user}</div>
                              <div>👨‍🏫 {registration.telegram_upline}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="text-sm">
                              <div>🏨 {registration.rooms_needed} غرفة</div>
                              <div>🌙 {registration.stay_nights}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white text-sm">
                            {formatDate(registration.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {registration.rank_image_path && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-white border-white/30 hover:bg-white/20"
                                  onClick={() => window.open(`http://localhost:5000/static/${registration.rank_image_path}`, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteRegistration(registration.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

