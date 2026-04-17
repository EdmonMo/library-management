"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Eye,
  EyeOff,
  Library,
  User,
  Lock,
  LogIn,
  BookOpen,
  Users,
  TrendingUp,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoginFormData, loginSchema } from "@/lib/validations"
import { loginAction } from "@/actions/auth"

/**
 * LoginPage Component - صفحة تسجيل الدخول إلى نظام إدارة المكتبة
 * تحتوي على نموذج تسجيل دخول مع التحقق من الصحة، وحسابات تجريبية للمستخدمين
 * @returns {JSX.Element} - صفحة تسجيل الدخول الكاملة
 */
export default function Login() {
  // تهيئة متغيرات الحالة (State Hooks)
  const router = useRouter() // للتنقل بين الصفحات بعد تسجيل الدخول الناجح
  const [showPassword, setShowPassword] = useState(false) // إظهار/إخفاء كلمة المرور
  const [isLoading, setIsLoading] = useState(false) // حالة تحميل لمنع النقر المتكرر على زر الدخول

  /**
   * useForm - إدارة نموذج React Hook Form مع التحقق من الصحة باستخدام Zod
   * توفر: register (لتسجيل الحقول)، handleSubmit (لمعالجة الإرسال)، formState (الأخطاء)، setValue (لتعيين القيم)
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // ربط Zod مع React Hook Form
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  /**
   * onSubmit - معالج إرسال نموذج تسجيل الدخول
   * @param {Object} data - بيانات النموذج (identifier, password, rememberMe)
   *
   * الوظائف:
   * 1. تفعيل حالة التحميل
   * 2. محاكاة تأخير الشبكة (1 ثانية)
   * 3. البحث عن المستخدم في قاعدة البيانات التجريبية
   * 4. إذا تم العثور على المستخدم:
   *    - تخزين بيانات المستخدم في localStorage
   *    - تخزين خيار "تذكرني" إذا كان مفعلاً
   *    - عرض رسالة ترحيب
   *    - التوجيه إلى لوحة التحكم
   * 5. إذا لم يتم العثور على المستخدم: عرض رسالة خطأ
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true) // بدء التحميل

    const res = await loginAction(data)

    // البحث عن مستخدم مطابق لاسم المستخدم/البريد الإلكتروني وكلمة المرور
    // const user = demoUsers.find(
    //   (user) =>
    //     (user.username === data.email || user.email === data.email) &&
    //     user.password === data.password
    // )

    if (res.success) {
      router.push("/dashboard")
      // تخزين بيانات المستخدم في localStorage للاستمرار في الجلسة
      // localStorage.setItem("user", JSON.stringify(user))
      // تخزين خيار "تذكرني" إذا تم تحديده
      // if (data.rememberMe) {
      //   localStorage.setItem("rememberMe", "true")
      // }
      // عرض رسالة نجاح مع اسم المستخدم
      // toast.success(`مرحباً ${user.name}`)
      // التوجيه إلى لوحة التحكم (Dashboard)
      // router.push("/dashboard")
    } else {
      // عرض رسالة خطأ للمستخدم
      toast.error("بيانات الدخول غير صحيحة")
    }
    setIsLoading(false) // إلغاء حالة التحميل
  }

  return (
    // الحاوية الرئيسية للصفحة - خلفية متدرجة ومركزة
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* الحاوية الداخلية - أقصى عرض 900px */}
      <div className="w-full max-w-225">
        {/* 
          بطاقة تسجيل الدخول - شبكة من عمودين
          - العمود الأيمن (يظهر فقط في الشاشات المتوسطة والكبيرة): معلومات تعريفية عن النظام
          - العمود الأيسر: نموذج تسجيل الدخول
        */}
        <div className="grid gap-0 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
          {/* 
            القسم الأيمن - معلومات تعريفية عن النظام
            يظهر فقط في الشاشات المتوسطة والكبيرة (md:flex)
            خلفية متدرجة من الأزرق إلى النيلي
          */}
          <div className="hidden flex-col justify-between bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white md:flex">
            <div>
              {/* شعار النظام */}
              <div className="mb-8 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Library className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold">نظام المكتبة</span>
              </div>

              {/* المحتوى التعريفي */}
              <div className="space-y-6">
                <h1 className="text-3xl leading-tight font-bold">
                  مرحباً بك في
                  <br />
                  نظام إدارة المكتبة
                </h1>
                <p className="text-sm leading-relaxed text-blue-100">
                  نظام متكامل لإدارة الكتب، الأعضاء، والطلبات بكل سهولة
                  واحترافية
                </p>

                {/* قائمة المميزات مع أيقونات */}
                <div className="space-y-4 pt-4">
                  {/* الميزة 1: عدد الكتب */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">أكثر من 1,000 كتاب</p>
                      <p className="text-xs text-blue-200">
                        متنوع في جميع المجالات
                      </p>
                    </div>
                  </div>

                  {/* الميزة 2: عدد الأعضاء */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">500+ عضو نشط</p>
                      <p className="text-xs text-blue-200">يستمتعون بخدماتنا</p>
                    </div>
                  </div>

                  {/* الميزة 3: إدارة ذكية */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">إدارة ذكية</p>
                      <p className="text-xs text-blue-200">
                        تقارير وإحصائيات دقيقة
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* حقوق النشر في أسفل القسم الأيمن */}
            <div className="mt-8 text-xs text-blue-200">
              © 2026 جميع الحقوق محفوظة
            </div>
          </div>

          {/* 
            القسم الأيسر - نموذج تسجيل الدخول
            يحتوي على الحقول والأزرار والخيارات
          */}
          <div className="p-8">
            {/* عنوان النموذج ووصفه */}
            <div className="mb-6 text-center md:text-right">
              <h2 className="mb-1 text-2xl font-bold">تسجيل الدخول</h2>
              <p className="text-sm text-gray-500">
                أدخل اسم المستخدم أو البريد الإلكتروني
              </p>
            </div>

            {/* نموذج تسجيل الدخول مع معالج الإرسال */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* حقل اسم المستخدم / البريد الإلكتروني */}
              <div>
                <Label
                  htmlFor="identifier"
                  className="mb-1 block text-sm text-gray-700"
                >
                  اسم المستخدم أو البريد الإلكتروني
                </Label>
                <div className="relative">
                  {/* أيقونة المستخدم في الجانب الأيمن */}
                  <User className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="ahmed_mohamed أو ahmed@library.com"
                    className="h-10 pr-9 text-sm"
                    {...register("email")} // ربط الحقل مع React Hook Form
                  />
                </div>
                {/* عرض رسالة الخطأ إذا وجدت */}
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* حقل كلمة المرور */}
              <div>
                <Label
                  htmlFor="password"
                  className="mb-1 block text-sm text-gray-700"
                >
                  كلمة المرور
                </Label>
                <div className="relative">
                  {/* أيقونة القفل في الجانب الأيمن */}
                  <Lock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"} // تبديل النوع بناءً على حالة showPassword
                    placeholder="••••••"
                    className="h-10 rounded-lg pr-9 pl-9 text-sm"
                    {...register("password")} // ربط الحقل مع React Hook Form
                  />
                  {/* زر إظهار/إخفاء كلمة المرور */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 transform"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {/* عرض رسالة الخطأ إذا وجدت */}
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* خيارات إضافية: تذكرني ونسيت كلمة المرور */}
              <div className="flex items-center justify-between">
                {/* Checkbox تذكرني */}
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register("rememberMe")} // ربط الحقل مع React Hook Form
                  />
                  <span className="text-sm text-gray-600">تذكرني</span>
                </label>
                {/* رابط نسيت كلمة المرور */}
                <a href="#" className="text-sm text-primary">
                  نسيت كلمة المرور؟
                </a>
              </div>

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                disabled={isLoading} // تعطيل الزر أثناء التحميل
                className="h-10 w-full"
              >
                {isLoading ? (
                  // حالة التحميل: عرض مؤشر دوران ونص "جاري الدخول..."
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span className="text-sm">جاري الدخول...</span>
                  </div>
                ) : (
                  // الحالة العادية: عرض نص "تسجيل الدخول" وأيقونة الدخول
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm">تسجيل الدخول</span>
                    <LogIn className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* قسم الحسابات التجريبية - لملء النموذج تلقائياً */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="mb-3 text-center text-xs text-gray-400">
                حسابات تجريبية
              </p>

              {/* الصف الأول من الأزرار: أسماء المستخدمين */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // تعيين بيانات مدير النظام (اسم المستخدم)
                    setValue("email", "ahmed_mohamed")
                    setValue("password", "123456")
                  }}
                  className="flex-1 rounded-lg bg-gray-50 p-2 text-xs transition-colors hover:bg-gray-100"
                >
                  <div className="font-medium text-gray-700">مدير النظام</div>
                  <div className="text-gray-400">ahmed_mohamed</div>
                </button>
                <button
                  onClick={() => {
                    // تعيين بيانات أمين المكتبة (اسم المستخدم)
                    setValue("email", "sara_ahmed")
                    setValue("password", "123456")
                  }}
                  className="flex-1 rounded-lg bg-gray-50 p-2 text-xs transition-colors hover:bg-gray-100"
                >
                  <div className="font-medium text-gray-700">أمين مكتبة</div>
                  <div className="text-gray-400">sara_ahmed</div>
                </button>
              </div>

              {/* الصف الثاني من الأزرار: البريد الإلكتروني */}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    // تعيين بيانات مدير النظام (البريد الإلكتروني)
                    setValue("email", "ahmed@library.com")
                    setValue("password", "123456")
                  }}
                  className="flex-1 rounded-lg bg-gray-50 p-2 text-xs transition-colors hover:bg-gray-100"
                >
                  <div className="font-medium text-gray-700">مدير النظام</div>
                  <div className="text-gray-400">ahmed@library.com</div>
                </button>
                <button
                  onClick={() => {
                    // تعيين بيانات أمين المكتبة (البريد الإلكتروني)
                    setValue("email", "sara@library.com")
                    setValue("password", "123456")
                  }}
                  className="flex-1 rounded-lg bg-gray-50 p-2 text-xs transition-colors hover:bg-gray-100"
                >
                  <div className="font-medium text-gray-700">أمين مكتبة</div>
                  <div className="text-gray-400">sara@library.com</div>
                </button>
              </div>
            </div>

            {/* حقوق النشر في الشاشات الصغيرة (تظهر فقط عندما يكون القسم الأيمن مخفياً) */}
            <div className="mt-6 border-t border-gray-100 pt-4 md:hidden">
              <div className="text-center text-xs text-gray-400">
                © 2026 نظام المكتبة
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
