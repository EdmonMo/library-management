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
import { Edit, Ellipsis, Trash2 } from "lucide-react"
import Link from "next/link"
import UsersActiveStatusBadge from "@/components/users/users-active-status-badge"
import UsersRoleBadge from "@/components/users/users-role-badge"
import { SortableHeader } from "@/components/data-table"

export const employeeColumns: ColumnDef<UserResponse>[] = [
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
        <div className="font-medium">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <SortableHeader column={column}>البريد الإلكتروني</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("phone") ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <SortableHeader column={column}>الوظيفة</SortableHeader>
    ),
    cell: ({ row }) => <UsersRoleBadge role={row.getValue("role")} />,
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
            <Link href={`/books/`} className="flex items-center gap-2">
              <Edit />
              تعديل
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500 hover:text-red-600">
            <Trash2 />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
