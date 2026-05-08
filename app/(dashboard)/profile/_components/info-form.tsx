"use client"
import { updateProfileAction } from "@/actions/profile"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UsersRoleBadge from "@/components/users/users-role-badge"
import { UpdateProfileFormData, updateProfileSchema } from "@/lib/validations"
import { UserResponse } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building, Calendar, Edit, Phone, Save, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function InfoForm({ user }: { user: UserResponse }) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      department: user.department,
      phone: user.phone,
    },
  })

  async function onSubmit(data: UpdateProfileFormData) {
    const { success, message } = await updateProfileAction(data)
    if (success) {
      toast.success(message)
      router.refresh()
    } else {
      toast.error(message)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>بيانات حسابك في المكتبة</CardDescription>
            </div>
            {user.role === "STUDENT" &&
              (!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={isSubmitting}
                >
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing((prev) => !prev)}
                  >
                    <X className="ml-2 h-4 w-4" />
                    إلغاء
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="ml-2 h-4 w-4" />
                    حفظ
                  </Button>
                </div>
              ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 border-b pb-4">
            <Avatar className="h-20 w-20 bg-linear-to-br from-blue-400 to-blue-600">
              <AvatarFallback className="bg-transparent text-2xl text-white">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <UsersRoleBadge role={user.role} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <User className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground" htmlFor="name">
                  الاسم الكامل
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    className="mt-1"
                    type="text"
                    placeholder="اسمك الشخصي"
                    {...register("name")}
                  />
                ) : (
                  <p className="font-medium">{user.name}</p>
                )}
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <Label
                  className="text-xs text-muted-foreground"
                  htmlFor="department"
                >
                  الكلية
                </Label>
                {isEditing ? (
                  <Input
                    id="department"
                    className="mt-1"
                    type="text"
                    placeholder="الهندسة المعلوماتية"
                    {...register("department")}
                  />
                ) : (
                  <p className="font-medium">{user.department}</p>
                )}
                {errors.department && (
                  <p className="text-sm text-red-500">
                    {errors.department.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <Label
                  className="text-xs text-muted-foreground"
                  htmlFor="phone"
                >
                  رقم الهاتف
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    className="mt-1"
                    placeholder="09xxxxxxxx"
                    type="tel"
                    {...register("phone")}
                  />
                ) : (
                  <p className="font-medium">
                    {user.phone || "لم يتم الإضافة"}
                  </p>
                )}
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">
                  تاريخ الانضمام
                </Label>
                <p className="font-medium">{user.createdAt.toDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
