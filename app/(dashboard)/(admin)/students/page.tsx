import { getUsersAction } from "@/actions/users"
import StudentsFilter from "./_components/students-filter"
import StudentsTable from "./_components/students-table"

export default async function MembersPage() {
  const { data: users, success } = await getUsersAction({
    page: 1,
    limit: 20,
    roles: ["STUDENT"],
  })

  if (success)
    return (
      <>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            إدارة الأعضاء
          </h1>
          <p className="text-muted-foreground">
            إدارة حسابات الأعضاء وتتبع استعاراتهم
          </p>
        </div>

        <StudentsFilter />
        <StudentsTable initialData={users} />
      </>
    )
}
