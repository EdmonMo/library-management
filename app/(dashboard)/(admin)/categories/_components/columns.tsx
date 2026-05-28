"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { CategoryResponse } from "@/types/types"
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
import { deleteCategoryAction } from "@/actions/categories"
import { toast } from "sonner"

function CategoryActionsCell({
  category,
}: {
  category: CategoryResponse & { _count?: { books: number } }
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
              href={`/categories/${category.id}`}
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
      <DeleteCategoryDialog
        category={category}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: CategoryResponse & { _count?: { books: number } }
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteCategoryAction(category.id)
    if (result.success) {
      toast.success("تم حذف التصنيف بنجاح")
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
            هل أنت متأكد من حذف &laquo;{category.name}&raquo;؟
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

export const categoryColumns: ColumnDef<
  CategoryResponse & { _count?: { books: number } }
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>الاسم</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-500" />
        <div className="font-medium">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "الوصف",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.description ?? "—"}
      </span>
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
    cell: ({ row }) => (
      <CategoryActionsCell
        category={
          row.original as CategoryResponse & { _count?: { books: number } }
        }
      />
    ),
  },
]
