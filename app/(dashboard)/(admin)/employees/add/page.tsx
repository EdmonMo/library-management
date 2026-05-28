import { UserPlus } from "lucide-react"
import AddEmployeeForm from "./_components/add-employee-form"

export default function AddEmployeePage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إضافة موظف جديد
        </h1>
        <p className="text-muted-foreground">
          أدخل معلومات الموظف الجديد لإضافته إلى النظام وتحديد صلاحياته
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start gap-4 rounded-xl border border-blue-200 bg-linear-to-l from-blue-50 to-white p-4">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-gray-800">
              تسجيل موظف جديد في النظام
            </h3>
            <p className="text-sm text-gray-600">
              يرجى ملء جميع الحقول المطلوبة بدقة. سيتمكن الموظف من تسجيل الدخول
              باستخدام البريد الإلكتروني وكلمة المرور.
            </p>
          </div>
        </div>

        <AddEmployeeForm />
      </div>
    </>
  )
}
