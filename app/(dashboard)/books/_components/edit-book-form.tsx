"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Book,
  Building2,
  Camera,
  FileText,
  Globe,
  Hash,
  Info,
  Loader2,
  Save,
  Tag,
  User,
  X,
} from "lucide-react"
import { addBookSchema, type AddBookFormData } from "@/lib/validations"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BookDetailedResponse, CategoryResponse } from "@/types/types"
import { DatePicker } from "@/components/ui/date-picker"

export default function EditBookForm({
  book,
  allCategories,
}: {
  book: BookDetailedResponse
  allCategories: CategoryResponse[]
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddBookFormData>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: book.title,
      categories: book.categories.map((cat) => cat.id),
      isbn: book.isbn,
      publisher: book.publisher,
      description: book.description,
      coverImage: book.coverImage,
      numberOfCopies: book._count.copies,
      publishedYear: new Date(book.publishedYear.toString()),
      authors: book.authors.map((author) => author.name),
    },
  })

  const onSubmit = (data: AddBookFormData) => {
    console.log("Form submitted:", data)
    // Handle form submission here
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("Validation errors:", errors)
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                عنوان الكتاب <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  type="text"
                  placeholder="مثال: مقدمة ابن خلدون"
                  className="pr-10"
                  {...register("title")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Authors */}
            <div className="space-y-2">
              <Label htmlFor="authors">اسم المؤلف</Label>
              <div className="relative">
                <Input
                  id="authors"
                  type="text"
                  placeholder="مثال: د. طه حسين"
                  className="pr-10"
                  // authors is string[] in schema — this binds index 0 as a simple text input.
                  // Replace with a multi-value input component if you need multiple authors.
                  {...register("authors.0")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
              </div>
              {errors.authors && (
                <p className="text-sm text-red-500">{errors.authors.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category">
                تصنيف الكتاب <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => {
                    const selectedValues = field.value ?? []

                    return (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {!allCategories ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  جارٍ التحميل...
                                </span>
                              ) : false ? (
                                <span className="text-red-400">{false}</span>
                              ) : selectedValues.length > 0 ? (
                                `${selectedValues.length} تصنيفات محددة`
                              ) : (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <Tag className="h-4 w-4" />
                                  اختر التصنيفات
                                </div>
                              )}
                            </Button>
                          }
                        />

                        <DropdownMenuContent className="w-56" align="start">
                          {allCategories.map((cat) => (
                            <DropdownMenuCheckboxItem
                              key={cat.id}
                              checked={selectedValues.includes(cat.id)}
                              onCheckedChange={(checked) => {
                                const updated = checked
                                  ? [...selectedValues, cat.id]
                                  : selectedValues.filter((v) => v !== cat.id)
                                field.onChange(updated)
                              }}
                            >
                              {cat.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  }}
                />
              </div>
              {errors.categories && (
                <p className="text-sm text-red-500">
                  {errors.categories.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            تفاصيل النشر والمواصفات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* ISBN */}
            <div className="space-y-2">
              <Label htmlFor="isbn">
                الرقم الدولي المعياري (ISBN){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="isbn"
                  type="text"
                  placeholder="978-3-16-148410-0"
                  className="pr-10 font-mono"
                  {...register("isbn")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <Hash className="h-4 w-4" />
                </div>
              </div>
              {errors.isbn && (
                <p className="text-sm text-red-500">{errors.isbn.message}</p>
              )}
            </div>
            {/* Published Year */}
            <div className="space-y-2">
              <Label>تاريخ النشر</Label>
              <DatePicker
                name="publishedYear"
                control={control}
                placeholder="Pick a published date"
              />
            </div>

            {/* Number of Copies */}
            <div className="space-y-2">
              <Label htmlFor="numberOfCopies">
                عدد النسخ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numberOfCopies"
                type="number"
                min={1}
                {...register("numberOfCopies", { valueAsNumber: true })}
              />
              {errors.numberOfCopies && (
                <p className="text-sm text-red-500">
                  {errors.numberOfCopies.message}
                </p>
              )}
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <Label htmlFor="publisher">دار النشر</Label>
              <div className="relative">
                <Input
                  id="publisher"
                  type="text"
                  placeholder="مثال: دار المعارف"
                  className="pr-10"
                  {...register("publisher")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              {errors.publisher && (
                <p className="text-sm text-red-500">
                  {errors.publisher.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">وصف موجز عن الكتاب</Label>
            <Textarea
              id="description"
              placeholder="اكتب نبذة مختصرة عن محتوى الكتاب وأهميته..."
              {...register("description")}
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">رابط الصورة</Label>
            <div className="relative">
              <Input
                id="coverImage"
                type="url"
                placeholder="https://www.myimage.com/image.png"
                className="pr-10 font-mono"
                {...register("coverImage")}
              />
              <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            {errors.isbn && (
              <p className="text-sm text-red-500">{errors.isbn.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mt-0.5 text-amber-600">
          <Info className="h-5 w-5" />
        </div>
        <p className="text-sm text-amber-800">
          تأكد من مراجعة كافة البيانات قبل الضغط على "حفظ". سيتم إرسال إشعار
          للنظام بتوفر الكتاب في حال كان متاحاً للإعارة.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
        <Button
          className="flex-1 gap-2 shadow-lg shadow-blue-500/30 sm:flex-none"
          type="submit"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "جارٍ الحفظ..." : " حفظ الكتاب"}
        </Button>
        <Button variant="outline" className="flex-1 gap-2 sm:flex-none">
          <X className="h-4 w-4" />
          إلغاء الأمر
        </Button>
      </div>
    </form>
  )
}
