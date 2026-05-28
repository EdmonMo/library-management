import { getUsersAction } from "@/actions/users"
import ListPageShell from "@/components/list-page-shell"
import { studentColumns } from "./_components/columns"

export default async function MembersPage() {
  const { data: users, success } = await getUsersAction({
    page: 1,
    limit: 20,
    roles: ["STUDENT"],
  })

  if (success) {
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

        <ListPageShell
          title="قائمة الطلاب"
          description={`إجمالي ${users.total} طالب`}
          data={users.users}
          columns={studentColumns}
          searchPlaceholder="اسم، بريد، أو رقم..."
        />
      </>
    )
  }
}
