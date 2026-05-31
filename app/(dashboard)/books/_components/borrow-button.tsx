"use client"

import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { createRentalAction } from "@/actions/rentals"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function BorrowButton({ bookCopyId }: { bookCopyId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBorrow = async () => {
    setLoading(true)
    const res = await createRentalAction(bookCopyId)
    setLoading(false)

    if (res.success) {
      toast.success(res.message ?? "تمت الاستعارة بنجاح")
      router.refresh()
    } else {
      toast.error(res.message ?? "حدث خطأ")
    }
  }

  return (
    <Button
      size="sm"
      className="gap-1.5"
      onClick={handleBorrow}
      disabled={loading}
    >
      <BookOpen className="h-3.5 w-3.5" />
      {loading ? "جاري..." : "استعارة"}
    </Button>
  )
}
