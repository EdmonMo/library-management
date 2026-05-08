import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserResponse } from "@/types/types"
import { Book } from "lucide-react"

export default function ProfileStats({
  user,
}: {
  user: UserResponse & { _count: { rentals: number } }
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نشاطي في المكتبة</CardTitle>
        <CardDescription>إحصائيات استخدام المكتبة</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">إجمالي الطلبات</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">0</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">الكتب المستعارة</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            {user._count.rentals}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">الكتب المعادة</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">0</span>
        </div>
      </CardContent>
    </Card>
  )
}
