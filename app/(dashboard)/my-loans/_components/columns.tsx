"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { SortableHeader } from "@/components/data-table"

export const MyLoansColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortableHeader column={column}>العنوان</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "publisher",
    header: ({ column }) => (
      <SortableHeader column={column}>الناشر</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("publisher") ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "categories",
    header: "التصنيف",
    // Disable sorting on array columns
    enableSorting: false,
    cell: ({ row }) => {
      const categories = row.original.categories
      return categories[0] ? (
        <Badge variant="secondary" className="font-normal">
          {categories[0].name}
        </Badge>
      ) : null
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column}>الحالة</SortableHeader>
    ),
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
]
