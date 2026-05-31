import {
  Clock,
  AlertCircle,
  Plus,
  CheckCircle2,
  BookMarked,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { getBooksAction } from "@/actions/books"
import { getCategoriesAction } from "@/actions/categories"
import { prisma } from "@/lib/prisma"
import BooksTable from "./admin-books-list"
import BooksFilter from "./books-filter"
import { Suspense } from "react"

export default async function AdminBooksPage({
  searchParams,
}: {
  searchParams: { search?: string; categoryId?: string; status?: string }
}) {
  const [initialBooks, { data: categoriesData }, copyStats] = await Promise.all([
    getBooksAction({
      page: 1,
      limit: 20,
      search: searchParams.search || undefined,
      categoryId:
        searchParams.categoryId && searchParams.categoryId !== "all"
          ? searchParams.categoryId
          : undefined,
      status:
        searchParams.status === "available" || searchParams.status === "rented"
          ? searchParams.status
          : undefined,
    }),
    getCategoriesAction({ page: 1, limit: 50 }),
    prisma.bookCopy.groupBy({
      by: ["status"],
      _count: true,
    }),
  ])

  const totalBooks = await prisma.book.count()

  const rentedCount = copyStats.find((s) => s.status === "RENTED")?._count ?? 0
  const availableCount = copyStats.find((s) => s.status === "AVAILABLE")?._count ?? 0
  const maintenanceCount =
    (copyStats.find((s) => s.status === "DAMAGED")?._count ?? 0) +
    (copyStats.find((s) => s.status === "LOST")?._count ?? 0)

  const booksStats = [
    {
      label: "تحت الصيانة",
      value: maintenanceCount.toString(),
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "كتب معارة حالياً",
      value: rentedCount.toString(),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "النسخ المتاحة",
      value: availableCount.toString(),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "إجمالي الكتب",
      value: totalBooks.toString(),
      icon: BookMarked,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ]

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">إدارة الكتب</h1>
        <p className="text-muted-foreground">
          تصفح وإدارة مجموعة الكتب المتوفرة في المكتبة
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <Button>
          <Link href="/books/add" className="flex items-center">
            <Plus className="ml-2 h-4 w-4" />
            إضافة كتاب جديد
          </Link>
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {booksStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="transition-shadow duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Suspense
        fallback={
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-2 block h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                </div>
                <div>
                  <div className="mb-2 block h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                </div>
                <div>
                  <div className="mb-2 block h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        }
      >
        <BooksFilter categories={categoriesData?.categories ?? []} />
      </Suspense>
      <BooksTable initialData={initialBooks.data} />
    </>
  )
}
