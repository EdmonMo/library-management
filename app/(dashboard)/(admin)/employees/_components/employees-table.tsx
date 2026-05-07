"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import UsersActiveStatusBadge from "@/components/users/users-active-status-badge"
import UsersRoleBadge from "@/components/users/users-role-badge"
import { UserListResponse } from "@/types/types"
import { Edit, Ellipsis, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EmployeesTable({
  initialData,
}: {
  initialData: UserListResponse
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الموظفين</CardTitle>
        <CardDescription>عرض موظف من إجمالي موظف</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>الوظيفة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-linear-to-br from-blue-400 to-blue-600">
                        <AvatarFallback className="bg-transparent text-xs text-white">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.phone || "---"}
                  </TableCell>
                  <TableCell>
                    <UsersRoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <UsersActiveStatusBadge isActive={user.isActive} />
                  </TableCell>
                  <TableCell>
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
                            href={"/books/"}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
