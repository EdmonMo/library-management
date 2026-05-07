"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

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

export function BooksDistribution() {
  return (
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
  )
}

export function OrdersChart() {
  return (
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
              <linearGradient id="colorBorrowed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
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
  )
}
