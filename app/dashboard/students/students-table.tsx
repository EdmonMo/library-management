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
import { UserListResponse } from "@/types/types"
import { CircleMinus, Ellipsis, Eye } from "lucide-react"
import Link from "next/link"

export default function StudentsTable({
  initialData,
}: {
  initialData: UserListResponse
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الطلاب</CardTitle>
        <CardDescription>عرض عضو من إجمالي عضو</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الرقم الجامعي</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-linear-to-br from-blue-400 to-blue-600">
                        <AvatarFallback className="bg-transparent text-xs text-white">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell>{user.studentId || "---"}</TableCell>
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
                            href={"/users/" + user.id}
                            className="flex items-center gap-2"
                          >
                            <Eye />
                            التفاصيل
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-600">
                          <CircleMinus />
                          تعطيل
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
