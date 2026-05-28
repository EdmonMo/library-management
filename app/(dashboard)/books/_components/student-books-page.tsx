import { getBooksAction } from "@/actions/books"
import { getCategoriesAction } from "@/actions/categories"
import ListPageShell from "@/components/list-page-shell"
import type { FilterConfig } from "@/components/list-page-shell"
import { studentBookColumns } from "./columns"

export default async function StudentBooksPage() {
  const initialBooks = await getBooksAction({
    page: 1,
    limit: 20,
  })

  const { data: catData } = await getCategoriesAction({ page: 1, limit: 100 })

  const categoryFilter: FilterConfig = {
    type: "select",
    label: "التصنيف",
    columnId: "categories",
    options: [
      { value: "all", label: "كل التصنيفات" },
      ...(catData?.categories.map((c) => ({
        value: c.name,
        label: c.name,
      })) ?? []),
    ],
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">تصفح الكتب</h1>
        <p className="text-muted-foreground">
          تصفح مجموعة الكتب المتوفرة في المكتبة
        </p>
      </div>

      <ListPageShell
        title="قائمة الكتب"
        description={`إجمالي ${initialBooks.data?.total ?? 0} كتاب`}
        data={initialBooks.data?.books ?? []}
        columns={studentBookColumns}
        searchPlaceholder="عنوان، مؤلف، أو رقم..."
        filters={[categoryFilter]}
      />
    </>
  )
}
