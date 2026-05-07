import { Badge } from "@/components/ui/badge"
import { Book, RefreshCw } from "lucide-react"

export default function RequestTypeBadge({ type }) {
  const variants = {
    استعارة: {
      className: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Book,
    },
    إرجاع: {
      className: "bg-purple-100 text-purple-700 border-purple-200",
      icon: RefreshCw,
    },
  }
  const config = variants[type] || variants["استعارة"]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`${config.className} gap-1.5 font-medium`}
    >
      <Icon className="h-3.5 w-3.5" />
      {type}
    </Badge>
  )
}
