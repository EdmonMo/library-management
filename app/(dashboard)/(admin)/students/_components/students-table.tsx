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
import { studentColumns } from "./columns"

export default function StudentsTable({
  initialData,
}: {
  initialData: UserListResponse
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الطلاب</CardTitle>
        <CardDescription>إجمالي {initialData.total} طالب</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={studentColumns} data={initialData.users} />
      </CardContent>
    </Card>
  )
}
