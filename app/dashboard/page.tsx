"use client"

import { useState } from "react"
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Menu,
  MoreVertical,
  Clock,
  AlertCircle,
  Book,
  ChevronLeft,
  LogOut,
  Settings,
  FileText,
  Library,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster, toast } from "sonner"
import StatCard from "./components/StatCard"

/**
 * activityData - بيانات نشاط المكتبة خلال الشهر
 * تمثل عدد عمليات الاستعارة والإرجاع في أيام مختلفة من الشهر
 * يستخدم لرسم المخطط البياني (Area Chart)
 */
const activityData = [
  { day: "01", borrowed: 45, returned: 30 },
  { day: "05", borrowed: 52, returned: 38 },
  { day: "10", borrowed: 48, returned: 42 },
  { day: "15", borrowed: 65, returned: 48 },
  { day: "20", borrowed: 58, returned: 55 },
  { day: "25", borrowed: 82, returned: 62 },
  { day: "30", borrowed: 95, returned: 72 },
]

/**
 * booksDistribution - توزيع الكتب حسب التصنيفات
 * يستخدم لعرض نسبة كل تصنيف من إجمالي الكتب
 * كل تصنيف يحتوي على: الاسم، العدد، النسبة المئوية، اللون
 */
const booksDistribution = [
  {
    category: "تكنولوجيا",
    count: 2450,
    percentage: 98,
    color: "bg-orange-500",
  },
  { category: "أدبي", count: 1890, percentage: 75.6, color: "bg-teal-500" },
  { category: "تاريخ", count: 1560, percentage: 62.4, color: "bg-slate-700" },
  { category: "علوم", count: 1230, percentage: 49.2, color: "bg-yellow-500" },
  { category: "روايات", count: 980, percentage: 39.2, color: "bg-orange-400" },
]

/**
 * recentOrders - بيانات الطلبات الأخيرة
 * قائمة بأحدث عمليات الاستعارة والإرجاع في المكتبة
 * كل طلب يحتوي على: المعرف، العضو، الكتاب، التاريخ، النوع، الحالة، الصورة الرمزية
 */
const recentOrders = [
  {
    id: "ORD-9921",
    member: "أحمد منصور",
    book: "مقدمة في علم البيانات",
    date: "2023-10-24",
    type: "استعارة",
    status: "مكتمل",
    avatar: "أ",
  },
  {
    id: "ORD-9922",
    member: "سارة خالد",
    book: "تاريخ الأندلس المصور",
    date: "2023-10-24",
    type: "استعارة",
    status: "قيد الانتظار",
    avatar: "س",
  },
  {
    id: "ORD-9923",
    member: "محمد علي",
    book: "فن الحرب",
    date: "2023-10-23",
    type: "إرجاع",
    status: "مكتمل",
    avatar: "م",
  },
  {
    id: "ORD-9924",
    member: "ليلى حسن",
    book: "الخوارزميات المتقدمة",
    date: "2023-10-23",
    type: "استعارة",
    status: "مرفوض",
    avatar: "ل",
  },
  {
    id: "ORD-9925",
    member: "ياسين عمر",
    book: "SQL قواعد البيانات",
    date: "2023-10-22",
    type: "استعارة",
    status: "مكتمل",
    avatar: "ي",
  },
]

/**
 * LayoutDashboard Component
 * أيقونة مخصصة للوحة التحكم (لأن Lucide قد لا تحتوي عليها)
 * @param {Object} props - خصائص SVG
 * @returns {JSX.Element} - أيقونة لوحة التحكم
 */
function LayoutDashboard(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* أربعة مستطيلات تمثل وحدات تحكم مختلفة في لوحة القيادة */}
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

/**
 * Dashboard Component - الصفحة الرئيسية للوحة التحكم
 * تعرض نظرة عامة على نشاط المكتبة مع إحصائيات ومخططات بيانية وجدول الطلبات
 * @returns {JSX.Element} - لوحة التحكم الكاملة
 */
export default function Dashboard() {
  // تهيئة متغيرات الحالة (State Hooks)
  const [sidebarOpen, setSidebarOpen] = useState(false) // التحكم في ظهور القائمة الجانبية في الشاشات الصغيرة

  /**
   * handleLogout - معالج تسجيل الخروج
   * يعرض رسالة نجاح ويعيد التوجيه إلى صفحة تسجيل الدخول بعد ثانية واحدة
   */
  const handleLogout = () => {
    toast.success("تم تسجيل الخروج بنجاح")
    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)
  }

  /**
   * menuItems - قائمة عناصر القائمة الرئيسية
   * كل عنصر يحتوي على: أيقونة، تسمية، حالة النشاط، رابط الصفحة
   * العنصر النشط حالياً هو "لوحة القيادة" (active: true)
   */
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "لوحة القيادة",
      active: true,
      href: "/dashboard",
    },
    { icon: Book, label: "الكتب", active: false, href: "/books" },
    { icon: Users, label: "الموظفين", active: false, href: "/employees" },
    { icon: Users, label: "الأعضاء", active: false, href: "/members" },
    { icon: ShoppingCart, label: "الطلبات", active: false, href: "/requests" },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* مكون عرض الإشعارات (Sonner Toaster) */}
      <Toaster position="top-center" richColors />

      {/* 
        القائمة الجانبية (Sidebar)
        - في الشاشات الصغيرة (أقل من 768px): تظهر عند الضغط على زر القائمة وتختفي خلف overlay
        - في الشاشات الكبيرة (أكبر من 768px): تظهر بشكل دائم على اليمين (md:translate-x-0)
        - عرضها 80 في الشاشات الصغيرة و64 في الشاشات الكبيرة
      */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } w-80 border-l border-gray-200 bg-white shadow-xl md:w-64 md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* رأس القائمة الجانبية - الشعار والعنوان */}
          <div className="border-b p-6">
            <div className="flex items-center gap-3">
              {/* شعار المكتبة مع تدرج لوني وظل */}
              <div className="rounded-xl bg-linear-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg">
                <Library className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  نظام المكتبة
                </h1>
                <p className="text-xs text-gray-500">إدارة ذكية</p>
              </div>
            </div>
          </div>

          {/* منطقة القابلة للتمرير - تحتوي على قائمة الروابط الرئيسية */}
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-1 px-3">
              {menuItems.map((item, index) => (
                <a key={index} href={item.href} className="block">
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      item.active ? "bg-blue-600 hover:bg-blue-700" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </a>
              ))}
            </div>
          </ScrollArea>

          {/* أسفل القائمة الجانبية - إعدادات وتسجيل خروج */}
          <div className="space-y-2 border-t p-4">
            <a href="/dashboard/settings" className="block">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Settings className="h-4 w-4" />
                الإعدادات
              </Button>
            </a>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي للصفحة - يتحرك لليمين بمقدار عرض القائمة الجانبية (64 = 16rem) */}
      <div className="md:mr-64">
        {/* الهيدر - شريط العلوي الثابت */}
        <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {/* زر فتح/إغلاق القائمة الجانبية (يظهر فقط في الشاشات الصغيرة) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* معلومات المستخدم الحالي - صورة رمزية واسم */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-linear-to-br from-blue-400 to-blue-600">
                  <AvatarFallback className="bg-transparent text-white">
                    ع
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    عبد الرحمن محمود
                  </p>
                  <p className="text-xs text-muted-foreground">مشرف النظام</p>
                </div>
              </div>
            </div>
            <div></div> {/* عنصر فارغ للمحاذاة */}
          </div>
        </header>

        {/* المحتوى الرئيسي - منطقة الإحصائيات والمخططات */}
        <main className="p-6">
          {/* ترحيب وتقديم الصفحة */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              مرحباً بك، عبد الرحمن 👋
            </h1>
            <p className="text-muted-foreground">
              هذا ما يحدث في مكتبتك اليوم. مراجعة سريعة للإحصائيات
            </p>
          </div>

          {/* أزرار الإجراءات السريعة */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Button className="bg-blue-600 shadow-sm hover:bg-blue-700">
              <FileText className="ml-2 h-4 w-4" />
              إضافة طلب جديد
            </Button>
            <Button variant="outline">
              <TrendingUp className="ml-2 h-4 w-4" />
              تحميل التقرير
            </Button>
          </div>

          {/* شبكة البطاقات الإحصائية - 4 بطاقات في صف واحد على الشاشات الكبيرة */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="كتب متأخرة"
              value="12"
              trend="up"
              trendValue="+4%"
              icon={AlertCircle}
              color="red"
            />
            <StatCard
              title="طلبات حالية"
              value="84"
              trend="down"
              trendValue="-2%"
              icon={Clock}
              color="orange"
            />
            <StatCard
              title="الأعضاء النشطون"
              value="3,120"
              trend="up"
              trendValue="+5.2%"
              icon={Users}
              color="blue"
            />
            <StatCard
              title="إجمالي الكتب"
              value="12,450"
              trend="up"
              trendValue="+12%"
              icon={Book}
              color="teal"
            />
          </div>

          {/* قسم المخططات البيانية - شبكة من عمودين على الشاشات الكبيرة */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* البطاقة اليسرى: توزيع الكتب حسب التصنيف (أشرطة تقدم) */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الكتب حسب التصنيف</CardTitle>
                <CardDescription>
                  أكثر 5 تصنيفات طلباً في المكتبة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {booksDistribution.map((item, index) => (
                    <div key={index}>
                      {/* عنوان التصنيف والعدد */}
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {item.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.count.toLocaleString()} كتاب
                        </span>
                      </div>
                      {/* شريط التقدم مع عرض النسبة المئوية */}
                      <div className="h-2.5 w-full rounded-full bg-gray-100">
                        <div
                          className={`h-2.5 rounded-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* البطاقة اليمنى: مخطط نشاط الاستعارة والإرجاع (Area Chart) */}
            <Card>
              <CardHeader>
                <CardTitle>نشاط الاستعارة والإرجاع</CardTitle>
                <CardDescription>
                  معدل العمليات خلال الثلاثين يوماً الماضية
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* حاوية متجاوبة للمخطط - العرض 100% والارتفاع 300px */}
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
                    {/* تعريف التدرجات اللونية للمناطق تحت الخطوط */}
                    <defs>
                      <linearGradient
                        id="colorBorrowed"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorReturned"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    {/* شبكة المخطط (خطوط خفيفة للمساعدة في القراءة) */}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f3f4f6"
                    />

                    {/* محور X (الأيام) ومحور Y (العدد) */}
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af" }}
                    />

                    {/* تلميحات الأدوات (Tooltip) عند تمرير الماوس */}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "8px",
                      }}
                    />

                    {/* خط الاستعارة (أزرق) مع مساحة ملونة تحته */}
                    <Area
                      type="monotone"
                      dataKey="borrowed"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorBorrowed)"
                      name="استعارة"
                    />

                    {/* خط الإرجاع (برتقالي) مع مساحة ملونة تحته */}
                    <Area
                      type="monotone"
                      dataKey="returned"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorReturned)"
                      name="إرجاع"
                    />
                  </AreaChart>
                </ResponsiveContainer>

                {/* وسيلة الإيضاح (Legend) المخصصة */}
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-muted-foreground">
                      استعارة
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-muted-foreground">إرجاع</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* بطاقة جدول أحدث الطلبات */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>أحدث الطلبات</CardTitle>
                  <CardDescription>
                    متابعة حالة طلبات الاستعارة الأخيرة
                  </CardDescription>
                </div>
                {/* زر عرض الكل مع أيقونة السهم */}
                <Button variant="ghost" size="sm" className="gap-1">
                  عرض الكل
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* جدول الطلبات - يعرض 5 صفوف من البيانات */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">العضو</TableHead>
                    <TableHead className="text-right">الكتاب</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order, index) => (
                    <TableRow key={index}>
                      {/* رقم الطلب */}
                      <TableCell className="font-medium">{order.id}</TableCell>

                      {/* العضو - يحتوي على صورة رمزية واسم */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-linear-to-br from-blue-400 to-blue-600">
                            <AvatarFallback className="bg-transparent text-xs text-white">
                              {order.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{order.member}</span>
                        </div>
                      </TableCell>

                      {/* عنوان الكتاب */}
                      <TableCell>{order.book}</TableCell>

                      {/* تاريخ الطلب */}
                      <TableCell>{order.date}</TableCell>

                      {/* نوع العملية (استعارة أو إرجاع) */}
                      <TableCell>
                        <Badge
                          variant={
                            order.type === "استعارة" ? "default" : "secondary"
                          }
                        >
                          {order.type}
                        </Badge>
                      </TableCell>

                      {/* حالة الطلب (مكتمل، قيد الانتظار، مرفوض) مع ألوان مختلفة */}
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "مكتمل"
                              ? "default"
                              : order.status === "قيد الانتظار"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            order.status === "مكتمل"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : order.status === "قيد الانتظار"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>

                      {/* قائمة منسدلة للإجراءات (Dropdown Menu) */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 transition-colors hover:bg-muted">
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                            <DropdownMenuItem>تعديل</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* تذييل الصفحة - حقوق النشر */}
          <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
            نظام إدارة المكتبة الذكي. جميع الحقوق محفوظة © 2026
          </footer>
        </main>
      </div>

      {/* طبقة الخلفية المظللة (Overlay) عند فتح القائمة الجانبية في الشاشات الصغيرة */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
