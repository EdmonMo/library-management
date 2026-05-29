import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getUsersAction } from "@/actions/users"
import StudentsFilter from "./_components/students-filter"
import StudentsTable from "./_components/students-table"

export default async function MembersPage(props: {
  searchParams: Promise<{ search?: string; status?: string }>
}) {
  const searchParams = await props.searchParams

  let isActive: boolean | undefined
  if (searchParams.status === "active") isActive = true
  else if (searchParams.status === "inactive") isActive = false

  const { data: users, success } = await getUsersAction({
    page: 1,
    limit: 20,
    roles: ["STUDENT"],
    search: searchParams.search || undefined,
    isActive,
  })

  if (success)
    return (
      <>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            إدارة الأعضاء
          </h1>
          <p className="text-muted-foreground">
            إدارة حسابات الأعضاء وتتبع استعاراتهم
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
                </div>
              </CardContent>
            </Card>
          }
        >
          <StudentsFilter />
        </Suspense>
        <StudentsTable initialData={users} />
      </>
    )
}
