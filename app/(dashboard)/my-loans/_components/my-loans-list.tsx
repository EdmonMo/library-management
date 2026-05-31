import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { MyLoansColumns } from "./columns"
import { getMyRentalsAction } from "@/actions/rentals"

export default async function MyLoansList() {
  const { data } = await getMyRentalsAction({ page: 1, limit: 50 })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الكتب</CardTitle>
        <CardDescription>إجمالي {data?.total ?? 0} استعارة</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={MyLoansColumns} data={data?.rentals ?? []} />
      </CardContent>
    </Card>
  )
}
