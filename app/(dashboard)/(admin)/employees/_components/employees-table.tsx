"use client"
import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserListResponse } from "@/types/types"
import { employeeColumns } from "./columns"

export default function EmployeesTable({
  initialData,
}: {
  initialData: UserListResponse
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الموظفين</CardTitle>
        <CardDescription>إجمالي {initialData.total} موظف</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={employeeColumns} data={initialData.users} />
      </CardContent>
    </Card>
  )
}
