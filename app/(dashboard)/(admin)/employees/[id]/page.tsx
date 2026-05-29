import { getUserByIdAction } from "@/actions/users"
import EditEmployeeForm from "./_components/edit-employee-form"
import { notFound } from "next/navigation"

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: employee, success } = await getUserByIdAction(id)

  if (!success || !employee) {
    notFound()
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          تعديل بيانات الموظف
        </h1>
        <p className="text-muted-foreground">
          تحديث بيانات &laquo;{employee.name}&raquo;
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <EditEmployeeForm employee={employee} />
      </div>
    </>
  )
}
