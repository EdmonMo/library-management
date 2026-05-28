import { BookDetailedResponse } from "@/types/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import BookAvailablityBadge from "./book-availability-badge"
import {
  ArrowRight,
  Book,
  Hash,
  Library,
  Building2,
  Calendar,
} from "lucide-react"
import Link from "next/link"

const statusConfig: Record<string, { label: string; className: string }> = {
  AVAILABLE: {
    label: "متاح",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  RENTED: {
    label: "معار",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  DAMAGED: {
    label: "تالف",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  LOST: {
    label: "مفقود",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
}

export default function ViewBook({ book }: { book: BookDetailedResponse }) {
  const availableCopies = book.copies.filter(
    (c) => c.status === "AVAILABLE"
  ).length

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 bg-linear-to-br from-blue-400 to-blue-600">
              <AvatarFallback className="bg-transparent text-xl text-white">
                {book.title[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{book.title}</CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {book.authors.map((author) => (
                  <Badge
                    key={author.id}
                    variant="secondary"
                    className="font-normal"
                  >
                    {author.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                ISBN
              </p>
              <p className="font-mono text-sm font-medium">{book.isbn}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                الناشر
              </p>
              <p className="text-sm font-medium">{book.publisher ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                سنة النشر
              </p>
              <p className="text-sm font-medium">{book.publishedYear ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Book className="h-3.5 w-3.5" />
                النسخ المتاحة
              </p>
              <BookAvailablityBadge availableCopies={availableCopies} />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              التصنيفات
            </h3>
            <div className="flex flex-wrap gap-2">
              {book.categories.map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="font-normal"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              الوصف
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {book.description || "لا يوجد وصف"}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              النسخ ({book.copies.length})
            </h3>
            <div className="space-y-2">
              {book.copies.map((copy) => {
                const cfg = statusConfig[copy.status]
                return (
                  <div
                    key={copy.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <Library className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        نسخة #{copy.copyNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {copy.location && (
                        <span className="text-xs text-muted-foreground">
                          {copy.location}
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className={`${cfg.className} gap-1.5 font-medium`}
                      >
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <Link href="/books">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            عودة إلى الكتب
          </Button>
        </Link>
      </div>
    </div>
  )
}
