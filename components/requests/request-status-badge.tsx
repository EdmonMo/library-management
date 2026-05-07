import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react"

export default function RequestStatusBadge({ status }) {
  const variants = {
    مكتمل: {
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    "قيد الانتظار": {
      className: "bg-amber-100 text-amber-700 border-amber-200",
      icon: Clock,
    },
    مرفوض: {
      className: "bg-red-100 text-red-700 border-red-200",
      icon: XCircle,
    },
    متأخر: {
      className: "bg-orange-100 text-orange-700 border-orange-200",
      icon: AlertCircle,
    },
  }
  const config = variants[status] || variants["قيد الانتظار"]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`${config.className} gap-1.5 font-medium`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </Badge>
  )
}
