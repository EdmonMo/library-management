"use client"
import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AuthorListResponse } from "@/types/types"
import { authorColumns } from "./columns"

export default function AuthorsTable({
  initialData,
}: {
  initialData: AuthorListResponse
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة المؤلفين</CardTitle>
        <CardDescription>إجمالي {initialData.total} مؤلف</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={authorColumns} data={initialData.authors} />
      </CardContent>
    </Card>
  )
}
