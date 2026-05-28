"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PenLine, Save, User, X } from "lucide-react"
import {
  createAuthorSchema,
  type CreateAuthorFormData,
} from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { updateAuthorAction } from "@/actions/authors"
import { toast } from "sonner"
import type { AuthorResponse } from "@/types/types"

export default function EditAuthorForm({
  author,
}: {
  author: AuthorResponse & { _count?: { books: number } }
}) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAuthorFormData>({
    resolver: zodResolver(createAuthorSchema),
    defaultValues: {
      name: author.name,
      biography: author.biography ?? "",
    },
  })

  const onSubmit = async (data: CreateAuthorFormData) => {
    const result = await updateAuthorAction(author.id, data)

    if (result.success) {
      toast.success("تم تحديث بيانات المؤلف بنجاح")
      router.push("/authors")
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
            <PenLine className="h-5 w-5" />
            معلومات المؤلف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                اسم المؤلف <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="مثال: طه حسين"
                  className="pr-10"
                  {...register("name")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">السيرة الذاتية</Label>
              <Textarea
                id="biography"
                placeholder="اكتب نبذة عن حياة المؤلف وأعماله..."
                {...register("biography")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
        <Button
          className="flex-1 gap-2 shadow-lg shadow-amber-500/30 sm:flex-none"
          type="submit"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2 sm:flex-none"
          onClick={() => router.push("/authors")}
        >
          <X className="h-4 w-4" />
          إلغاء الأمر
        </Button>
      </div>
    </form>
  )
}
