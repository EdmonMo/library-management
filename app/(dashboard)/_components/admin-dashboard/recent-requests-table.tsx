"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { requestColumns } from "../../(admin)/requests/_components/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

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

export default function RecentRequestsTable({
  initialData,
}: {
  initialData: requests[]
}) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-3">
        <CardTitle>اخر الطلبات</CardTitle>
        <Button variant="outline">
          <Link href="/requests">عرض الكل</Link>
          <ChevronLeft />
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable columns={requestColumns} data={initialData} />
      </CardContent>
    </Card>
  )
}
