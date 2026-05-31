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
import { CircleMinus, Ellipsis } from "lucide-react"
import { useRouter } from "next/navigation"
import UsersActiveStatusBadge from "@/components/users/users-active-status-badge"
import { SortableHeader } from "@/components/data-table"
import { deleteUserAction } from "@/actions/users"
import { toast } from "sonner"

function DisableStudentDialog({
  student,
  open,
  onOpenChange,
}: {
  student: UserResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()

  const handleDisable = async () => {
    const result = await deleteUserAction(student.id)
    if (result.success) {
      toast.success("تم تعطيل حساب الطالب بنجاح")
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
            هل أنت متأكد من تعطيل حساب &laquo;{student.name}&raquo;؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleDisable}>
            تعطيل
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StudentActionsCell({ student }: { student: UserResponse }) {
  const [disableOpen, setDisableOpen] = useState(false)

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
          <DropdownMenuItem
            className="cursor-pointer text-red-500 hover:text-red-600"
            onClick={() => setTimeout(() => setDisableOpen(true), 0)}
          >
            <CircleMinus />
            تعطيل
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DisableStudentDialog
        student={student}
        open={disableOpen}
        onOpenChange={setDisableOpen}
      />
    </>
  )
}

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
    cell: ({ row }) => <StudentActionsCell student={row.original} />,
  },
]
