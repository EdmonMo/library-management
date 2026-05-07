import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

/**
 * BookStatusBadge Component
 * عرض حالة الكتاب بشكل مرئي مع أيقونة ولون مناسب
 * @param {Object} props - خصائص المكون
 * @param {string} props.status - حالة الكتاب ('متاح', 'معار', 'صيانة')
 * @returns {JSX.Element} - عنصر الشارة التفاعلي
 */
export default function BookStatusBadge({ status }) {
  // تعريف متغيرات الحالات المختلفة مع ألوانها وأيقوناتها
  const variants = {
    متاح: {
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    معار: {
      className: "bg-amber-100 text-amber-700 border-amber-200",
      icon: Clock,
    },
    صيانة: {
      className: "bg-red-100 text-red-700 border-red-200",
      icon: AlertCircle,
    },
  }
  const config = variants[status] || variants["متاح"]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`${config.className} gap-1.5 font-medium`}
    >
      <Icon />
      {status}
    </Badge>
  )
}
