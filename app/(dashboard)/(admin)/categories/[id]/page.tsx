import { getCategoryByIdAction } from "@/actions/categories"
import EditCategoryForm from "./_components/edit-category-form"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: category, success } = await getCategoryByIdAction(id)

  if (!success || !category) {
    notFound()
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          تعديل التصنيف
        </h1>
        <p className="text-muted-foreground">تحديث بيانات التصنيف &laquo;{category.name}&raquo;</p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <EditCategoryForm category={category} />
      </div>
    </>
  )
}
