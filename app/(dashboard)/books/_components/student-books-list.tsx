import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookListResponse } from "@/types/types"
import { DataTable } from "@/components/data-table"
import { studentBookColumns } from "./columns"

export default function StudentBooksTable({
  initialData,
}: {
  initialData: BookListResponse
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الكتب</CardTitle>
        <CardDescription>إجمالي {initialData.total} كتاب</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={studentBookColumns} data={initialData.books} />
      </CardContent>
    </Card>
  )
}
