"use client"
import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CategoryListResponse } from "@/types/types"
import { categoryColumns } from "./columns"

export default function CategoriesTable({
  initialData,
}: {
  initialData: CategoryListResponse
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة التصنيفات</CardTitle>
        <CardDescription>إجمالي {initialData.total} تصنيف</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={categoryColumns} data={initialData.categories} />
      </CardContent>
    </Card>
  )
}
