import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { getUserByIdAction } from "@/actions/users"
import InfoForm from "./_components/info-form"
import ProfileStats from "./_components/stats"
import ChangePasswordForm from "./_components/change-password-form"

export default async function StudentProfilePage() {
  const { user: currentUser } = await auth()
  const { data: user } = await getUserByIdAction(currentUser?.id)

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600">
          لا تملك الصلاحية للوصول لهذه الصفحة
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">الملف الشخصي</h1>
        <p className="text-muted-foreground">عرض وتعديل معلومات حسابك الشخصي</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <InfoForm user={user} />
          <ChangePasswordForm />
        </div>

        <div className="space-y-6">
          <ProfileStats user={user} />

          <Card>
            <CardHeader>
              <CardTitle>معلومات إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-muted-foreground">الحد الأقصى للاستعارة</p>
                <p className="font-medium">3 كتب</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">مدة الاستعارة</p>
                <p className="font-medium">30 يوماً</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">غرامة التأخير</p>
                <p className="font-medium">5000 ليرة سورية لكل يوم تأخير</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
