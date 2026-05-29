"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"

export default function EmployeesFilter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="mb-2 block text-sm font-medium">البحث</Label>
            <div className="relative">
              <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="اسم، بريد، أو رقم..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">الوظيفة</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="كل الوظائف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الوظائف</SelectItem>
                <SelectItem value="مدير النظام">مدير النظام</SelectItem>
                <SelectItem value="أمين مكتبة">أمين مكتبة</SelectItem>
                <SelectItem value="مسؤول إعارة">مسؤول إعارة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">الحالة</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="نشط">نشط</SelectItem>
                <SelectItem value="إجازة">إجازة</SelectItem>
                <SelectItem value="غير نشط">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
