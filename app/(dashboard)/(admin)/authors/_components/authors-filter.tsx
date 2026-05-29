"use client"

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"

export default function AuthorsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("name") || ""
  const [searchInput, setSearchInput] = useState(currentSearch)

  const updateParams = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) {
      params.delete("name")
    } else {
      params.set("name", value)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const debouncedUpdate = useDebouncedCallback(updateParams, 300)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    debouncedUpdate(value)
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="mb-2 block text-sm font-medium">البحث</Label>
            <div className="relative">
              <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="اسم المؤلف..."
                className="pr-9"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
