import { Book } from "lucide-react"
import { getUserByIdAction } from "@/actions/users"
import StatCard from "../stat-card"
import RecommendedBooks from "./recommended-books"
import MembershipStaus from "./membership-status"

export default async function StudentDashboard({ userId }: { userId: string }) {
  const { data: user, success } = await getUserByIdAction(userId)

  if (!success) return <p>NOT FOUND</p>

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600">
          Unauthorized
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          مرحباً بك، {user.name} 👋
        </h1>
        <p className="text-muted-foreground">
          هذه هي لوحة تحكمك الشخصية. يمكنك تصفح واستعارة الكتب الجديدة.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="الكتب المستعارة" value={0} icon={Book} color="blue" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecommendedBooks />
      </div>

      <MembershipStaus user={user} />
    </>
  )
}
