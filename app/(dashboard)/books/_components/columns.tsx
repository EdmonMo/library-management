"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BookResponse } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Ellipsis, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import BookAvailablityBadge from "./book-availability-badge"
import { SortableHeader } from "@/components/data-table"

export const adminBookColumns: ColumnDef<BookResponse>[] = [
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
    accessorKey: "availableCopies",
    header: ({ column }) => (
      <SortableHeader column={column}>النسخ المتاحة</SortableHeader>
    ),
    cell: ({ row }) => (
      <BookAvailablityBadge availableCopies={row.getValue("availableCopies")} />
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
              href={`/books/${row.original.id}`}
              className="flex items-center gap-2"
            >
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

export const studentBookColumns: ColumnDef<BookResponse>[] = [
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
    accessorKey: "availableCopies",
    header: ({ column }) => (
      <SortableHeader column={column}>النسخ المتاحة</SortableHeader>
    ),
    cell: ({ row }) => (
      <BookAvailablityBadge availableCopies={row.getValue("availableCopies")} />
    ),
  },
  {
    id: "actions",
    header: "الإجراءات",
    enableSorting: false,
    cell: ({ row }) => (
      <Link href={`/books/${row.original.id}`}>
        <Eye className="h-4 w-4" />
      </Link>
    ),
  },
]
