import { Clock, CheckCircle2, XCircle, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import RequestsTable from "./requests-table"
import RequestsFilter from "./components/requests-filter"

const requestsData = [
  {
    id: "REQ-001",
    memberId: "MBR-001",
    memberName: "عبدالله السالم",
    bookId: "BK-101",
    bookTitle: "مقدمة في علم البيانات",
    type: "استعارة",
    status: "مكتمل",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    avatar: "ع",
  },
  {
    id: "REQ-002",
    memberId: "MBR-002",
    memberName: "فاطمة الزهراء",
    bookId: "BK-102",
    bookTitle: "تاريخ الأندلس المفقود",
    type: "استعارة",
    status: "قيد الانتظار",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    avatar: "ف",
  },
  {
    id: "REQ-003",
    memberId: "MBR-003",
    memberName: "يوسف علي",
    bookId: "BK-103",
    bookTitle: "روائع الأدب العربي",
    type: "إرجاع",
    status: "مكتمل",
    date: "2024-01-25",
    dueDate: null,
    avatar: "ي",
  },
  {
    id: "REQ-004",
    memberId: "MBR-004",
    memberName: "نورة عبدالله",
    bookId: "BK-104",
    bookTitle: "أساسيات الفيزياء الحديثة",
    type: "استعارة",
    status: "مرفوض",
    date: "2024-01-28",
    dueDate: null,
    avatar: "ن",
  },
  {
    id: "REQ-005",
    memberId: "MBR-005",
    memberName: "عمر خالد",
    bookId: "BK-105",
    bookTitle: "إدارة الوقت والذات",
    type: "استعارة",
    status: "متأخر",
    date: "2024-01-10",
    dueDate: "2024-02-10",
    avatar: "ع",
  },
  {
    id: "REQ-006",
    memberId: "MBR-006",
    memberName: "سارة أحمد",
    bookId: "BK-106",
    bookTitle: "فن الحرب",
    type: "استعارة",
    status: "قيد الانتظار",
    date: "2024-01-30",
    dueDate: "2024-03-01",
    avatar: "س",
  },
]

export default function RequestsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
        <p className="text-muted-foreground">
          متابعة وإدارة طلبات استعارة وإرجاع الكتب
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-blue-700">
                  {requestsData.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">قيد الانتظار</p>
                <p className="text-2xl font-bold text-amber-700">
                  {
                    requestsData.filter((req) => req.status === "قيد الانتظار")
                      .length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">مكتملة</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {requestsData.filter((req) => req.status === "مكتمل").length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">مرفوضة</p>
                <p className="text-2xl font-bold text-red-700">
                  {requestsData.filter((req) => req.status === "مرفوض").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <RequestsFilter />
      <RequestsTable initialData={requestsData} />
    </>
  )
}
