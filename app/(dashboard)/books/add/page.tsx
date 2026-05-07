// app/(dashboard)/books/add-book/page.jsx
import AddBookForm from "../_components/add-book-form"

export default function AddBookPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إضافة كتاب جديد
        </h1>
        <p className="text-muted-foreground">
          أدخل معلومات الكتاب الجديد لإضافته إلى مكتبتك الرقمية
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start gap-4 rounded-xl border border-blue-200 bg-linear-to-l from-blue-50 to-white p-4">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-gray-800">
              تسجيل كتاب جديد في النظام
            </h3>
            <p className="text-sm text-gray-600">
              يرجى ملء جميع الحقول بدقة لضمان فهرسة صحيحة للكتاب في النظام.
            </p>
          </div>
        </div>

        <AddBookForm />
      </div>
    </>
  )
}
