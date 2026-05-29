import { Suspense } from "react"
import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import EmployeesFilter from "./_components/employees-filter"
import Link from "next/link"
import { getUsersAction } from "@/actions/users"
import EmployeesTable from "./_components/employees-table"

export default async function EmployeesPage(props: {
  searchParams: Promise<{
    search?: string
    role?: string
    status?: string
  }>
}) {
  const searchParams = await props.searchParams

  let roles: string[] | undefined
  if (searchParams.role === "ADMIN") roles = ["ADMIN"]
  else if (searchParams.role === "EMPLOYEE") roles = ["EMPLOYEE"]
  else roles = ["EMPLOYEE", "ADMIN"]

  let isActive: boolean | undefined
  if (searchParams.status === "active") isActive = true
  else if (searchParams.status === "inactive") isActive = false

  const { data: users, success } = await getUsersAction({
    page: 1,
    limit: 20,
    search: searchParams.search || undefined,
    roles,
    isActive,
  })

  if (!success) {
    return (
      <div className="text-center text-red-500">Error loading employees</div>
    )
  }
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إدارة الموظفين
        </h1>
        <p className="text-muted-foreground">
          إدارة حسابات الموظفين وصلاحياتهم في النظام
        </p>
      </div>

      <Button className="mb-8 bg-blue-600 shadow-sm hover:bg-blue-700">
        <Link href="/employees/add" className="flex items-center gap-2">
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة موظف جديد
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
        <EmployeesFilter />
      </Suspense>
      <EmployeesTable initialData={users} />
    </>
  )
}
