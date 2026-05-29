"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function RequestsFilter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
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
                placeholder="عضو، كتاب، أو رقم..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">نوع الطلب</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="كل الأنواع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                <SelectItem value="استعارة">استعارة</SelectItem>
                <SelectItem value="إرجاع">إرجاع</SelectItem>
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
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
                <SelectItem value="متأخر">متأخر</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
