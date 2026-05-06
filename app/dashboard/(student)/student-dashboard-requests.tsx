import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ArrowLeft, Book } from "lucide-react"
import Link from "next/link"
import RequestStatusBadge from "../requests/components/request-status-badge"
import { Badge } from "@/components/ui/badge"
export default function StudentDashboardRequests() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>آخر طلباتي</CardTitle>
            <CardDescription>
              متابعة حالة طلبات الاستعارة والإرجاع
            </CardDescription>
          </div>
          <Link href="/student/my-requests">
            <Button variant="ghost" size="sm" className="gap-1">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {[].length > 0 ? (
          <div className="space-y-3">
            {[].map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between border-b p-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {request.bookTitle}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {request.type === "استعارة" ? "استعارة" : "إرجاع"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {request.date}
                    </span>
                  </div>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Book className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-muted-foreground">لا توجد طلبات سابقة</p>
            <Link href="/student/books">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                استعارة كتاب الآن
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
