import { getBooksAction } from "@/actions/books"
import BooksFilter from "../components/books-filter"
import StudentBooksTable from "./student-books-list"

export default async function StudentBooksPage() {
  const initialBooks = await getBooksAction({
    page: 1,
    limit: 20,
  })

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">تصفح الكتب</h1>
        <p className="text-muted-foreground">
          تصفح مجموعة الكتب المتوفرة في المكتبة
        </p>
      </div>

      <BooksFilter />
      <StudentBooksTable initialData={initialBooks.data} />
    </>
  )
}
