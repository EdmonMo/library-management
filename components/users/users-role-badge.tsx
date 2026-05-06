import { Badge } from "@/components/ui/badge"

/**
 * UsersRoleBadge Component
 * عرض دور المستخدم بشكل مرئي ولون مناسب
 * @param {Object} props - خصائص المكون
 * @param {string} props.role - دور المستخدم ('ADMIN', 'EMPLOYEE', 'STUDENT')
 * @returns {JSX.Element} - عنصر الشارة التفاعلي
 */
export default function UsersRoleBadge({ role }) {
  // تعريف متغيرات الحالات المختلفة مع ألوانها وأيقوناتها
  const variants = {
    ADMIN: {
      className: "bg-amber-100 text-amber-700 border-amber-200",
    },
    EMPLOYEE: {
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    STUDENT: {
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
  }
  const config = variants[role] || ""

  return (
    <Badge
      variant="outline"
      className={`${config.className} gap-1.5 font-medium`}
    >
      {role}
    </Badge>
  )
}
