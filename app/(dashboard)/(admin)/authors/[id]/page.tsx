import { getAuthorByIdAction } from "@/actions/authors"
import EditAuthorForm from "./_components/edit-author-form"

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: author } = await getAuthorByIdAction(id)

  if (!author) {
    return <div className="text-center text-red-500">المؤلف غير موجود</div>
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          تعديل بيانات المؤلف
        </h1>
        <p className="text-muted-foreground">
          تحديث معلومات المؤلف: {author.name}
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <EditAuthorForm author={author} />
      </div>
    </>
  )
}
