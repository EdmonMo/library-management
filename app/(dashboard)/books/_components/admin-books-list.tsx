import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookListResponse } from "@/types/types"
import { DataTable } from "@/components/data-table"
import { adminBookColumns } from "./columns"

export default function BooksTable({
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
        <DataTable columns={adminBookColumns} data={initialData.books} />
      </CardContent>
    </Card>
  )
}
