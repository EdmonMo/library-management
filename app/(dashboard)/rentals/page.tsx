import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getAllRentalsAction } from "@/actions/rentals"
import RentalsFilter from "./_components/rentals-filter"
import RentalsTable from "./_components/rentals-table"

export default async function RentalsPage(props: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}) {
  const searchParams = await props.searchParams

  const { data: rentals } = await getAllRentalsAction({
    page: Number(searchParams.page) || 1,
    limit: 20,
    search: searchParams.search,
    status:
      searchParams.status && searchParams.status !== "all"
        ? searchParams.status
        : undefined,
  })

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إدارة الاستعارات
        </h1>
        <p className="text-muted-foreground">
          عرض وإدارة جميع عمليات الاستعارة والإرجاع في المكتبة
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
              </div>
            </CardContent>
          </Card>
        }
      >
        <div className="mb-6">
          <RentalsFilter />
        </div>
      </Suspense>

      {rentals && <RentalsTable initialData={rentals} />}
    </>
  )
}
