import { Users, AlertCircle, Book } from "lucide-react"
import StatCard from "../stat-card"
import { BooksDistribution, OrdersChart } from "./charts"

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
    </>
  )
}
