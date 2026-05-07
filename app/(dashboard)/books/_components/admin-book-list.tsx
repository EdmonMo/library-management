import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BookListResponse } from "@/types/types"
import { ChevronLeft, Edit, Ellipsis, Trash2 } from "lucide-react"
import Link from "next/link"
import BookAvailablityBadge from "./book-availability-badge"

export default function BooksTable({
  initialData,
}: {
  initialData: BookListResponse
}) {
  const filteredBooks = []
  const booksData = []
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الكتب</CardTitle>
        <CardDescription>
          عرض كتاب من إجمالي {initialData.books?.length} كتاب
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="hidden text-right md:table-cell">
                  الناشر
                </TableHead>
                <TableHead className="hidden text-right lg:table-cell">
                  التصنيف
                </TableHead>
                <TableHead className="text-right">عدد النسخ المتاحة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.books?.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div className="font-medium">{book.title}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground md:table-cell">
                    {book.publisher}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="secondary" className="font-normal">
                      {book.categories[0].name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <BookAvailablityBadge
                      availableCopies={book.availableCopies}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="outline">
                            <Ellipsis />
                          </Button>
                        }
                      />

                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link
                            href={"/books/" + book.id}
                            className="flex items-center gap-2"
                          >
                            <Edit />
                            تعديل
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 hover:text-red-600">
                          <Trash2 />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between px-6 pt-4 pb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="ml-1 h-4 w-4" />
            السابق
          </Button>
          <Button variant="outline" size="sm">
            التالي
            <ChevronLeft className="mr-1 h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          عرض{" "}
          <span className="font-medium text-foreground">
            1-{filteredBooks.length}
          </span>{" "}
          من أصل{" "}
          <span className="font-medium text-foreground">
            {booksData.length}
          </span>{" "}
          كتاب
        </p>
      </CardFooter>
    </Card>
  )
}
