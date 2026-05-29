import { Suspense } from "react"
import { PenLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AuthorsFilter from "./_components/authors-filter"
import Link from "next/link"
import { getAuthorsAction } from "@/actions/authors"
import AuthorsTable from "./_components/authors-table"

export default async function AuthorsPage(props: {
  searchParams: Promise<{ name?: string }>
}) {
  const searchParams = await props.searchParams
  const { data: authors, success } = await getAuthorsAction({
    page: 1,
    limit: 20,
    name: searchParams.name || undefined,
  })

  if (!success) {
    return <div className="text-center text-red-500">Error loading authors</div>
  }
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إدارة المؤلفين
        </h1>
        <p className="text-muted-foreground">
          إدارة بيانات المؤلفين والمؤلفات المرتبطة بهم
        </p>
      </div>

      <Button className="mb-8 bg-blue-600 shadow-sm hover:bg-blue-700">
        <Link href="/authors/add" className="flex items-center gap-2">
          <PenLine className="ml-2 h-4 w-4" />
          إضافة مؤلف جديد
        </Link>
      </Button>

      <Suspense
        fallback={
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="mb-2 block h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-10 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        }
      >
        <AuthorsFilter />
      </Suspense>
      <AuthorsTable initialData={authors} />
    </>
  )
}
