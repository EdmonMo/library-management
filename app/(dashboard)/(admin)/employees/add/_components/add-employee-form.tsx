"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Building2,
  Lock,
  Mail,
  Save,
  User,
  UserPlus,
  Phone,
  X,
} from "lucide-react"
import { createUserSchema, type CreateUserFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createUserAction } from "@/actions/users"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Controller } from "react-hook-form"

export default function AddEmployeeForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
      department: "",
      phone: "",
    },
  })

  const onSubmit = async (data: CreateUserFormData) => {
    const result = await createUserAction(data)

    if (result.success) {
      toast.success("تم إضافة الموظف بنجاح")
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
            <UserPlus className="h-5 w-5" />
            معلومات الموظف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="أدخل الاسم الكامل"
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
              <Label htmlFor="email">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@library.com"
                  className="pr-10"
                  {...register("email")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                كلمة المرور <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="8 أحرف على الأقل"
                  className="pr-10"
                  {...register("password")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                الصلاحية <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصلاحية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">موظف</SelectItem>
                      <SelectItem value="ADMIN">مدير</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">القسم</Label>
              <div className="relative">
                <Input
                  id="department"
                  type="text"
                  placeholder="مثال: تقنية المعلومات"
                  className="pr-10"
                  {...register("department")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              {errors.department && (
                <p className="text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="text"
                  placeholder="05XXXXXXXX"
                  className="pr-10"
                  {...register("phone")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                  <Phone className="h-4 w-4" />
                </div>
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
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
          {isSubmitting ? "جارٍ الحفظ..." : "حفظ الموظف"}
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
