"use client"

import React, { useState } from "react"
import {
  Users,
  ShoppingCart,
  Search,
  Menu,
  Clock,
  AlertCircle,
  Book,
  ChevronLeft,
  LogOut,
  Settings,
  Library,
  LayoutDashboard,
  Plus,
  Filter,
  Edit,
  CheckCircle2,
  BookMarked,
  X,
  MoreHorizontal,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster, toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import BookStatusBadge from "./components/BookStatusBadge"

/**
 * SimpleDropdown Component
 * قائمة منسدلة مخصصة بدون استخدام مكتبات خارجية
 * @param {Object} props - خصائص المكون
 * @param {JSX.Element} props.trigger - العنصر الذي عند النقر عليه تظهر القائمة
 * @param {JSX.Element} props.children - محتوى القائمة المنسدلة
 * @param {string} props.align - محاذاة القائمة ('end' لليمين، 'start' لليسار)
 * @returns {JSX.Element} - عنصر القائمة المنسدلة
 */
function SimpleDropdown({ trigger, children, align = "end" }) {
  const [isOpen, setIsOpen] = useState(false) // حالة فتح/إغلاق القائمة
  const dropdownRef = React.useRef(null) // مرجع لعنصر القائمة للكشف عن النقر خارجها

  /**
   * useEffect - إضافة مستمع لأحداث النقر خارج القائمة
   * عند النقر خارج عنصر القائمة، يتم إغلاقها تلقائياً
   */
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* العنصر الذي يفتح القائمة عند النقر عليه */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {/* عرض القائمة المنسدلة عند فتحها */}
      {isOpen && (
        <div
          className={`absolute z-50 min-w-32 overflow-hidden rounded-md border bg-white p-1 shadow-md ${align === "end" ? "right-0" : "left-0"} `}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * SimpleDropdownItem Component
 * عنصر فردي داخل القائمة المنسدلة
 * @param {Object} props - خصائص المكون
 * @param {JSX.Element} props.children - محتوى العنصر
 * @param {Function} props.onClick - دالة تستدعى عند النقر على العنصر
 * @param {string} props.className - كلاسات CSS إضافية
 * @returns {JSX.Element} - عنصر القائمة
 */
function SimpleDropdownItem({ children, onClick, className }) {
  return (
    <div
      onClick={() => {
        onClick?.() // استدعاء دالة onClick إذا كانت موجودة
      }}
      className={`relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none hover:bg-gray-100 ${className || ""} `}
    >
      {children}
    </div>
  )
}

/**
 * SimpleDropdownSeparator Component
 * فاصل بصري بين عناصر القائمة المنسدلة
 * @returns {JSX.Element} - خط فاصل
 */
function SimpleDropdownSeparator() {
  return <div className="-mx-1 my-1 h-px bg-gray-200" />
}

/**
 * booksData - بيانات الكتب التجريبية
 * تحتوي على مجموعة من الكتب كعينة للعرض في الجدول
 * كل كتاب يحتوي على: معرف، عنوان، مؤلف، تصنيف، حالة
 */
const booksData = [
  {
    id: "BK-101",
    title: "مقدمة في علم البيانات",
    author: "د. خالد المنصور",
    category: "تكنولوجيا",
    status: "متاح",
  },
  {
    id: "BK-102",
    title: "تاريخ الأندلس المفقود",
    author: "أحمد صالح",
    category: "تاريخ",
    status: "معار",
  },
  {
    id: "BK-103",
    title: "روائع الأدب العربي",
    author: "طه حسين",
    category: "أدب",
    status: "متاح",
  },
  {
    id: "BK-104",
    title: "أساسيات الفيزياء الحديثة",
    author: "ستيفن هوكنغ (مترجم)",
    category: "علوم",
    status: "متاح",
  },
  {
    id: "BK-105",
    title: "إدارة الوقت والذات",
    author: "إبراهيم الفقي",
    category: "تطوير ذات",
    status: "صيانة",
  },
  {
    id: "BK-106",
    title: "فن الحرب",
    author: "سون تزو",
    category: "فلسفة",
    status: "معار",
  },
]

/**
 * BooksPage Component - الصفحة الرئيسية لإدارة الكتب
 * تحتوي على جدول يعرض الكتب مع إمكانيات البحث والتصفية وإضافة كتب جديدة
 * @returns {JSX.Element} - صفحة إدارة الكتب الكاملة
 */
export default function BooksPage() {
  // تهيئة متغيرات الحالة (State Hooks)
  const router = useRouter() // للتنقل بين الصفحات
  const [sidebarOpen, setSidebarOpen] = useState(false) // التحكم في ظهور القائمة الجانبية

  // حالة الفلاتر والبحث
  const [searchQuery, setSearchQuery] = useState("") // نص البحث
  const [categoryFilter, setCategoryFilter] = useState("all") // فلتر التصنيف
  const [statusFilter, setStatusFilter] = useState("all") // فلتر الحالة

  // حالة نافذة إضافة كتاب جديد
  const [dialogOpen, setDialogOpen] = useState(false) // فتح/إغلاق النافذة المنبثقة
  const [newBook, setNewBook] = useState({
    // بيانات الكتاب الجديد
    title: "",
    author: "",
    category: "",
    status: "متاح",
  })

  /**
   * handleLogout - معالج تسجيل الخروج
   * يعرض رسالة نجاح ويعيد التوجيه إلى صفحة تسجيل الدخول بعد ثانية
   */
  const handleLogout = () => {
    toast.success("تم تسجيل الخروج بنجاح")
    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)
  }

  /**
   * handleNavigateToAddBook - التنقل إلى صفحة إضافة كتاب جديد
   * يستخدم Next.js router للتوجيه إلى صفحة الإضافة المخصصة
   */
  const handleNavigateToAddBook = () => {
    router.push("/books/add-book")
  }

  /**
   * handleAddBook - معالج إضافة كتاب جديد من النافذة المنبثقة
   * يتحقق من صحة البيانات، يعرض رسائل الخطأ، ويضيف الكتاب
   */
  const handleAddBook = () => {
    // التحقق من وجود البيانات المطلوبة
    if (!newBook.title || !newBook.author || !newBook.category) {
      toast.error("يرجى ملء جميع الحقول المطلوبة")
      return
    }
    // عرض رسالة نجاح
    toast.success("تم إضافة الكتاب بنجاح")
    // إغلاق النافذة المنبثقة
    setDialogOpen(false)
    // إعادة تعيين بيانات الكتاب الجديد
    setNewBook({ title: "", author: "", category: "", status: "متاح" })
  }

  /**
   * menuItems - قائمة عناصر القائمة الرئيسية
   * كل عنصر يحتوي على: أيقونة، تسمية، حالة النشاط، رابط الصفحة
   */
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "لوحة القيادة",
      active: false,
      href: "/dashboard",
    },
    { icon: Book, label: "الكتب", active: true, href: "/books" },
    { icon: Users, label: "الموظفين", active: false, href: "/employees" },
    { icon: Users, label: "الأعضاء", active: false, href: "/members" },
    { icon: ShoppingCart, label: "الطلبات", active: false, href: "/requests" },
  ]

  /**
   * booksStats - بيانات الإحصائيات المعروضة في بطاقات أعلى الصفحة
   * تحتوي على: التسمية، القيمة، الأيقونة، اللون، لون الخلفية
   */
  const booksStats = [
    {
      label: "تحت الصيانة",
      value: "16",
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "كتب معارة حالياً",
      value: "412",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "الكتب المتاحة",
      value: "856",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "إجمالي الكتب",
      value: "1,284",
      icon: BookMarked,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ]

  /**
   * filteredBooks - الكتب المصفاة بناءً على معايير البحث والتصفية
   * يتم تطبيق ثلاثة فلاتر:
   * 1. البحث في العنوان، المؤلف، أو رقم الكتاب
   * 2. فلتر التصنيف
   * 3. فلتر الحالة
   */
  const filteredBooks = booksData.filter((book) => {
    const matchesSearch =
      searchQuery === "" ||
      book.title.includes(searchQuery) ||
      book.author.includes(searchQuery) ||
      book.id.includes(searchQuery)
    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter
    const matchesStatus = statusFilter === "all" || book.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    // الحاوية الرئيسية للصفحة مع دعم اللغة العربية (RTL)
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      {/* مكون عرض الإشعارات */}
      <Toaster position="top-center" richColors />

      {/* 
        القائمة الجانبية (Sidebar)
        - في الشاشات الصغيرة: تظهر عند الضغط على زر القائمة
        - في الشاشات الكبيرة: تظهر بشكل دائم على اليمين
      */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } w-80 border-l border-gray-200 bg-white shadow-xl md:w-64 md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* رأس القائمة الجانبية - الشعار والعنوان */}
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
              {/* زر إغلاق القائمة الجانبية (يظهر فقط في الشاشات الصغيرة) */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
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
              className="w-full justify-start gap-3 text-destructive hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي للصفحة - يتحرك لليمين عند ظهور القائمة الجانبية */}
      <div className="md:mr-64">
        {/* الهيدر - شريط العلوي */}
        <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {/* زر فتح/إغلاق القائمة الجانبية للشاشات الصغيرة */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              {/* معلومات المستخدم الحالي */}
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

        {/* المحتوى الرئيسي - منطقة الجدول والفلاتر */}
        <main className="p-6">
          {/* عنوان الصفحة والوصف */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              إدارة الكتب
            </h1>
            <p className="text-muted-foreground">
              تصفح وإدارة مجموعة الكتب المتوفرة في المكتبة
            </p>
          </div>

          {/* أزرار الإجراءات الرئيسية */}
          <div className="mb-8 flex flex-wrap gap-4">
            {/* زر إضافة كتاب جديد - ينتقل إلى صفحة منفصلة */}
            <Button
              className="bg-blue-600 shadow-sm hover:bg-blue-700"
              onClick={handleNavigateToAddBook}
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة كتاب جديد
            </Button>
            {/* زر التصفية المتقدمة */}
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              تصفية متقدمة
            </Button>
          </div>

          {/* نافذة منبثقة (Dialog) لإضافة كتاب جديد بسرعة */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة كتاب جديد</DialogTitle>
                <DialogDescription>
                  أدخل معلومات الكتاب الجديد لإضافته إلى المكتبة
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* حقل عنوان الكتاب */}
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الكتاب</Label>
                  <Input
                    id="title"
                    placeholder="أدخل عنوان الكتاب"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                  />
                </div>
                {/* حقل المؤلف */}
                <div className="space-y-2">
                  <Label htmlFor="author">المؤلف</Label>
                  <Input
                    id="author"
                    placeholder="أدخل اسم المؤلف"
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({ ...newBook, author: e.target.value })
                    }
                  />
                </div>
                {/* حقول التصنيف والحالة - شبكة من عمودين */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">التصنيف</Label>
                    <Select
                      value={newBook.category}
                      onValueChange={(value) =>
                        setNewBook({ ...newBook, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تكنولوجيا">تكنولوجيا</SelectItem>
                        <SelectItem value="تاريخ">تاريخ</SelectItem>
                        <SelectItem value="أدب">أدب</SelectItem>
                        <SelectItem value="علوم">علوم</SelectItem>
                        <SelectItem value="تطوير ذات">تطوير ذات</SelectItem>
                        <SelectItem value="فلسفة">فلسفة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      value={newBook.status}
                      onValueChange={(value) =>
                        setNewBook({ ...newBook, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="متاح">متاح</SelectItem>
                        <SelectItem value="معار">معار</SelectItem>
                        <SelectItem value="صيانة">صيانة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* أزرار التحكم في النافذة المنبثقة */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleAddBook}
                >
                  حفظ الكتاب
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* بطاقات الإحصائيات السريعة */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {booksStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  className="transition-shadow duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold">
                          {stat.value}
                        </h3>
                      </div>
                      <div className={`rounded-lg p-3 ${stat.bg}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* بطاقة الفلاتر - البحث والتصنيف والحالة */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* حقل البحث النصي */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    البحث
                  </Label>
                  <div className="relative">
                    <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="عنوان، مؤلف، أو رقم..."
                      className="pr-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                {/* قائمة منسدلة لفلتر التصنيف */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    التصنيف
                  </Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="كل التصنيفات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل التصنيفات</SelectItem>
                      <SelectItem value="تكنولوجيا">تكنولوجيا</SelectItem>
                      <SelectItem value="تاريخ">تاريخ</SelectItem>
                      <SelectItem value="أدب">أدب</SelectItem>
                      <SelectItem value="علوم">علوم</SelectItem>
                      <SelectItem value="تطوير ذات">تطوير ذات</SelectItem>
                      <SelectItem value="فلسفة">فلسفة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* قائمة منسدلة لفلتر الحالة */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    حالة الكتاب
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="كل الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الحالات</SelectItem>
                      <SelectItem value="متاح">متاح</SelectItem>
                      <SelectItem value="معار">معار</SelectItem>
                      <SelectItem value="صيانة">صيانة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* بطاقة جدول عرض الكتب */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>قائمة الكتب</CardTitle>
              <CardDescription>
                عرض {filteredBooks.length} كتاب من إجمالي {booksData.length}{" "}
                كتاب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  {/* رأس الجدول - أسماء الأعمدة */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الكتاب</TableHead>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="hidden text-right md:table-cell">
                        المؤلف
                      </TableHead>
                      <TableHead className="hidden text-right lg:table-cell">
                        التصنيف
                      </TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* جسم الجدول - عرض الكتب المصفاة */}
                  <TableBody>
                    {filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{book.title}</div>
                          {/* عرض المؤلف في الشاشات الصغيرة تحت العنوان */}
                          <div className="text-sm text-muted-foreground md:hidden">
                            {book.author}
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {book.author}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="secondary" className="font-normal">
                            {book.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <BookStatusBadge status={book.status} />
                        </TableCell>
                        <TableCell>
                          {/* قائمة منسدلة لإجراءات التعديل والحذف لكل كتاب */}
                          <SimpleDropdown
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                            align="end"
                          >
                            <SimpleDropdownItem>
                              <Edit className="ml-2 h-4 w-4" />
                              تعديل
                            </SimpleDropdownItem>
                            <SimpleDropdownSeparator />
                            <SimpleDropdownItem className="text-red-600">
                              حذف
                            </SimpleDropdownItem>
                          </SimpleDropdown>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {/* تذييل الجدول - أزرار التصفح ومعلومات العرض */}
            <CardFooter className="flex items-center justify-between px-6 pt-4 pb-6">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="ml-1 h-4 w-4" />
                  السابق
                </Button>
                <Button variant="outline" size="sm">
                  التالي
                  <ChevronLeft className="mr-1 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                عرض{" "}
                <span className="font-medium text-foreground">
                  1-{filteredBooks.length}
                </span>{" "}
                من أصل{" "}
                <span className="font-medium text-foreground">
                  {booksData.length}
                </span>{" "}
                كتاب
              </p>
            </CardFooter>
          </Card>

          {/* تذييل الصفحة - حقوق النشر */}
          <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
            نظام إدارة المكتبة الذكي. جميع الحقوق محفوظة © 2026
          </footer>
        </main>
      </div>

      {/* طبقة الخلفية المظللة عند فتح القائمة الجانبية في الشاشات الصغيرة */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
