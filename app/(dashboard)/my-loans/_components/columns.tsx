"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { SortableHeader } from "@/components/data-table"
import type { RentalResponse } from "@/types/types"

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "نشط",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  RETURNED: {
    label: "تمت الإعادة",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  OVERDUE: {
    label: "متأخر",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  LOST: {
    label: "مفقود",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
}

export const MyLoansColumns: ColumnDef<RentalResponse>[] = [
  {
    accessorKey: "bookCopy.book.title",
    header: ({ column }) => (
      <SortableHeader column={column}>العنوان</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.bookCopy.book.title}</div>
    ),
  },
  {
    accessorKey: "bookCopy.book.publisher",
    header: ({ column }) => (
      <SortableHeader column={column}>الناشر</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.bookCopy.book.publisher ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "rentedAt",
    header: ({ column }) => (
      <SortableHeader column={column}>تاريخ الاستعارة</SortableHeader>
    ),
    cell: ({ row }) => (
      <span>{new Date(row.original.rentedAt).toLocaleDateString("ar-SA")}</span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <SortableHeader column={column}>تاريخ الاستحقاق</SortableHeader>
    ),
    cell: ({ row }) => (
      <span>{new Date(row.original.dueDate).toLocaleDateString("ar-SA")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column}>الحالة</SortableHeader>
    ),
    cell: ({ row }) => {
      const cfg = statusConfig[row.original.status]
      return cfg ? (
        <Badge variant="outline" className={`${cfg.className} gap-1.5 font-medium`}>
          {cfg.label}
        </Badge>
      ) : (
        <span>{row.original.status}</span>
      )
    },
  },
]
