"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react"
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
    <>
      {/* عنوان النموذج ووصفه */}
      <div className="mb-6 text-center md:text-right">
        <h2 className="mb-1 text-2xl font-bold">تسجيل الدخول</h2>
        <p className="text-sm text-gray-500">
          أدخل اسم المستخدم أو البريد الإلكتروني
        </p>
      </div>

      {/* نموذج تسجيل الدخول مع معالج الإرسال */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            البريد الإلكتروني
          </Label>
          <div className="relative">
            <User className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              className="h-11 rounded-xl border-gray-200 bg-gray-50 pr-9 text-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 mr-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            كلمة المرور
          </Label>
          <div className="relative">
            <Lock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              className="h-11 rounded-xl border-gray-200 bg-gray-50 pr-9 pl-9 text-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 left-3 -translate-y-1/2 transform"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 transition-colors hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 transition-colors hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 mr-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              {...register("rememberMe")}
            />
            <span className="text-sm text-gray-600">تذكرني</span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full transform rounded-xl bg-linear-to-r from-blue-600 to-blue-700 py-3 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="text-base font-medium">جاري الدخول...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              <span className="text-base font-medium">تسجيل الدخول</span>
            </div>
          )}
        </Button>
      </form>

      {/* قسم الحسابات التجريبية - لملء النموذج تلقائياً */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="mb-3 text-center text-xs text-gray-400">حسابات تجريبية</p>

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
        {/* حقوق النشر في الشاشات الصغيرة (تظهر فقط عندما يكون القسم الأيمن مخفياً) */}
        <div className="mt-6 border-t border-gray-100 pt-4 md:hidden">
          <div className="text-center text-xs text-gray-400">
            © 2026 نظام المكتبة
          </div>
        </div>
      </div>
    </>
  )
}
