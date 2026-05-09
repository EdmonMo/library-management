import { getUsersAction } from "@/actions/users"
import { getBooksAction } from "@/actions/books"
import { Author, Book, BookCopy, Category } from "@prisma/client"
/**
 * واجهات وأنواع البيانات المستخدمة في نظام إدارة المكتبة
 * @packageDocumentation
 * تحتوي هذا الملف على جميع أنواع البيانات المشتركة بين العميل والخادم
 */

/**
 * استجابة قياسية لجميع أكشنات السيرفر
 * @template T - نوع البيانات المرتجعة في حالة النجاح
 *
 * @property {boolean} success - يشير إلى نجاح أو فشل العملية
 * @property {T} [data] - البيانات المرتجعة في حالة النجاح (نوعها يحدد حسب الأكشن)
 * @property {string} [error] - الخطأ التقني للتصحيح (للمطورين فقط، لا يعرض للمستخدم)
 * @property {string} [message] - رسالة مفهومة للمستخدم بالعربية (نجاح/خطأ/تحذير)
 * @property {Record<string, unknown>} [details] - تفاصيل إضافية (مثل أخطاء التحقق من صحة البيانات)
 *
 * @example
 * // استجابة نجاح
 * {
 *   success: true,
 *   data: { id: "1", name: "أحمد", ... },
 *   message: "تم إنشاء المستخدم بنجاح"
 * }
 *
 * @example
 * // استجابة خطأ متوقع (مثل بريد مكرر)
 * {
 *   success: false,
 *   message: "البريد الإلكتروني مستخدم بالفعل",
 *   error: "Email already in use"  // للمطور
 * }
 */
export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: Record<string, unknown>
}

/**
 * بيانات المستخدم الكاملة (المرتجعة من الخادم)
 * @description
 * تحتوي على جميع معلومات المستخدم مع استبعاد البيانات الحساسة مثل كلمة المرور
 *
 * @property {string} id - المعرف الفريد للمستخدم (UUID)
 * @property {string} name - الاسم الكامل للمستخدم
 * @property {string} email - البريد الإلكتروني (فريد لكل مستخدم)
 * @property {"ADMIN" | "EMPLOYEE" | "STUDENT"} role - دور المستخدم في النظام
 *   - ADMIN: صلاحيات كاملة (إدارة المستخدمين، الكتب، الاستعارات)
 *   - EMPLOYEE: صلاحيات محدودة (إدارة الكتب والاستعارات فقط)
 *   - STUDENT: صلاحيات أساسية (استعارة الكتب فقط)
 * @property {string | null} department - القسم أو التخصص (مهم للطلاب والموظفين)
 * @property {string | null} phone - رقم الهاتف (اختياري)
 * @property {boolean} isActive - حالة الحساب (نشط/معطل)
 *   - true: يمكن للمستخدم تسجيل الدخول واستخدام النظام
 *   - false: الحساب معطل ولا يمكن الوصول إليه
 * @property {Date} createdAt - تاريخ إنشاء الحساب
 * @property {Date} updatedAt - تاريخ آخر تحديث للحساب
 *
 * @example
 * // مستخدم من نوع طالب
 * {
 *   id: "cmo1uyfqv000200f08t1bz0gn",
 *   name: "أحمد محمد",
 *   email: "ahmed@university.com",
 *   role: "STUDENT",
 *   department: "علوم الحاسوب",
 *   phone: "0501234567",
 *   isActive: true,
 *   createdAt: new Date("2024-01-01"),
 *   updatedAt: new Date("2024-01-01")
 * }
 *
 * @example
 * // مستخدم من نوع مدير
 * {
 *   id: "cmo1uyfqv000200f08t1bz0gn",
 *   name: "مدير النظام",
 *   email: "admin@library.com",
 *   role: "ADMIN",
 *   department: "الإدارة",
 *   phone: "0551234567",
 *   isActive: true,
 *   createdAt: new Date("2023-01-01"),
 *   updatedAt: new Date("2023-06-15")
 */
export type UserResponse = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "EMPLOYEE" | "STUDENT"
  department: string | null
  phone: string | null
  studentId: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * استجابة قائمة المستخدمين مع معلومات الترقيم (Pagination)
 * @description
 * تستخدم عند جلب قائمة المستخدمين مع دعم الترقيم والبحث
 *
 * @property {UserResponse[]} users - مصفوفة من المستخدمين (البيانات الأساسية)
 * @property {number} total - إجمالي عدد المستخدمين المطابقين للبحث (بدون ترقيم)
 * @property {number} page - رقم الصفحة الحالية (يبدأ من 1)
 * @property {number} totalPages - إجمالي عدد الصفحات المتاحة (محسوب من total / limit)
 *
 * @example
 * // استجابة من getUsersAction
 * {
 *   users: [user1, user2, user3],
 *   total: 45,        // إجمالي 45 مستخدم في قاعدة البيانات
 *   page: 2,          // نحن في الصفحة الثانية
 *   totalPages: 5     // يوجد 5 صفحات إجمالاً (45 ÷ 10)
 * }
 *
 * @see {@link getUsersAction} - الأكشن التي ترجع هذا النوع
 */
export type UserListResponse = {
  users: UserResponse[]
  total: number
  page: number
  totalPages: number
}

/**
 * بيانات الكتاب الكاملة مع معلومات النسخ المتاحة
 * @description
 * تحتوي على معلومات الكتاب الأساسية بالإضافة إلى إحصائيات النسخ
 *
 * @property {string} id - المعرف الفريد للكتاب (UUID)
 * @property {string} title - عنوان الكتاب
 * @property {string} isbn - رقم ISBN (الترقيم الدولي المعياري للكتاب) - فريد لكل كتاب
 * @property {string | null} description - وصف الكتاب (محتوى، ملخص، فصول)
 * @property {string | null} publisher - دار النشر
 * @property {number | null} publishedYear - سنة النشر (عدد صحيح)
 * @property {string | null} coverImage - رابط صورة غلاف الكتاب (URL)
 * @property {number} availableCopies - عدد النسخ المتاحة للاستعارة حالياً
 *   - يتم حسابه من copies.status === "AVAILABLE"
 *   - يمكن استعارة الكتاب إذا كان > 0
 * @property {number} totalCopies - إجمالي عدد نسخ الكتاب في المكتبة
 *   - مجموع جميع النسخ (بغض النظر عن حالتها)
 *   - = availableCopies + borrowedCopies + lostCopies + damagedCopies
 * @property {CategoryResponse[]} categories - التصنيفات المرتبطة بالكتاب
 *   - يمكن أن يكون للكتاب عدة تصنيفات (علاقة Many-to-Many)
 * @property {Date} createdAt - تاريخ إضافة الكتاب إلى النظام
 * @property {Date} updatedAt - تاريخ آخر تحديث لبيانات الكتاب
 *
 * @example
 * // كتاب مع نسخ متاحة
 * {
 *   id: "bk_123",
 *   title: "رياكت js - دليل المطور",
 *   isbn: "978-3-16-148410-0",
 *   description: "دليل شامل لتعلم React.js من الأساسيات إلى المتقدم",
 *   publisher: "دار التقنية",
 *   publishedYear: 2023,
 *   coverImage: "/books/react-guide.jpg",
 *   availableCopies: 3,   // 3 نسخ متاحة للاستعارة
 *   totalCopies: 5,        // إجمالي 5 نسخ (3 متاحة + 2 مستعارة)
 *   categories: [
 *     { id: "cat_1", name: "برمجة", description: null, createdAt: new Date(), updatedAt: new Date() }
 *   ],
 *   createdAt: new Date("2024-01-01"),
 *   updatedAt: new Date("2024-01-01")
 * }
 *
 * @example
 * // كتاب بدون نسخ متاحة (جميع النسخ مستعارة)
 * {
 *   ...book,
 *   availableCopies: 0,   // لا توجد نسخ متاحة حالياً
 *   totalCopies: 3
 * }
 *
 * @ملاحظات
 * - availableCopies يتم حسابه تلقائياً من علاقة copies
 * - إذا كان availableCopies = 0، لا يمكن استعارة الكتاب حتى يتم إرجاع نسخة
 * - التصنيفات تساعد في تصفية وبحث الكتب
 * - isbn يستخدم كمعرف فريد للكتاب عالمياً
 */
export type BookResponse = {
  id: string
  title: string
  isbn: string
  description: string | null
  publisher: string | null
  publishedYear: number | null
  coverImage: string | null
  availableCopies: number
  totalCopies: number
  categories: CategoryResponse[]
  createdAt: Date
  updatedAt: Date
}

/**
 * استجابة قائمة الكتب مع معلومات الترقيم (Pagination)
 * @description
 * تستخدم عند جلب قائمة الكتب مع دعم البحث والترقيم والتصفية
 *
 * @property {BookResponse[]} books - مصفوفة من الكتب (مع معلومات النسخ المتاحة)
 * @property {number} total - إجمالي عدد الكتب المطابقة للبحث (بدون ترقيم)
 * @property {number} page - رقم الصفحة الحالية (يبدأ من 1)
 * @property {number} totalPages - إجمالي عدد الصفحات المتاحة (محسوب من total / limit)
 *
 * @example
 * // استجابة من getBooksAction
 * {
 *   books: [book1, book2, book3, book4, book5],
 *   total: 127,       // إجمالي 127 كتاب في المكتبة
 *   page: 3,          // نحن في الصفحة الثالثة
 *   totalPages: 13    // يوجد 13 صفحة إجمالاً (127 ÷ 10 = 12.7 → 13)
 * }
 *
 * @example
 * // استجابة بحث عن كتب "رياكت"
 * {
 *   books: [reactBook1, reactBook2],  // فقط الكتب التي تحتوي على "رياكت"
 *   total: 2,
 *   page: 1,
 *   totalPages: 1
 * }
 *
 * @see {@link getBooksAction} - الأكشن التي ترجع هذا النوع
 */
export type BookListResponse = {
  books: BookResponse[]
  total: number
  page: number
  totalPages: number
}

export type BookDetailedResponse = Book & {
  authors: Author[]
  copies: BookCopy[]
  categories: Category[]
  _count: {
    authors: number
    copies: number
    categories: number
  }
}

/**
 * بيانات تصنيف الكتاب
 * @description
 * يستخدم لتصنيف وتنظيم الكتب حسب المواضيع أو الأقسام
 *
 * @property {string} id - المعرف الفريد للتصنيف (UUID)
 * @property {string} name - اسم التصنيف (مثال: "برمجة"، "روايات"، "علوم")
 * @property {string | null} description - وصف التصنيف (اختياري)
 *   - مثال: "كتب تخصصية في مجال البرمجة وتطوير البرمجيات"
 * @property {Date} createdAt - تاريخ إنشاء التصنيف
 * @property {Date} updatedAt - تاريخ آخر تحديث للتصنيف
 *
 * @example
 * // تصنيف برمجة
 * {
 *   id: "cat_1",
 *   name: "برمجة",
 *   description: "كتب عن لغات البرمجة وأطر العمل وتقنيات التطوير",
 *   createdAt: new Date("2024-01-01"),
 *   updatedAt: new Date("2024-01-01")
 * }
 *
 * @example
 * // تصنيف بدون وصف
 * {
 *   id: "cat_3",
 *   name: "تاريخ",
 *   description: null,  // لا يوجد وصف
 *   createdAt: new Date("2024-01-03"),
 *   updatedAt: new Date("2024-01-03")
 * }
 *
 * @ملاحظات
 * - يمكن للكتاب الواحد أن ينتمي إلى عدة تصنيفات (علاقة Many-to-Many)
 * - التصنيفات تساعد في تحسين تجربة البحث والتصفية للمستخدمين
 * - name يجب أن يكون فريداً لتجنب تكرار التصنيفات
 * - يمكن استخدام التصنيفات في إحصائيات المكتبة (أكثر التصنيفات استعارة)
 */
export type CategoryResponse = {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export type CategoryListResponse = {
  categories: CategoryResponse[]
  total: number
  page: number
  totalPages: number
}
