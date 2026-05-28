import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUsersAction } from "@/actions/users"
import ListPageShell from "@/components/list-page-shell"
import { employeeColumns } from "./_components/columns"

export default async function EmployeesPage() {
  const { data: users, success } = await getUsersAction({
    page: 1,
    limit: 20,
    roles: ["EMPLOYEE", "ADMIN"],
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

      <ListPageShell
        title="قائمة الموظفين"
        description={`إجمالي ${users.total} موظف`}
        data={users.users}
        columns={employeeColumns}
        searchPlaceholder="اسم، بريد، أو رقم..."
        extra={
          <Button className="bg-blue-600 shadow-sm hover:bg-blue-700">
            <Link href="/employees/add" className="flex items-center gap-2">
              <UserPlus className="ml-2 h-4 w-4" />
              إضافة موظف جديد
            </Link>
          </Button>
        }
      />
    </>
  )
}
