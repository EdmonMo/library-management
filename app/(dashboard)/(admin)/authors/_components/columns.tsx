"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { AuthorResponse } from "@/types/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Edit, Ellipsis, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SortableHeader } from "@/components/data-table"
import { deleteAuthorAction } from "@/actions/authors"
import { toast } from "sonner"

function AuthorActionsCell({
  author,
}: {
  author: AuthorResponse & { _count?: { books: number } }
}) {
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
              href={`/authors/${author.id}`}
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
      <DeleteAuthorDialog
        author={author}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

function DeleteAuthorDialog({
  author,
  open,
  onOpenChange,
}: {
  author: AuthorResponse & { _count?: { books: number } }
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteAuthorAction(author.id)
    if (result.success) {
      toast.success("تم حذف المؤلف بنجاح")
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
            هل أنت متأكد من حذف &laquo;{author.name}&raquo;؟
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

export const authorColumns: ColumnDef<
  AuthorResponse & { _count?: { books: number } }
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>الاسم</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 bg-linear-to-br from-amber-400 to-amber-600">
          <AvatarFallback className="bg-transparent text-xs text-white">
            {row.original.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="font-medium">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    id: "books",
    header: "عدد الكتب",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.books ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>تاريخ الإضافة</SortableHeader>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.getValue("createdAt")).toLocaleDateString("ar-SA")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "الإجراءات",
    enableSorting: false,
    cell: ({ row }) => <AuthorActionsCell author={row.original} />,
  },
]
