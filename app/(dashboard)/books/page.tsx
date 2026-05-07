import { auth } from "@/lib/auth"
import StudentBooksPage from "./_components/student-books-page"
import AdminBooksPage from "./_components/admin-books-page"

export default async function BooksPage() {
  const { user } = await auth()

  if (user.role === "STUDENT") return <StudentBooksPage />
  return <AdminBooksPage />
}
