import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { MyLoansColumns } from "./columns"

export default function MyLoansList() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>قائمة الكتب</CardTitle>
        <CardDescription>إجمالي {} كتاب</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={MyLoansColumns} data={[]} />
      </CardContent>
    </Card>
  )
}
