"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Edit, Ellipsis, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import BookAvailablityBadge from "./book-availability-badge"
import { SortableHeader } from "@/components/data-table"
import { deleteBookAction } from "@/actions/books"
import { toast } from "sonner"

function DeleteBookDialog({
  book,
  open,
  onOpenChange,
}: {
  book: BookResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteBookAction(book.id)
    if (result.success) {
      toast.success("تم حذف الكتاب بنجاح")
      router.refresh()
    } else {
      toast.error(result.message || "حدث خطأ")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من حذف &laquo;{book.title}&raquo;؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            حذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AdminBookActionsCell({ book }: { book: BookResponse }) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
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
              href={`/books/${book.id}`}
              className="flex items-center gap-2"
            >
              <Edit />
              تعديل
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 hover:text-red-600"
            onClick={() => setTimeout(() => setDeleteOpen(true), 0)}
          >
            <Trash2 />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteBookDialog
        book={book}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

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
    enableSorting: false,
    filterFn: (row, _columnId, filterValue: string) => {
      const cats = (row.getValue("categories") as { name: string }[]) ?? []
      return cats.some((c) => c.name === filterValue)
    },
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
    filterFn: (row, _columnId, filterValue: string) => {
      const copies = row.getValue("availableCopies") as number
      if (filterValue === "متاح") return copies > 0
      if (filterValue === "معار") return copies === 0
      return true
    },
    cell: ({ row }) => (
      <BookAvailablityBadge availableCopies={row.getValue("availableCopies")} />
    ),
  },
  {
    id: "actions",
    header: "الإجراءات",
    enableSorting: false,
    cell: ({ row }) => <AdminBookActionsCell book={row.original} />,
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
    filterFn: (row, _columnId, filterValue: string) => {
      const cats = (row.getValue("categories") as { name: string }[]) ?? []
      return cats.some((c) => c.name === filterValue)
    },
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
    filterFn: (row, _columnId, filterValue: string) => {
      const copies = row.getValue("availableCopies") as number
      if (filterValue === "متاح") return copies > 0
      if (filterValue === "معار") return copies === 0
      return true
    },
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
