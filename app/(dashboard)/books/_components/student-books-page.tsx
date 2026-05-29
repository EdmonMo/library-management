import { Card, CardContent } from "@/components/ui/card"
import { getBooksAction } from "@/actions/books"
import { getCategoriesAction } from "@/actions/categories"
import BooksFilter from "./books-filter"
import StudentBooksTable from "./student-books-list"
import { Suspense } from "react"

export default async function StudentBooksPage({
  searchParams,
}: {
  searchParams: { search?: string; categoryId?: string; status?: string }
}) {
  const [initialBooks, { data: categoriesData }] = await Promise.all([
    getBooksAction({
      page: 1,
      limit: 20,
      search: searchParams.search || undefined,
      categoryId:
        searchParams.categoryId && searchParams.categoryId !== "all"
          ? searchParams.categoryId
          : undefined,
      status:
        searchParams.status === "available" || searchParams.status === "rented"
          ? searchParams.status
          : undefined,
    }),
    getCategoriesAction({ page: 1, limit: 50 }),
  ])

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">تصفح الكتب</h1>
        <p className="text-muted-foreground">
          تصفح مجموعة الكتب المتوفرة في المكتبة
        </p>
      </div>

      <Suspense
        fallback={
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-2 block h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                </div>
                <div>
                  <div className="mb-2 block h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                </div>
                <div>
                  <div className="mb-2 block h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        }
      >
        <BooksFilter categories={categoriesData?.categories ?? []} />
      </Suspense>
      <StudentBooksTable initialData={initialBooks.data} />
    </>
  )
}
