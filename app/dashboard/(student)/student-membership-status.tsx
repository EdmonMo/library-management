import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserResponse } from "@/types/types"
import { BookAlert, Calendar, User } from "lucide-react"

export default function StudentMembershipStaus({
  user,
}: {
  user: UserResponse & {
    _count: {
      rentals: number
    }
  }
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات العضوية</CardTitle>
        <CardDescription>تفاصيل عضويتك في المكتبة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">رقم الطالب</p>
              <p className="font-semibold text-gray-900">{user.studentId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <BookAlert className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                الحد الأقصى للاستعارة
              </p>
              <p className="font-semibold text-gray-900">3</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
              <p className="font-semibold text-gray-900">
                {user.createdAt.toDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
