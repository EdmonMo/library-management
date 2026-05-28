import { Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCategoriesAction } from "@/actions/categories"
import ListPageShell from "@/components/list-page-shell"
import { categoryColumns } from "./_components/columns"

export default async function CategoriesPage() {
  const { data: categories, success } = await getCategoriesAction({
    page: 1,
    limit: 20,
  })

  if (!success) {
    return (
      <div className="text-center text-red-500">
        حدث خطأ أثناء تحميل التصنيفات
      </div>
    )
  }
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إدارة التصنيفات
        </h1>
        <p className="text-muted-foreground">
          إدارة تصنيفات الكتب وتنظيمها حسب الموضوعات والأقسام
        </p>
      </div>

      <ListPageShell
        title="قائمة التصنيفات"
        description={`إجمالي ${categories.total} تصنيف`}
        data={categories.categories}
        columns={categoryColumns}
        searchPlaceholder="اسم التصنيف..."
        extra={
          <Button className="bg-blue-600 shadow-sm hover:bg-blue-700">
            <Link href="/categories/add" className="flex items-center gap-2">
              <Tags className="ml-2 h-4 w-4" />
              إضافة تصنيف جديد
            </Link>
          </Button>
        }
      />
    </>
  )
}
