"use client"

import React, { useState, useEffect } from "react"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Book,
  Edit,
  Save,
  X,
} from "lucide-react"

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Toaster, toast } from "sonner"

export default function StudentProfilePage() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [stats, setStats] = useState({
    totalRequests: 0,
    borrowedBooks: 0,
    returnedBooks: 0,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
      })

      const userRequests = []
      setStats({
        totalRequests: userRequests.length,
        borrowedBooks: userRequests.filter(
          (r) => r.type === "استعارة" && r.status === "مكتمل"
        ).length,
        returnedBooks: userRequests.filter(
          (r) => r.type === "إرجاع" && r.status === "مكتمل"
        ).length,
      })
    }
  }, [])

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsEditing(false)
      toast.success("تم تحديث الملف الشخصي بنجاح")
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      })
      setIsEditing(false)
    }
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const userInitial = user.name.charAt(0)
  const membershipColors = {
    ذهبي: "bg-amber-100 text-amber-700 border-amber-200",
    فضي: "bg-gray-100 text-gray-700 border-gray-200",
    أساسي: "bg-blue-100 text-blue-700 border-blue-200",
  }

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">الملف الشخصي</h1>
        <p className="text-muted-foreground">عرض وتعديل معلومات حسابك الشخصي</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>المعلومات الشخصية</CardTitle>
                  <CardDescription>بيانات حسابك في المكتبة</CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="ml-2 h-4 w-4" />
                    تعديل
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="ml-2 h-4 w-4" />
                      إلغاء
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSave}
                    >
                      <Save className="ml-2 h-4 w-4" />
                      حفظ
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <Avatar className="h-20 w-20 bg-linear-to-br from-blue-400 to-blue-600">
                  <AvatarFallback className="bg-transparent text-2xl text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={membershipColors[user.membershipType]}
                    >
                      <Award className="ml-1 h-3 w-3" />
                      {user.membershipType === "ذهبي"
                        ? "عضوية ذهبية"
                        : user.membershipType === "فضي"
                          ? "عضوية فضية"
                          : "عضوية أساسية"}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-100">
                      رقم العضوية: {user.id}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      الاسم الكامل
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{user.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      البريد الإلكتروني
                    </Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      رقم الهاتف
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="لم يتم الإضافة"
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">
                        {user.phone || "لم يتم الإضافة"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">
                      تاريخ الانضمام
                    </Label>
                    <p className="font-medium">{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>نشاطي في المكتبة</CardTitle>
              <CardDescription>إحصائيات استخدام المكتبة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">إجمالي الطلبات</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.totalRequests}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">الكتب المستعارة</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.borrowedBooks}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">الكتب المعادة</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.returnedBooks}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>معلومات إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-muted-foreground">الحد الأقصى للاستعارة</p>
                <p className="font-medium">
                  {user.membershipType === "ذهبي"
                    ? "5 كتب"
                    : user.membershipType === "فضي"
                      ? "3 كتب"
                      : "كتابين"}
                </p>
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
