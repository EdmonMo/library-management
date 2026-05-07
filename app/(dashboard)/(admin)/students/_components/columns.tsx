"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserResponse } from "@/types/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleMinus, Ellipsis, Eye } from "lucide-react"
import Link from "next/link"
import UsersActiveStatusBadge from "@/components/users/users-active-status-badge"
import { SortableHeader } from "@/components/data-table"

export const studentColumns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>الاسم</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 bg-linear-to-br from-blue-400 to-blue-600">
          <AvatarFallback className="bg-transparent text-xs text-white">
            {row.original.name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-muted-foreground md:hidden">
            {row.original.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <SortableHeader column={column}>البريد الإلكتروني</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="hidden text-muted-foreground md:block">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <SortableHeader column={column}>الرقم الجامعي</SortableHeader>
    ),
    cell: ({ row }) => row.getValue("studentId") ?? "—",
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <SortableHeader column={column}>الحالة</SortableHeader>
    ),
    cell: ({ row }) => (
      <UsersActiveStatusBadge isActive={row.getValue("isActive")} />
    ),
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
            <Link
              href={`/users/${row.original.id}`}
              className="flex items-center gap-2"
            >
              <Eye />
              التفاصيل
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-600">
            <CircleMinus />
            تعطيل
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
