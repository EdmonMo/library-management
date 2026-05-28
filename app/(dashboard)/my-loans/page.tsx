import MyLoansList from "./_components/my-loans-list"

export default function MyLoansPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          استعاراتي السابقة
        </h1>
        <p className="text-muted-foreground">
          تصفح مجموعة الكتب التي استعرتها من المكتبة
        </p>
      </div>
      <MyLoansList />
    </>
  )
}
