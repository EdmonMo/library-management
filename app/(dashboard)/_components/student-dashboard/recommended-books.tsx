import { getBooksAction } from "@/actions/books"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
export default async function RecommendedBooks() {
  const {
    data: { books },
    success,
  } = await getBooksAction({ page: 1, limit: 5 })

  if (!success) return
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>كتب مقترحة لك</CardTitle>
            <CardDescription>أكثر الكتب طلباً والمتاحة حالياً</CardDescription>
          </div>
          <Link href="/books">
            <Button variant="ghost" size="sm" className="gap-1">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
            >
              <div>
                <p className="font-medium text-gray-900">{book.title}</p>
                <p className="text-sm text-muted-foreground">
                  {book.publisher}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {book.categories[0].name}
                </Badge>
                <Link href={`/dashboard/books/${book.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    استعارة
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
