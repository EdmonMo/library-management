import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

/**
 * BookAvailablityBadge Component
 * عرض حالة الكتاب بشكل مرئي مع أيقونة ولون مناسب
 * @param {Object} props - خصائص المكون
 * @param {string} props.status - حالة الكتاب ('متاح', 'معار', 'صيانة')
 * @returns {JSX.Element} - عنصر الشارة التفاعلي
 */
export default function BookAvailablityBadge({ availableCopies }) {
  // تعريف متغيرات الحالات المختلفة مع ألوانها وأيقوناتها
  const variants = {
    available: {
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    unavailable: {
      className: "bg-red-100 text-red-700 border-red-200",
      icon: AlertCircle,
    },
  }
  const config = availableCopies > 0 ? variants.available : variants.unavailable
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`${config.className} flex items-center gap-1.5 font-medium`}
    >
      <Icon />
      {availableCopies}
    </Badge>
  )
}
