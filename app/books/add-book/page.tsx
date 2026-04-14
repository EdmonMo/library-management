"use client"

import { useState } from "react"
import {
  Users,
  ShoppingCart,
  Menu,
  Clock,
  AlertCircle,
  Book,
  LogOut,
  Settings,
  Library,
  LayoutDashboard,
  CheckCircle2,
  BookMarked,
  X,
  Save,
  FileText,
  User,
  Tag,
  Hash,
  Building2,
  Globe,
  Info,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

/**
 * AddBookPage Component - الصفحة الرئيسية لإضافة كتب جديدة
 * تحتوي على نموذج متكامل لإدخال معلومات الكتاب مع قوائم جانبية وإحصائيات
 * @returns {JSX.Element} - صفحة إضافة الكتاب الكاملة
 */
export default function AddBookPage() {
  // تهيئة متغيرات الحالة (State Hooks)
  const router = useRouter() // للتنقل بين الصفحات
  const [sidebarOpen, setSidebarOpen] = useState(false) // التحكم في ظهور القائمة الجانبية في الشاشات الصغيرة

  /**
   * formData - تخزين بيانات الكتاب المدخلة في النموذج
   * يحتوي على: العنوان، المؤلف، التصنيف، ISBN، الناشر، الوصف، حالة التوفر
   */
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    publisher: "",
    description: "",
    available: true, // افتراضيًا الكتاب متاح للإعارة
  })

  /**
   * menuItems - قائمة عناصر القائمة الرئيسية
   * كل عنصر يحتوي على: أيقونة، تسمية، حالة النشاط، رابط الصفحة
   */
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "لوحة القيادة",
      active: false,
      href: "/dashboard",
    },
    { icon: Book, label: "الكتب", active: true, href: "/books" },
    { icon: Users, label: "الموظفين", active: false, href: "/employees" },
    { icon: Users, label: "الأعضاء", active: false, href: "/members" },
    { icon: ShoppingCart, label: "الطلبات", active: false, href: "/requests" },
  ]

  /**
   * handleLogout - معالج تسجيل الخروج
   * يعرض رسالة نجاح ويعيد التوجيه إلى صفحة تسجيل الدخول بعد ثانية
   */
  const handleLogout = () => {
    toast.success("تم تسجيل الخروج بنجاح")
    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)
  }

  /**
   * handleInputChange - معالج تغيير قيم حقول الإدخال
   * @param {Object} e - حدث التغيير
   * يقوم بتحديث formData بناءً على اسم الحقل والقيمة الجديدة
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * handleToggle - معالج تغيير حالة مفتاح التبديل (متاح/غير متاح)
   * @param {boolean} checked - الحالة الجديدة للمفتاح
   */
  const handleToggle = (checked) => {
    setFormData((prev) => ({ ...prev, available: checked }))
  }

  /**
   * handleSubmit - معالج إرسال النموذج
   * @param {Object} e - حدث الإرسال
   * يتحقق من صحة البيانات المطلوبة، يعرض رسائل الخطأ، ويحفظ البيانات
   */
  const handleSubmit = (e) => {
    e.preventDefault() // منع إعادة تحميل الصفحة

    // التحقق من وجود البيانات المطلوبة
    if (!formData.title || !formData.author || !formData.category) {
      toast.error("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    // طباعة البيانات في وحدة التحكم (للتطوير)
    console.log("Form Data:", formData)

    // عرض رسالة نجاح
    toast.success("تم حفظ الكتاب بنجاح!")

    // إعادة تعيين النموذج بعد الحفظ
    setFormData({
      title: "",
      author: "",
      category: "",
      isbn: "",
      publisher: "",
      description: "",
      available: true,
    })
  }

  /**
   * handleCancel - معالج إلغاء العملية
   * يعيد تعيين النموذج إلى قيمه الافتراضية ويعرض رسالة تأكيد
   */
  const handleCancel = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      isbn: "",
      publisher: "",
      description: "",
      available: true,
    })
    toast.success("تم إلغاء العملية")
  }

  /**
   * booksStats - بيانات الإحصائيات المعروضة في بطاقات الأسفل
   * تحتوي على: التسمية، القيمة، الأيقونة، اللون، لون الخلفية
   */
  const booksStats = [
    {
      label: "تحت الصيانة",
      value: "16",
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "كتب معارة حالياً",
      value: "412",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "الكتب المتاحة",
      value: "856",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "إجمالي الكتب",
      value: "1,284",
      icon: BookMarked,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ]

  return (
    // الحاوية الرئيسية للصفحة مع دعم اللغة العربية (RTL)
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      {/* مكون عرض الإشعارات */}
      <Toaster position="top-center" richColors />

      {/* 
        القائمة الجانبية (Sidebar)
        - في الشاشات الصغيرة: تظهر عند الضغط على زر القائمة
        - في الشاشات الكبيرة: تظهر بشكل دائم على اليمين
      */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } w-80 border-l border-gray-200 bg-white shadow-xl md:w-64 md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* رأس القائمة الجانبية - الشعار والعنوان */}
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    نظام المكتبة
                  </h1>
                  <p className="text-xs text-gray-500">إدارة ذكية</p>
                </div>
              </div>
              {/* زر إغلاق القائمة الجانبية (يظهر فقط في الشاشات الصغيرة) */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* قائمة الروابط الرئيسية */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      item.active ? "bg-blue-600 hover:bg-blue-700" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* أسفل القائمة الجانبية - إعدادات وتسجيل خروج */}
          <div className="space-y-2 border-t p-4">
            <a
              href="/dashboard/settings"
              className="block"
              onClick={() => setSidebarOpen(false)}
            >
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Settings className="h-4 w-4" />
                الإعدادات
              </Button>
            </a>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي للصفحة - يتحرك لليمين عند ظهور القائمة الجانبية في الشاشات الكبيرة */}
      <div className="md:mr-64">
        {/* الهيدر - شريط العلوي */}
        <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {/* زر فتح/إغلاق القائمة الجانبية للشاشات الصغيرة */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              {/* معلومات المستخدم الحالي */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-linear-to-br from-blue-400 to-blue-600">
                  <AvatarFallback className="bg-transparent text-white">
                    ع
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    عبد الرحمن محمود
                  </p>
                  <p className="text-xs text-muted-foreground">مشرف النظام</p>
                </div>
              </div>
            </div>
            <div></div> {/* عنصر فارغ للمحاذاة */}
          </div>
        </header>

        {/* المحتوى الرئيسي - منطقة النموذج والإحصائيات */}
        <main className="p-6">
          {/* عنوان الصفحة والوصف */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              إضافة كتاب جديد
            </h1>
            <p className="text-muted-foreground">
              أدخل معلومات الكتاب الجديد لإضافته إلى مكتبتك الرقمية
            </p>
          </div>

          {/* الحاوية الرئيسية للمحتوى بعرض أقصى 4xl */}
          <div className="mx-auto max-w-4xl space-y-6">
            {/* بطاقة إرشادية في أعلى النموذج */}
            <div className="flex items-start gap-4 rounded-xl border border-blue-200 bg-linear-to-l from-blue-50 to-white p-4">
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-bold text-gray-800">
                  تسجيل كتاب جديد في النظام
                </h3>
                <p className="text-sm text-gray-600">
                  يرجى ملء جميع الحقول بدقة لضمان فهرسة صحيحة للكتاب في النظام.
                </p>
              </div>
              <button className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50">
                جاهز للإعارة
              </button>
            </div>

            {/* البطاقة الأولى: المعلومات الأساسية للكتاب */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* حقل عنوان الكتاب (مطلوب) */}
                  <div className="space-y-2">
                    <Label>
                      عنوان الكتاب <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="مثال: مقدمة ابن خلدون"
                        className="pr-10"
                      />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                        <FileText className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* حقل اسم المؤلف (مطلوب) */}
                  <div className="space-y-2">
                    <Label>
                      اسم المؤلف <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="مثال: د. طه حسين"
                        className="pr-10"
                      />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* حقل تصنيف الكتاب (مطلوب) - قائمة منسدلة */}
                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      تصنيف الكتاب <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        name="category"
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger className="pr-10">
                          <SelectValue placeholder="اختر التصنيف الرئيسي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">تكنولوجيا</SelectItem>
                          <SelectItem value="history">تاريخ</SelectItem>
                          <SelectItem value="literature">أدب</SelectItem>
                          <SelectItem value="science">علوم</SelectItem>
                          <SelectItem value="philosophy">فلسفة</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                        <Tag className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* البطاقة الثانية: تفاصيل النشر والمواصفات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  تفاصيل النشر والمواصفات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* حقل ISBN - الرقم الدولي المعياري للكتاب */}
                  <div className="space-y-2">
                    <Label>الرقم الدولي المعياري (ISBN)</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        placeholder="978-3-16-148410-0"
                        className="pr-10 font-mono"
                      />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                        <Hash className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* حقل دار النشر - قائمة منسدلة */}
                  <div className="space-y-2">
                    <Label>دار النشر</Label>
                    <div className="relative">
                      <Select
                        name="publisher"
                        value={formData.publisher}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, publisher: value }))
                        }
                      >
                        <SelectTrigger className="pr-10">
                          <SelectValue placeholder="اختر دار النشر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dar1">دار المعارف</SelectItem>
                          <SelectItem value="dar2">دار الشروق</SelectItem>
                          <SelectItem value="dar3">دار الآداب</SelectItem>
                          <SelectItem value="dar4">دار الساقي</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* حقل وصف الكتاب - نص متعدد الأسطر */}
                <div className="space-y-2">
                  <Label>وصف موجز عن الكتاب</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="اكتب نبذة مختصرة عن محتوى الكتاب وأهميته..."
                    rows="4"
                  />
                </div>
              </CardContent>
            </Card>

            {/* البطاقة الثالثة: حالة توفر الكتاب (مفتاح تبديل) */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-4">
                    {/* مفتاح التبديل لتغيير حالة التوفر */}
                    <Switch
                      checked={formData.available}
                      onCheckedChange={handleToggle}
                    />
                    <div>
                      <span className="font-medium text-gray-800">متاح</span>
                      <p className="mt-0.5 text-sm text-gray-500">
                        عند تفعيل هذا الخيار، سيتمكن الأعضاء من تقديم طلبات
                        استعارة لهذا الكتاب.
                      </p>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* رسالة تذكيرية للتأكد من البيانات */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="mt-0.5 text-amber-600">
                <Info className="h-5 w-5" />
              </div>
              <p className="text-sm text-amber-800">
                تأكد من مراجعة كافة البيانات قبل الضغط على "حفظ". سيتم إرسال
                إشعار للنظام بتوفر الكتاب في حال كان متاحاً للإعارة.
              </p>
            </div>

            {/* أزرار التحكم: حفظ وإلغاء */}
            <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
              <Button
                onClick={handleSubmit}
                className="flex-1 gap-2 shadow-lg shadow-blue-500/30 sm:flex-none"
              >
                <Save className="h-4 w-4" />
                حفظ الكتاب
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 gap-2 sm:flex-none"
              >
                <X className="h-4 w-4" />
                إلغاء الأمر
              </Button>
            </div>

            {/* بطاقات الإحصائيات السريعة أسفل الصفحة */}
            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
              {booksStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="text-right">
                        <p className="mb-1 text-sm text-gray-500">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* تذييل الصفحة - حقوق النشر */}
          <footer className="mt-8 border-t border-gray-200 py-4 text-center text-sm text-muted-foreground">
            نظام إدارة المكتبة الذكي. جميع الحقوق محفوظة © 2026
          </footer>
        </main>
      </div>

      {/* طبقة الخلفية المظللة عند فتح القائمة الجانبية في الشاشات الصغيرة */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
