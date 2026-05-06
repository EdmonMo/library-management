import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import EmployeesFilter from "./components/employees-filter"
import EmployeesTable from "./employees-table"
import Link from "next/link"
import { getUsersAction } from "@/actions/users"

export default async function EmployeesPage() {
  const { data: users, success } = await getUsersAction({
    page: 1,
    limit: 20,
    roles: ["EMPLOYEE", "ADMIN"],
  })

  if (!success) {
    return (
      <div className="text-center text-red-500">Error loading employees</div>
    )
  }
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          إدارة الموظفين
        </h1>
        <p className="text-muted-foreground">
          إدارة حسابات الموظفين وصلاحياتهم في النظام
        </p>
      </div>

      <Button className="mb-8 bg-blue-600 shadow-sm hover:bg-blue-700">
        <Link href="add-employee" className="flex items-center gap-2">
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة موظف جديد
        </Link>
      </Button>

      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة موظف جديد</DialogTitle>
            <DialogDescription>
              أدخل معلومات الموظف الجديد لإضافته إلى النظام
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                placeholder="أدخل الاسم الكامل"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@library.com"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                placeholder="05XXXXXXXX"
                value={newEmployee.phone}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, phone: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الوظيفة</Label>
                <Select
                  value={newEmployee.role}
                  onValueChange={(value) =>
                    setNewEmployee({ ...newEmployee, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الوظيفة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مدير النظام">مدير النظام</SelectItem>
                    <SelectItem value="أمين مكتبة">أمين مكتبة</SelectItem>
                    <SelectItem value="مسؤول إعارة">مسؤول إعارة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الحالة</Label>
                <Select
                  value={newEmployee.status}
                  onValueChange={(value) =>
                    setNewEmployee({ ...newEmployee, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="إجازة">إجازة</SelectItem>
                    <SelectItem value="غير نشط">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddEmployee}
            >
              حفظ الموظف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>بيانات الموظف</DialogTitle>
            <DialogDescription>معلومات تفصيلية عن الموظف</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <Avatar className="h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600">
                  <AvatarFallback className="bg-transparent text-xl text-white">
                    {selectedEmployee.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedEmployee.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedEmployee.role}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">رقم الموظف</Label>
                  <p className="font-medium">{selectedEmployee.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">الحالة</Label>
                  <div className="mt-1">
                    <EmployeeStatusBadge status={selectedEmployee.status} />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    البريد الإلكتروني
                  </Label>
                  <p className="flex items-center gap-2 font-medium">
                    <Mail className="h-4 w-4" />
                    {selectedEmployee.email}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">رقم الهاتف</Label>
                  <p className="flex items-center gap-2 font-medium">
                    <Phone className="h-4 w-4" />
                    {selectedEmployee.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    تاريخ الانضمام
                  </Label>
                  <p className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4" />
                    {selectedEmployee.joinDate}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              إغلاق
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              تعديل البيانات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <EmployeesFilter />
      <EmployeesTable initialData={users} />
    </>
  )
}
