"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleCheck, CircleX, Ellipsis, Eye } from "lucide-react"
import Link from "next/link"
import RequestTypeBadge from "@/components/requests/request-type-status"
import RequestStatusBadge from "@/components/requests/request-status-badge"
import { SortableHeader } from "@/components/data-table"

// Using the local type from requests-table.tsx
type Request = {
  id: string
  memberId: string
  memberName: string
  bookId: string
  bookTitle: string
  type: string
  status: string
  date: string
  dueDate: string | null
  avatar: string
}

export const requestColumns: ColumnDef<Request>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <SortableHeader column={column}>رقم الطلب</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "memberName",
    header: ({ column }) => (
      <SortableHeader column={column}>العضو</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-6 w-6 bg-blue-500">
          <AvatarFallback className="text-xs text-white">
            {row.original.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.getValue("memberName")}</div>
          <div className="text-xs text-muted-foreground md:hidden">
            {row.original.bookTitle}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "bookTitle",
    header: ({ column }) => (
      <SortableHeader column={column}>الكتاب</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="hidden text-muted-foreground md:block">
        {row.getValue("bookTitle")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "نوع الطلب",
    enableSorting: false,
    cell: ({ row }) => <RequestTypeBadge type={row.getValue("type")} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <SortableHeader column={column}>التاريخ</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("date")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column}>الحالة</SortableHeader>
    ),
    cell: ({ row }) => <RequestStatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "الإجراءات",
    enableSorting: false,
    cell: ({ row }) => (
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
            <Link href="/books/" className="flex items-center gap-2">
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
    ),
  },
]
