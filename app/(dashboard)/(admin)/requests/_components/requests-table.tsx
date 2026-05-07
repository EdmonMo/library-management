"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { requestColumns } from "./columns"

type requests = {
  id: string
  memberId: string
  memberName: string
  bookId: string
  bookTitle: string
  type: string
  status: string
  date: string
  dueDate: string
  avatar: string
}

export default function RequestsTable({
  initialData,
}: {
  initialData: requests[]
}) {
  const handleApproveRequest = (request) => {
    // TODO
  }
  const handleRejectRequest = (requestId) => {
    //TODO
  }
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الطلبات</CardTitle>
        <CardDescription>إجمالي {initialData.length} طلبات</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={requestColumns} data={initialData} />
      </CardContent>
    </Card>
  )
}
