import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import { JSX, Component } from "react"

/**
 * StatCard Component
 * بطاقة إحصائية تعرض مقياساً رئيسياً مع اتجاه التغيير (زيادة/نقصان)
 * @param {Object} props - خصائص المكون
 * @param {string} props.title - عنوان البطاقة (مثال: "كتب متأخرة")
 * @param {string|number} props.value - القيمة الإحصائية
 * @param {string} props.trend - اتجاه التغيير ('up' للزيادة، 'down' للنقصان)
 * @param {string} props.trendValue - قيمة التغيير (مثال: "+4%")
 * @param {Component} props.icon - أيقونة Lucide React
 * @param {string} props.color - لون البطاقة (red, orange, blue, teal)
 * @returns {JSX.Element} - بطاقة إحصائية تفاعلية
 */

export default function StatCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  trend: string
  trendValue: string
  icon: any
  color: string
}): JSX.Element {
  // إنشاء كلاسات CSS ديناميكية بناءً على اللون المحدد
  const bgColorClass = `bg-${color}-50`
  const textColorClass = `text-${color}-500`

  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        {/* رأس البطاقة: العنوان والقيمة والأيقونة */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="mt-1 text-2xl font-bold">{value}</h3>
          </div>
          <div className={`rounded-lg p-3 ${bgColorClass}`}>
            <Icon className={`h-5 w-5 ${textColorClass}`} />
          </div>
        </div>

        {/* اتجاه التغيير: سهم أخضر للأعلى أو أحمر للأسفل مع النسبة */}
        <div className="flex items-center gap-2">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={
              trend === "up"
                ? "text-sm font-medium text-green-600"
                : "text-sm font-medium text-red-600"
            }
          >
            {trendValue}
          </span>
          <span className="text-sm text-muted-foreground">من الشهر الماضي</span>
        </div>
      </CardContent>
    </Card>
  )
}
