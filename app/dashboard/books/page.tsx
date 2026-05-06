import { auth } from "@/lib/auth"
import AdminBooksPage from "./(admin)/admin-books-page"
import StudentBooksPage from "./(student)/student-books-page"

export default async function BooksPage() {
  const { user } = await auth()

  if (user.role === "STUDENT") return <StudentBooksPage />
  return <AdminBooksPage />
}
