"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useCallback } from "react"

export default function RentalsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") ?? ""
  const currentStatus = searchParams.get("status") ?? "all"

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`/rentals?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="بحث عن طالب أو كتاب..."
          defaultValue={currentSearch}
          onChange={(e) => updateParams("search", e.target.value)}
          className="pr-9"
        />
      </div>
      <Select
        defaultValue={currentStatus}
        onValueChange={(value) => updateParams("status", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الحالات</SelectItem>
          <SelectItem value="ACTIVE">نشط</SelectItem>
          <SelectItem value="RETURNED">تمت الإعادة</SelectItem>
          <SelectItem value="OVERDUE">متأخر</SelectItem>
          <SelectItem value="LOST">مفقود</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
