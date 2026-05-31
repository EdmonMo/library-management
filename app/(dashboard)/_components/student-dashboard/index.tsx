import { Book } from "lucide-react"
import { getUserByIdAction } from "@/actions/users"
import { prisma } from "@/lib/prisma"
import StatCard from "../stat-card"
import RecommendedBooks from "./recommended-books"
import MembershipStaus from "./membership-status"

export default async function StudentDashboard({ userId }: { userId: string }) {
  const [userResult, activeRentals] = await Promise.all([
    getUserByIdAction(userId),
    prisma.rental.count({
      where: { studentId: userId, status: "ACTIVE" },
    }),
  ])

  if (!userResult.success) return <p>NOT FOUND</p>
  const user = userResult.data

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

      <MembershipStaus user={user} />

      <div className="mt-8 flex items-start gap-6">
        <RecommendedBooks />
        <StatCard
          title="الكتب المستعارة"
          value={activeRentals}
          icon={Book}
          color="blue"
        />
      </div>
    </>
  )
}
