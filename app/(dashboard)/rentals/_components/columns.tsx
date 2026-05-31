"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SortableHeader } from "@/components/data-table"
import type { RentalResponse } from "@/types/types"
import { Undo2 } from "lucide-react"

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

export function getRentalColumns(
  onReturn: (rental: RentalResponse) => void
): ColumnDef<RentalResponse>[] {
  return [
    {
      accessorKey: "student.name",
      header: ({ column }) => (
        <SortableHeader column={column}>الطالب</SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.student.name}
          <span className="mr-1 text-xs text-muted-foreground">
            ({row.original.student.studentId ?? "—"})
          </span>
        </div>
      ),
    },
    {
      accessorKey: "bookCopy.book.title",
      header: ({ column }) => (
        <SortableHeader column={column}>الكتاب</SortableHeader>
      ),
      cell: ({ row }) => (
        <div>
          <span className="font-medium">
            {row.original.bookCopy.book.title}
          </span>
          <span className="mr-1 text-xs text-muted-foreground">
            نسخة #{row.original.bookCopy.copyNumber}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "rentedAt",
      header: ({ column }) => (
        <SortableHeader column={column}>تاريخ الاستعارة</SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          {new Date(row.original.rentedAt).toLocaleDateString("ar-SA")}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <SortableHeader column={column}>تاريخ الاستحقاق</SortableHeader>
      ),
      cell: ({ row }) => (
        <span>
          {new Date(row.original.dueDate).toLocaleDateString("ar-SA")}
        </span>
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
          <Badge
            variant="outline"
            className={`${cfg.className} gap-1.5 font-medium`}
          >
            {cfg.label}
          </Badge>
        ) : (
          <span>{row.original.status}</span>
        )
      },
    },
    {
      id: "actions",
      header: "إجراءات",
      enableSorting: false,
      cell: ({ row }) => {
        const rental = row.original
        if (rental.status === "ACTIVE" || rental.status === "OVERDUE") {
          return (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => onReturn(rental)}
            >
              <Undo2 className="h-3.5 w-3.5" />
              إرجاع
            </Button>
          )
        }
        return null
      },
    },
  ]
}
