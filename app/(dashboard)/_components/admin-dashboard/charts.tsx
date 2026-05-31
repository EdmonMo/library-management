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

type CategoryDist = {
  name: string
  count: number
  percentage: number
  color: string
}

type ActivityDay = {
  day: string
  borrowed: number
  returned: number
}

export function BooksDistribution({
  categories,
}: {
  categories: CategoryDist[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>توزيع الكتب حسب التصنيف</CardTitle>
        <CardDescription>أكثر 5 تصنيفات طلباً في المكتبة</CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            لا توجد تصنيفات بعد
          </p>
        ) : (
          <div className="space-y-5">
            {categories.map((item, index) => (
              <div key={index}>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.count.toLocaleString()} كتاب
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2.5 rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OrdersChart({ activity }: { activity: ActivityDay[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نشاط الاستعارة والإرجاع</CardTitle>
        <CardDescription>
          معدل العمليات خلال الخمسة عشر يوماً الماضية
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            لا توجد بيانات استعارة خلال الخمسة عشر يوماً الماضية
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activity}>
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
                  allowDecimals={false}
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
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">استعارة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-sm text-muted-foreground">إرجاع</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
