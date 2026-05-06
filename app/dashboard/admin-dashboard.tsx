"use client"
import { Users, Clock, AlertCircle, Book, ChevronLeft } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import StatCard from "./components/StatCard"
/**
 * activityData - بيانات نشاط المكتبة خلال الشهر
 * تمثل عدد عمليات الاستعارة والإرجاع في أيام مختلفة من الشهر
 * يستخدم لرسم المخطط البياني (Area Chart)
 */
const activityData = [
  { day: "01", borrowed: 45, returned: 30 },
  { day: "05", borrowed: 52, returned: 38 },
  { day: "10", borrowed: 48, returned: 42 },
  { day: "15", borrowed: 65, returned: 48 },
  { day: "20", borrowed: 58, returned: 55 },
  { day: "25", borrowed: 82, returned: 62 },
  { day: "30", borrowed: 95, returned: 72 },
]

/**
 * booksDistribution - توزيع الكتب حسب التصنيفات
 * يستخدم لعرض نسبة كل تصنيف من إجمالي الكتب
 * كل تصنيف يحتوي على: الاسم، العدد، النسبة المئوية، اللون
 */
const booksDistribution = [
  {
    category: "تكنولوجيا",
    count: 2450,
    percentage: 98,
    color: "bg-orange-500",
  },
  { category: "أدبي", count: 1890, percentage: 75.6, color: "bg-teal-500" },
  { category: "تاريخ", count: 1560, percentage: 62.4, color: "bg-slate-700" },
  { category: "علوم", count: 1230, percentage: 49.2, color: "bg-yellow-500" },
  { category: "روايات", count: 980, percentage: 39.2, color: "bg-orange-400" },
]

/**
 * recentOrders - بيانات الطلبات الأخيرة
 * قائمة بأحدث عمليات الاستعارة والإرجاع في المكتبة
 * كل طلب يحتوي على: المعرف، العضو، الكتاب، التاريخ، النوع، الحالة، الصورة الرمزية
 */
const recentOrders = [
  {
    id: "ORD-9921",
    member: "أحمد منصور",
    book: "مقدمة في علم البيانات",
    date: "2023-10-24",
    type: "استعارة",
    status: "مكتمل",
    avatar: "أ",
  },
  {
    id: "ORD-9922",
    member: "سارة خالد",
    book: "تاريخ الأندلس المصور",
    date: "2023-10-24",
    type: "استعارة",
    status: "قيد الانتظار",
    avatar: "س",
  },
  {
    id: "ORD-9923",
    member: "محمد علي",
    book: "فن الحرب",
    date: "2023-10-23",
    type: "إرجاع",
    status: "مكتمل",
    avatar: "م",
  },
  {
    id: "ORD-9924",
    member: "ليلى حسن",
    book: "الخوارزميات المتقدمة",
    date: "2023-10-23",
    type: "استعارة",
    status: "مرفوض",
    avatar: "ل",
  },
  {
    id: "ORD-9925",
    member: "ياسين عمر",
    book: "SQL قواعد البيانات",
    date: "2023-10-22",
    type: "استعارة",
    status: "مكتمل",
    avatar: "ي",
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
        <Card>
          <CardHeader>
            <CardTitle>توزيع الكتب حسب التصنيف</CardTitle>
            <CardDescription>أكثر 5 تصنيفات طلباً في المكتبة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {booksDistribution.map((item, index) => (
                <div key={index}>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {item.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.count.toLocaleString()} كتاب
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2.5 rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>نشاط الاستعارة والإرجاع</CardTitle>
            <CardDescription>
              معدل العمليات خلال الثلاثين يوماً الماضية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient
                    id="colorBorrowed"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorReturned"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="borrowed"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBorrowed)"
                  name="استعارة"
                />
                <Area
                  type="monotone"
                  dataKey="returned"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorReturned)"
                  name="إرجاع"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-muted-foreground">استعارة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-muted-foreground">إرجاع</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>أحدث الطلبات</CardTitle>
              <CardDescription>
                متابعة حالة طلبات الاستعارة الأخيرة
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => (window.location.href = "/requests")}
            >
              عرض الكل
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">العضو</TableHead>
                <TableHead className="text-right">الكتاب</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-linear-to-br from-blue-400 to-blue-600">
                        <AvatarFallback className="bg-transparent text-xs text-white">
                          {order.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{order.member}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.book}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.type === "استعارة" ? "default" : "secondary"
                      }
                    >
                      {order.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "مكتمل"
                          ? "default"
                          : order.status === "قيد الانتظار"
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        order.status === "مكتمل"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : order.status === "قيد الانتظار"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
