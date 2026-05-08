"use client"
import { changePasswordAction } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangePasswordFormData, changePasswordSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: undefined,
      newPassword: undefined,
    },
  })

  async function onSubmit(data: ChangePasswordFormData) {
    const { success, message } = await changePasswordAction(data)
    if (success) {
      toast.success(message)
    } else {
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>تغيير كلمة السر</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label className="mb-2">كلمة السر الحالية</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2">كلمة السر الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="sm"
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <Save className="ml-2 h-4 w-4" />
            حفظ
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
