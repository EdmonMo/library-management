"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { RentalListResponse, RentalResponse } from "@/types/types"
import { getRentalColumns } from "./columns"
import ReturnDialog from "./return-dialog"

export default function RentalsTable({
  initialData,
}: {
  initialData: RentalListResponse
}) {
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<RentalResponse | null>(
    null
  )

  const handleReturn = (rental: RentalResponse) => {
    setSelectedRental(rental)
    setReturnDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>قائمة الاستعارات</CardTitle>
          <CardDescription>
            إجمالي {initialData.total} استعارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={getRentalColumns(handleReturn)}
            data={initialData.rentals}
          />
        </CardContent>
      </Card>

      <ReturnDialog
        rental={selectedRental}
        open={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
      />
    </>
  )
}
