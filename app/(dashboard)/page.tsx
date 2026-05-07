import { auth } from "@/lib/auth"
import StudentDashboard from "./_components/student-dashboard"
import AdminDashboard from "./_components/admin-dashboard"

/**
 * Dashboard Component - الصفحة الرئيسية للوحة التحكم
 * تعرض نظرة عامة على نشاط المكتبة مع إحصائيات ومخططات بيانية وجدول الطلبات
 * @returns {JSX.Element} - لوحة التحكم الكاملة
 */
export default async function Dashboard() {
  const { user } = await auth()
  if (!user) return <h1>Unauthenticated</h1>

  if (user.role !== "STUDENT") return <AdminDashboard />
  return <StudentDashboard userId={user.id} />
}
