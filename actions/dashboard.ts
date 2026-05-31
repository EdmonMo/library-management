"use server"

import { prisma } from "@/lib/prisma"

const chartColors = [
  "bg-orange-500",
  "bg-teal-500",
  "bg-slate-700",
  "bg-yellow-500",
  "bg-orange-400",
]

export type DashboardChartsData = {
  booksDist: {
    name: string
    count: number
    percentage: number
    color: string
  }[]
  activity: {
    day: string
    borrowed: number
    returned: number
  }[]
}

export async function getDashboardChartsAction(): Promise<DashboardChartsData> {
  const [categories, totalBooks, recentRentals] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { books: true } } },
      orderBy: { books: { _count: "desc" } },
      take: 5,
    }),
    prisma.book.count(),
    prisma.rental.findMany({
      where: {
        rentedAt: {
          gte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
      },
      select: { rentedAt: true, returnedAt: true },
    }),
  ])

  const booksDist = categories.map((c, i) => ({
    name: c.name,
    count: c._count.books,
    percentage:
      totalBooks > 0
        ? Math.round((c._count.books / totalBooks) * 100)
        : 0,
    color: chartColors[i % chartColors.length],
  }))

  const activityMap = new Map<
    string,
    { day: string; borrowed: number; returned: number }
  >()
  for (let i = 0; i < 15; i++) {
    const d = new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000)
    const key = String(d.getDate()).padStart(2, "0")
    activityMap.set(key, { day: key, borrowed: 0, returned: 0 })
  }
  for (const r of recentRentals) {
    const key = String(r.rentedAt.getDate()).padStart(2, "0")
    const entry = activityMap.get(key)
    if (entry) entry.borrowed++
    if (r.returnedAt) {
      const retKey = String(r.returnedAt.getDate()).padStart(2, "0")
      const retEntry = activityMap.get(retKey)
      if (retEntry) retEntry.returned++
    }
  }

  return { booksDist, activity: Array.from(activityMap.values()) }
}
