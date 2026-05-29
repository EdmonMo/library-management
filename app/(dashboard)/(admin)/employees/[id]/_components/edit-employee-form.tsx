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
import { Save, User, X } from "lucide-react"
import {
  updateUserSchema,
  type UpdateUserFormData,
} from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { updateUserAction } from "@/actions/users"
import { toast } from "sonner"
import { UserResponse } from "@/types/types"

export default function EditEmployeeForm({
  employee,
}: {
  employee: UserResponse
}) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      department: employee.department ?? "",
      phone: employee.phone ?? "",
    },
  })

  const onSubmit = async (data: UpdateUserFormData) => {
    const result = await updateUserAction(employee.id, data)

    if (result.success) {
      toast.success("تم تحديث بيانات الموظف بنجاح")
      router.push("/employees")
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
            <User className="h-5 w-5" />
            معلومات الموظف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="أدخل الاسم الكامل"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@library.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">القسم</Label>
              <Input
                id="department"
                type="text"
                placeholder="القسم الذي يعمل به"
                {...register("department")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="text"
                placeholder="05XXXXXXXX"
                {...register("phone")}
              />
            </div>
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
          onClick={() => router.push("/employees")}
        >
          <X className="h-4 w-4" />
          إلغاء الأمر
        </Button>
      </div>
    </form>
  )
}
