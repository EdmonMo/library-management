import { getBooksAction } from "@/actions/books"
import BookList from "./BookList"

export default async function BooksPage() {
  const initialBooks = await getBooksAction({
    page: 1,
    limit: 20,
  })

  if (!initialBooks.success) {
    console.log(initialBooks.error)

    return <h1>ERROR!</h1>
  }

  return (
    <main>
      <h1>قائمة الكتب</h1>
      <BookList initialBooks={initialBooks} />
    </main>
  )
}
