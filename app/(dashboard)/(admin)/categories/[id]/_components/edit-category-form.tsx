"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Tags, X } from "lucide-react"
import {
  createCategorySchema,
  type CreateCategoryFormData,
} from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { updateCategoryAction } from "@/actions/categories"
import { toast } from "sonner"
import { CategoryResponse } from "@/types/types"

export default function EditCategoryForm({
  category,
}: {
  category: CategoryResponse & { _count: { books: number } }
}) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description ?? "",
    },
  })

  const onSubmit = async (data: CreateCategoryFormData) => {
    const result = await updateCategoryAction(category.id, data)

    if (result.success) {
      toast.success("تم تحديث بيانات التصنيف بنجاح")
      router.push("/categories")
      router.refresh()
    } else {
      toast.error(result.message || "حدث خطأ")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            معلومات التصنيف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                اسم التصنيف <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="مثال: روايات"
                  className="pr-10"
                  {...register("name")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <Tags className="h-4 w-4" />
                </div>
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                placeholder="اكتب وصفاً مختصراً عن هذا التصنيف..."
                {...register("description")}
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            عدد الكتب المرتبطة بهذا التصنيف: {category._count.books}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
        <Button
          className="flex-1 gap-2 shadow-lg shadow-blue-500/30 sm:flex-none"
          type="submit"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2 sm:flex-none"
          onClick={() => router.push("/categories")}
        >
          <X className="h-4 w-4" />
          إلغاء الأمر
        </Button>
      </div>
    </form>
  )
}
