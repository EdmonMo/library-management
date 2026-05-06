import { Badge } from "@/components/ui/badge"

/**
 * UsersActiveStatusBadge Component
 * عرض حالة المستخدم بشكل مرئي ولون مناسب
 * @param {Object} props - خصائص المكون
 * @param {string} props.isActive - حالة الحساب (مفعل او معطل)
 * @returns {JSX.Element} - عنصر الشارة التفاعلي
 */
export default function UsersActiveStatusBadge({
  isActive,
}: {
  isActive: boolean
}) {
  if (isActive)
    return (
      <Badge
        variant="outline"
        className="border-green-200 bg-green-100 text-green-700"
      >
        مفعل
      </Badge>
    )

  return (
    <Badge variant="outline" className="border-red-200 bg-red-100 text-red-700">
      معطل
    </Badge>
  )
}
