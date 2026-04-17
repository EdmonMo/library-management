"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  BookOpen,
  Eye,
  EyeOff,
  Library,
  Lock,
  LogIn,
  Mail,
  Phone,
  TrendingUp,
  User,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignupFormData, signupSchema } from "@/lib/validations"
import { toast } from "sonner"
import { signupAction } from "@/actions/auth"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  function onSubmit(data: SignupFormData) {
    startTransition(async () => {
      const result = await signupAction(data)

      if (result.success) {
        toast.success(result.message)
        router.push("/login")
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
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
              {/* حقل اسم المستخدم */}
              <div>
                <Label
                  htmlFor="name"
                  className="mb-1 block text-sm text-gray-700"
                >
                  اسم المستخدم
                </Label>
                <div className="relative">
                  {/* أيقونة المستخدم في الجانب الأيمن */}
                  <User className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="ahmed_mohamed"
                    className="h-10 pr-9 text-sm"
                    {...register("name")} // ربط الحقل مع React Hook Form
                  />
                </div>
                {/* عرض رسالة الخطأ إذا وجدت */}
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* حقل البريد الإلكتروني */}
              <div>
                <Label
                  htmlFor="email"
                  className="mb-1 block text-sm text-gray-700"
                >
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  {/* أيقونة البريد الالكتروني في الجانب الأيمن */}
                  <Mail className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmed@library.com"
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

              {/* حقل رقم الهاتف */}
              <div>
                <Label
                  htmlFor="phone"
                  className="mb-1 block text-sm text-gray-700"
                >
                  رقم الهاتف (اختياري)
                </Label>
                <div className="relative">
                  {/* أيقونة رقم الهاتف في الجانب الأيمن */}
                  <Phone className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    className="h-10 pr-9 text-sm"
                    {...register("phone")} // ربط الحقل مع React Hook Form
                  />
                </div>
                {/* عرض رسالة الخطأ إذا وجدت */}
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.phone.message}
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

              {/* زر انشاء الحساب */}
              <Button
                type="submit"
                disabled={isPending} // تعطيل الزر أثناء التحميل
                className="h-10 w-full"
              >
                {isPending ? (
                  // حالة التحميل: عرض مؤشر دوران ونص "جاري انشاء الحساب..."
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span className="text-sm">جاري انشاء الحساب...</span>
                  </div>
                ) : (
                  // الحالة العادية: عرض نص "انشاء الحساب" وأيقونة انشاء الحساب
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm">انشاء الحساب</span>
                    <LogIn className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

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
