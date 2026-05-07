import { Users, Clock, AlertCircle, Book, ChevronLeft } from "lucide-react"
import StatCard from "../stat-card"
import { BooksDistribution, OrdersChart } from "./charts"
import RecentRequestsTable from "./recent-requests-table"

/**
 * recentOrders - بيانات الطلبات الأخيرة
 * قائمة بأحدث عمليات الاستعارة والإرجاع في المكتبة
 * كل طلب يحتوي على: المعرف، العضو، الكتاب، التاريخ، النوع، الحالة، الصورة الرمزية
 */
const recentOrders = [
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

export default function AdminDashboard() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          مرحباً بك، عبد الرحمن 👋
        </h1>
        <p className="text-muted-foreground">
          هذا ما يحدث في مكتبتك اليوم. مراجعة سريعة للإحصائيات
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="كتب متأخرة"
          value="12"
          trend="up"
          trendValue="+4%"
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="طلبات حالية"
          value="84"
          trend="down"
          trendValue="-2%"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="الأعضاء النشطون"
          value="3,120"
          trend="up"
          trendValue="+5.2%"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="إجمالي الكتب"
          value="12,450"
          trend="up"
          trendValue="+12%"
          icon={Book}
          color="teal"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BooksDistribution />
        <OrdersChart />
      </div>

      <RecentRequestsTable initialData={recentOrders} />
    </>
  )
}
