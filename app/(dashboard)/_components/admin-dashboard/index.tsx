import { Users, AlertCircle, Book } from "lucide-react"
import StatCard from "../stat-card"
import { BooksDistribution, OrdersChart } from "./charts"
import { getRentalStatsAction } from "@/actions/rentals"
import { getDashboardChartsAction } from "@/actions/dashboard"

export default async function AdminDashboard() {
  const [stats, chartsData] = await Promise.all([
    getRentalStatsAction(),
    getDashboardChartsAction(),
  ])

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          مرحباً بك في لوحة التحكم 👋
        </h1>
        <p className="text-muted-foreground">
          هذا ما يحدث في مكتبتك اليوم. مراجعة سريعة للإحصائيات
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="استعارات نشطة"
          value={stats?.data?.active ?? 0}
          icon={Book}
          color="blue"
        />
        <StatCard
          title="كتب متأخرة"
          value={stats?.data?.overdue ?? 0}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="تمت الإعادة"
          value={stats?.data?.returned ?? 0}
          icon={Users}
          color="teal"
        />
        <StatCard
          title="إجمالي الاستعارات"
          value={stats?.data?.total ?? 0}
          icon={Book}
          color="teal"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BooksDistribution categories={chartsData.booksDist} />
        <OrdersChart activity={chartsData.activity} />
      </div>
    </>
  )
}
