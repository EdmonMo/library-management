"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { returnRentalAction } from "@/actions/rentals"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { RentalResponse } from "@/types/types"

export default function ReturnDialog({
  rental,
  open,
  onOpenChange,
}: {
  rental: RentalResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReturn = async () => {
    if (!rental) return
    setLoading(true)
    const res = await returnRentalAction(rental.id, notes || undefined)
    setLoading(false)

    if (res.success) {
      toast.success(res.message ?? "تم إرجاع الكتاب بنجاح")
      onOpenChange(false)
      setNotes("")
      router.refresh()
    } else {
      toast.error(res.message ?? "حدث خطأ")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إرجاع كتاب</DialogTitle>
          <DialogDescription>
            قم بتأكيد إرجاع الكتاب المستعار
          </DialogDescription>
        </DialogHeader>

        {rental && (
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted p-3">
              <div className="mb-1 text-sm text-muted-foreground">الطالب</div>
              <div className="font-medium">{rental.student.name}</div>
              <div className="text-sm text-muted-foreground">
                {rental.student.studentId ?? "—"}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="mb-1 text-sm text-muted-foreground">الكتاب</div>
              <div className="font-medium">
                {rental.bookCopy.book.title}
                <span className="mr-1 text-sm text-muted-foreground">
                  (نسخة #{rental.bookCopy.copyNumber})
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Textarea
                id="notes"
                placeholder="حالة الكتاب عند الإرجاء..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button onClick={handleReturn} disabled={loading}>
            {loading ? "جاري..." : "تأكيد الإرجاع"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
