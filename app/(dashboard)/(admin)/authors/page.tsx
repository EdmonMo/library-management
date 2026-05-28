import { PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getAuthorsAction } from "@/actions/authors"
import ListPageShell from "@/components/list-page-shell"
import { authorColumns } from "./_components/columns"

export default async function AuthorsPage() {
  const { data: authors, success } = await getAuthorsAction({
    page: 1,
    limit: 20,
  })

  if (!success) {
    return (
      <div className="text-center text-red-500">Error loading authors</div>
    )
  }
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إدارة المؤلفين
        </h1>
        <p className="text-muted-foreground">
          إدارة بيانات المؤلفين والمؤلفات المرتبطة بهم
        </p>
      </div>

      <ListPageShell
        title="قائمة المؤلفين"
        description={`إجمالي ${authors.total} مؤلف`}
        data={authors.authors}
        columns={authorColumns}
        searchPlaceholder="اسم المؤلف..."
        extra={
          <Button className="bg-blue-600 shadow-sm hover:bg-blue-700">
            <Link href="/authors/add" className="flex items-center gap-2">
              <PenLine className="ml-2 h-4 w-4" />
              إضافة مؤلف جديد
            </Link>
          </Button>
        }
      />
    </>
  )
}
