import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUsersAction } from "@/actions/users"
import StudentsTable from "./students-table"
import StudentsFilter from "./components/students-filter"

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

        <div className="mb-8 flex flex-wrap gap-4">
          <Button className="bg-blue-600 shadow-sm hover:bg-blue-700">
            <Link href="add" className="flex items-center gap-2">
              <UserPlus className="ml-2 h-4 w-4" />
              إضافة عضو جديد
            </Link>
          </Button>
        </div>

        <StudentsFilter />

        <StudentsTable initialData={users} />
      </>
    )
}
