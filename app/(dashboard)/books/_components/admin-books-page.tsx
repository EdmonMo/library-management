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
import BooksTable from "./admin-book-list"
import BooksFilter from "./books-filter"

export default async function AdminBooksPage() {
  const initialBooks = await getBooksAction({
    page: 1,
    limit: 20,
  })

  const booksStats = [
    {
      label: "تحت الصيانة",
      value: "16",
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "كتب معارة حالياً",
      value: "412",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "الكتب المتاحة",
      value: "856",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "إجمالي الكتب",
      value: "1,284",
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

      <BooksFilter />
      <BooksTable initialData={initialBooks.data} />
    </>
  )
}
