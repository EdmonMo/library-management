import { getBookById } from "@/actions/books"
import EditBookForm from "../_components/edit-book-form"
import { getCategoriesAction } from "@/actions/categories"
import { auth } from "@/lib/auth"
import ViewBook from "../_components/view-book"

interface Props {
  params: Promise<{ id: string }>
}

export default async function BookPage({ params }: Props) {
  const { id } = await params
  const { data: book } = await getBookById(id)
  const {
    data: { categories },
  } = await getCategoriesAction({
    limit: 100,
    page: 1,
  })
  const { user } = await auth()

  return (
    <>
      {user.role === "STUDENT" ? (
        <>
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              معاينة الكتاب
            </h1>
            <p className="text-muted-foreground">
              قم بمعاينة معلومات الكتاب في المكتبة الرقمية
            </p>
          </div>

          <ViewBook book={book} />
        </>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              تعديل الكتاب
            </h1>
            <p className="text-muted-foreground">
              قم بتعديل معلومات الكتاب في مكتبتك الرقمية
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-start gap-4 rounded-xl border border-blue-200 bg-linear-to-l from-blue-50 to-white p-4">
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-bold text-gray-800">
                  تعديل كتاب في النظام
                </h3>
                <p className="text-sm text-gray-600">
                  يرجى ملء جميع الحقول بدقة لضمان فهرسة صحيحة للكتاب في النظام.
                </p>
              </div>
            </div>

            <EditBookForm book={book} allCategories={categories} />
          </div>
        </>
      )}
    </>
  )
}
