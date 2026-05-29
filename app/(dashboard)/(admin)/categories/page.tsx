import { Suspense } from "react"
import { Tags } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CategoriesFilter from "./_components/categories-filter"
import Link from "next/link"
import { getCategoriesAction } from "@/actions/categories"
import CategoriesTable from "./_components/categories-table"

export default async function CategoriesPage(props: {
  searchParams: Promise<{ name?: string }>
}) {
  const searchParams = await props.searchParams
  const { data: categories, success } = await getCategoriesAction({
    page: 1,
    limit: 20,
    name: searchParams.name || undefined,
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

      <Button className="mb-8 bg-blue-600 shadow-sm hover:bg-blue-700">
        <Link href="/categories/add" className="flex items-center gap-2">
          <Tags className="ml-2 h-4 w-4" />
          إضافة تصنيف جديد
        </Link>
      </Button>

      <Suspense
        fallback={
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-2 block h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        }
      >
        <CategoriesFilter />
      </Suspense>
      <CategoriesTable initialData={categories} />
    </>
  )
}
