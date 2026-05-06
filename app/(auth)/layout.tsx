"use client"
import { BookOpen, Library, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Layout({ children }) {
  const pathname = usePathname()

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
            <div className="mb-6 flex justify-center gap-2 rounded-xl bg-gray-100 p-1">
              <Link href="/login">
                <button
                  className={`flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-base font-medium transition-all ${
                    pathname === "/login"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  تسجيل الدخول
                </button>
              </Link>
              <Link href="/signup">
                <button
                  className={`flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-base font-medium transition-all ${
                    pathname === "/signup"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  انشاء حساب
                </button>
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
