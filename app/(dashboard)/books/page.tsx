import { auth } from "@/lib/auth"
import StudentBooksPage from "./_components/student-books-page"
import AdminBooksPage from "./_components/admin-books-page"

export default async function BooksPage(props: {
  searchParams: Promise<{ search?: string; categoryId?: string; status?: string }>
}) {
  const { user } = await auth()
  const searchParams = await props.searchParams

  if (user.role === "STUDENT")
    return <StudentBooksPage searchParams={searchParams} />
  return <AdminBooksPage searchParams={searchParams} />
}
