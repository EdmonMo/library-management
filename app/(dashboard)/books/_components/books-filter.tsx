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

export default function BooksFilter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
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
                placeholder="عنوان، مؤلف، أو رقم..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">التصنيف</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="كل التصنيفات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل التصنيفات</SelectItem>
                <SelectItem value="تكنولوجيا">تكنولوجيا</SelectItem>
                <SelectItem value="تاريخ">تاريخ</SelectItem>
                <SelectItem value="أدب">أدب</SelectItem>
                <SelectItem value="علوم">علوم</SelectItem>
                <SelectItem value="تطوير ذات">تطوير ذات</SelectItem>
                <SelectItem value="فلسفة">فلسفة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">
              حالة الكتاب
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="متاح">متاح</SelectItem>
                <SelectItem value="معار">معار</SelectItem>
                <SelectItem value="صيانة">صيانة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
