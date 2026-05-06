"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    <>
      {/* عنوان النموذج ووصفه */}
      <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
        <GraduationCap className="mx-auto mb-1 h-5 w-5 text-blue-600" />
        <p className="text-sm font-medium text-blue-800">
          إنشاء حساب للطلاب فقط
        </p>
        <p className="text-xs text-blue-600">
          يمكن للطلاب فقط إنشاء حسابات جديدة
        </p>
      </div>

      {/* نموذج تسجيل الدخول مع معالج الإرسال */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            الاسم الكامل <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="أدخل اسمك الكامل"
              className="h-11 rounded-xl border-gray-200 bg-gray-50 pr-9 text-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="mt-1 mr-1 text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            البريد الإلكتروني <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
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
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            رقم الهاتف (اختياري)
          </Label>
          <div className="relative">
            <Phone className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="09XXXXXXXX"
              className="h-11 rounded-xl border-gray-200 bg-gray-50 pr-9 text-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("phone")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3">
          <GraduationCap className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-800">
            سيتم إنشاء حسابك كـ <strong>طالب</strong>
          </span>
        </div>

        <div>
          <Label
            htmlFor="reg-password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            كلمة المرور <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="reg-password"
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

        <div>
          <Label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            تأكيد كلمة المرور <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••"
              className="h-11 rounded-xl border-gray-200 bg-gray-50 pr-9 pl-9 text-sm focus:border-blue-500 focus:ring-blue-500"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 left-3 -translate-y-1/2 transform"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 transition-colors hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 transition-colors hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 mr-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full transform rounded-xl bg-linear-to-r from-green-600 to-green-700 py-3 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-green-700 hover:to-green-800 hover:shadow-xl active:scale-95"
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="text-base font-medium">
                جاري إنشاء الحساب...
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span className="text-base font-medium">
                إنشاء حساب طالب جديد
              </span>
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
    </>
  )
}
