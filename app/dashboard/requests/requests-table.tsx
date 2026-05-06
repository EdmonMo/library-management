"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CircleCheck, CircleX, Ellipsis, Eye, FileText } from "lucide-react"
import Link from "next/link"
import RequestStatusBadge from "./components/request-status-badge"
import RequestTypeBadge from "./components/request-type-status"

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
        <CardDescription>عرض طلب من إجمالي طلب</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">العضو</TableHead>
                <TableHead className="text-right">الكتاب</TableHead>
                <TableHead className="hidden text-right md:table-cell">
                  نوع الطلب
                </TableHead>
                <TableHead className="hidden text-right lg:table-cell">
                  التاريخ
                </TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 bg-blue-500">
                        <AvatarFallback className="text-xs text-white">
                          {request.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{request.memberName}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {request.bookTitle}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {request.bookTitle}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <RequestTypeBadge type={request.type} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {request.date}
                  </TableCell>
                  <TableCell>
                    <RequestStatusBadge status={request.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="outline">
                            <Ellipsis />
                          </Button>
                        }
                      />

                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link
                            href={"/books/"}
                            className="flex items-center gap-2"
                          >
                            <Eye />
                            عرض
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-green-500 hover:text-green-600">
                          <CircleCheck />
                          قبول
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 hover:text-red-600">
                          <CircleX />
                          رفض
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {initialData.length === 0 && (
          <div className="py-8 text-center">
            <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-muted-foreground">
              لا توجد طلبات تطابق معايير البحث
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
