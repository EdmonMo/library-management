"use client"

import { useState } from "react"
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
import UsersActiveStatusBadge from "@/components/users/users-active-status-badge"
import UsersRoleBadge from "@/components/users/users-role-badge"
import { SortableHeader } from "@/components/data-table"
import { deleteUserAction } from "@/actions/users"
import { toast } from "sonner"

function DeleteEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: {
  employee: UserResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteUserAction(employee.id)
    if (result.success) {
      toast.success("تم تعطيل حساب الموظف بنجاح")
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
          <DialogTitle>تأكيد التعطيل</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من تعطيل حساب &laquo;{employee.name}&raquo;؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            تعطيل
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EmployeeActionsCell({ employee }: { employee: UserResponse }) {
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
              href={`/employees/${employee.id}`}
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
      <DeleteEmployeeDialog
        employee={employee}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

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
    cell: ({ row }) => <EmployeeActionsCell employee={row.original} />,
  },
]
