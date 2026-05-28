import AddCategoryForm from "./_components/add-category-form"

export default function AddCategoryPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إضافة تصنيف جديد
        </h1>
        <p className="text-muted-foreground">
          أدخل معلومات التصنيف الجديد لإضافته إلى قاعدة البيانات
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-linear-to-l from-amber-50 to-white p-4">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-gray-800">
              تسجيل تصنيف جديد في النظام
            </h3>
            <p className="text-sm text-gray-600">
              يرجى ملء جميع الحقول بدقة لضمان فهرسة صحيحة.
            </p>
          </div>
        </div>

        <AddCategoryForm />
      </div>
    </>
  )
}
