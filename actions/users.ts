"use server"

import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { ActionResponse, UserListResponse, UserResponse } from "@/types/types"
import { CreateUserFormData, UpdateUserFormData } from "@/lib/validations"
import { checkAdmin } from "@/lib/helper"

/**
 * متغيرات البحث عن المستخدمين
 * @param {number} page - رقم الصفحة الحالية
 * @param {number} limit - عدد النتائج في كل صفحة
 * @param {string} search - كلمة البحث (الاسم، البريد الالكتروني)
 * @param {string} role - تصفية حسب الدور (ADMIN، STUDENT، EMPLOYEE)
 * @param {boolean} isActive - تصفية حسب الحالة (نشط/غير نشط)
 */
type SearchUsersParams = {
  page: number
  limit: number
  search?: string | undefined
  role?: string | undefined
  isActive?: boolean | undefined
}

/**
 * استرجاع قائمة المستخدمين
 *
 * @description
 * يقوم هذا التابع بجلب قائمة المستخدمين من قاعدة البيانات مع الميزات التالية:
 *
 * 1. **التحقق من الصلاحيات:**
 *    - فقط المستخدمين بدور ADMIN يمكنهم الوصول
 *    - في حالة عدم وجود صلاحية، يتم إرجاع رسالة رفض الوصول
 *
 * 2. **البحث المتقدم:**
 *    - بحث في اسم المستخدم
 *    - بحث في البريد الإلكتروني
 *    - بحث غير حساس لحالة الأحرف
 *
 * 3. **التصفية:**
 *    - تصفية حسب الدور (role)
 *    - تصفية حسب الحالة (isActive: نشط/غير نشط)
 *
 * 4. **الترقيم (Pagination):**
 *    - تقسيم النتائج إلى صفحات
 *    - حساب إجمالي عدد الصفحات تلقائياً
 *
 * @param {SearchUsersParams} params - معاملات البحث والترقيم
 * @param {number} params.page - رقم الصفحة الحالية (يبدأ من 1)
 * @param {number} params.limit - عدد النتائج في كل صفحة
 * @param {string} [params.search] - كلمة البحث (اختيارية) تبحث في اسم المستخدم والبريد الالكتروني
 * @param {string} [params.role] - تصفية حسب الدور (ADMIN، STUDENT، EMPLOYEE)
 * @param {boolean} [params.isActive] - تصفية حسب الحالة (نشط/غير نشط)
 * @returns {Promise<ActionResponse<UserListResponse>>} - قائمة المستخدمين مع معلومات الترقيم
 *
 * @example
 * // جلب أول 20 مستخدم
 * const result = await getUsersAction({ page: 1, limit: 20 })
 *
 * @example
 * // البحث عن مستخدمين باسم "أحمد"
 * const result = await getUsersAction({
 *   page: 1,
 *   limit: 20,
 *   search: "أحمد"
 * })
 *
 * @example
 * // تصفية المستخدمين النشطين من دور الطالب
 * const result = await getUsersAction({
 *   page: 1,
 *   limit: 15,
 *   role: "STUDENT",
 *   isActive: true
 * })
 */
export async function getUsersAction(
  params: SearchUsersParams
): Promise<ActionResponse<UserListResponse>> {
  try {
    // التحقق من صلاحيات المدير
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    const { page, limit, role, isActive, search } = params

    // بناء شروط البحث والتصفية
    const where: Record<string, unknown> = {}
    if (role) where.role = role
    if (isActive !== undefined) where.isActive = isActive
    if (search) {
      // البحث في الاسم والبريد الالكتروني
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { studentId: { contains: search, mode: "insensitive" } },
      ]
    }

    // جلب المستخدمين وإجمالي العدد
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          // تحديد الحقول المطلوبة فقط (استبعاد كلمة المرور)
          id: true,
          name: true,
          email: true,
          role: true,
          department: true,
          studentId: true,
          phone: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" }, // ترتيب من الأحدث للأقدم
        skip: (page - 1) * limit, // عدد السجلات المتخطية
        take: limit, // عدد السجلات المطلوبة
      }),
      prisma.user.count({ where }), // إجمالي عدد المستخدمين المطابقين للبحث
    ])

    return {
      success: true,
      data: {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

/**
 * استرجاع بيانات مستخدم محدد بواسطة المعرف
 *
 * @description
 * يقوم هذا التابع بجلب بيانات مستخدم معين مع إحصائيات استعاراته
 *
 * الميزات:
 * - التحقق من صلاحيات المدير
 * - جلب جميع بيانات المستخدم (باستثناء كلمة المرور)
 * - حساب عدد الكتب التي استعارها المستخدم (_count.rentals)
 *
 * @param {string} id - معرف المستخدم (UUID)
 * @returns {Promise<ActionResponse<UserResponse & { _count: { rentals: number } }>>}
 *          بيانات المستخدم مع عدد الاستعارات
 *
 * @example
 * // جلب بيانات مستخدم محدد
 * const result = await getUserByIdAction("cmo1uyfqv000200f08t1bz0gn")
 * if (result.success) {
 *   console.log(`المستخدم ${result.data.name} استعار ${result.data._count.rentals} كتاب`)
 * }
 *
 */
export async function getUserByIdAction(
  id: string
): Promise<ActionResponse<UserResponse & { _count: { rentals: number } }>> {
  try {
    // التحقق من صلاحيات المدير
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    // جلب المستخدم مع عدد استعاراته
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { rentals: true }, // حساب عدد الكتب المستعارة
        },
      },
    })

    // التحقق من وجود المستخدم
    if (!user) {
      return {
        success: false,
        error: "User not found",
        message: "المستخدم غير موجود",
      }
    }

    return { success: true, data: user }
  } catch {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

/**
 * إنشاء مستخدم جديد (للمدير فقط)
 *
 * @description
 * يقوم هذا التابع بإنشاء مستخدم جديد في النظام مع إمكانية تحديد دوره
 *
 * العمليات المنفذة:
 * 1. التحقق من صلاحيات المدير
 * 2. التحقق من عدم وجود بريد إلكتروني مكرر
 * 3. تشفير كلمة المرور باستخدام bcryptjs
 * 4. إنشاء المستخدم مع تحديد الدور (ADMIN | STUDENT | EMPLOYEE)
 *
 * @param {CreateUserInput} createUserForm - بيانات المستخدم الجديد
 * @returns {Promise<ActionResponse<UserResponse>>} - بيانات المستخدم الذي تم إنشاؤه
 *
 * @example
 * // إنشاء مستخدم جديد بدور مدير
 * const result = await createUserAction({
 *   name: "أحمد محمد",
 *   email: "ahmed@example.com",
 *   password: "SecurePass123",
 *   role: "ADMIN",
 *   department: "تقنية المعلومات",
 *   phone: "0501234567"
 * })
 *
 */
export async function createUserAction(
  createUserForm: CreateUserFormData
): Promise<ActionResponse<UserResponse>> {
  try {
    // التحقق من صلاحيات المدير
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    const { name, email, password, role } = createUserForm
    let { department, phone, studentId } = createUserForm

    // مسح القيمة في حال كانت نص فارغ
    if (department === "") department = null
    if (phone === "") phone = null
    if (role !== "STUDENT" || studentId === "") studentId = null

    // التحقق من عدم وجود بريد مكرر
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return {
        success: false,
        error: "Email already in use",
        message: "البريد الالكتروني مستخدم بالفعل",
      }
    }

    // تشفير كلمة المرور
    const hashedPassword = await hash(password, 12)

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department,
        phone,
        studentId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { success: true, data: user }
  } catch {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

/**
 * تحديث بيانات مستخدم موجود (للمدير فقط)
 *
 * @description
 * يقوم هذا التابع بتحديث بيانات مستخدم محدد
 *
 * العمليات المنفذة:
 * 1. التحقق من صلاحيات المدير
 * 2. التحقق من وجود المستخدم
 * 3. إذا تم تغيير كلمة المرور، يتم تشفيرها قبل التحديث
 * 4. إذا تم تغيير البريد الإلكتروني، يتم التحقق من عدم تكراره
 * 5. تحديث البيانات المطلوبة فقط
 * 6. إرجاع بيانات المستخدم بعد التحديث
 *
 * @param {string} id - معرف المستخدم المراد تحديثه
 * @param {UpdateUserInput} updateUserForm - البيانات الجديدة (جزئية)
 * @returns {Promise<ActionResponse<UserResponse>>} - بيانات المستخدم بعد التحديث
 *
 * @example
 * // تحديث اسم المستخدم فقط
 * const result = await updateUserAction("cmo1uyfqv000200f08t1bz0gn", {
 *   name: "محمد أحمد"
 * })
 *
 * @example
 * // تحديث كلمة المرور والبريد
 * const result = await updateUserAction("cmo1uyfqv000200f08t1bz0gn", {
 *   email: "newemail@example.com",
 *   password: "NewPassword123"
 * })
 *
 * @example
 * // تعطيل حساب مستخدم
 * const result = await updateUserAction("cmo1uyfqv000200f08t1bz0gn", {
 *   isActive: false
 * })
 */
export async function updateUserAction(
  id: string,
  updateUserForm: UpdateUserFormData
): Promise<ActionResponse<UserResponse>> {
  try {
    // التحقق من صلاحيات المدير
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    // التحقق من وجود المستخدم
    const existingUser = await prisma.user.findUnique({ where: { id } })
    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
        message: "المستخدم غير موجود",
      }
    }

    // إذا تم توفير كلمة مرور جديدة، قم بتشفيرها
    if (updateUserForm.password) {
      updateUserForm.password = await hash(updateUserForm.password, 12)
    }

    // إذا تم تغيير البريد الإلكتروني، تحقق من عدم تكراره
    if (updateUserForm.email && updateUserForm.email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: updateUserForm.email },
      })
      if (emailInUse) {
        return {
          success: false,
          error: "Email already in use",
          message: "البريد الالكتروني مستخدم بالفعل",
        }
      }
    }

    // تحديث بيانات المستخدم
    const user = await prisma.user.update({
      where: { id },
      data: updateUserForm,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { success: true, data: user }
  } catch {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

/**
 * حذف مستخدم (تعطيل الحساب) - للمدير فقط
 *
 * @description
 * **ملاحظة هامة**: هذه الدالة لا تحذف المستخدم فعلياً من قاعدة البيانات
 * بدلاً من ذلك، تقوم بتعطيل الحساب فقط (تغيير isActive إلى false)
 *
 * لماذا التعطيل بدل الحذف؟
 * - الحفاظ على سلامة البيانات المرتبطة (الاستعارات السابقة)
 * - إمكانية إعادة تنشيط الحساب لاحقاً
 * - الاحتفاظ بسجل تدقيق كامل
 *
 * العمليات المنفذة:
 * 1. التحقق من صلاحيات المدير
 * 2. التحقق من وجود المستخدم
 * 3. تعيين isActive = false (تعطيل الحساب)
 * 4. إرجاع بيانات المستخدم بعد التعطيل
 *
 * @param {string} id - معرف المستخدم المراد تعطيله
 * @returns {Promise<ActionResponse<UserResponse>>} - بيانات المستخدم بعد التعطيل
 *
 * @example
 * // تعطيل حساب مستخدم
 * const result = await deleteUserAction("cmo1uyfqv000200f08t1bz0gn")
 * if (result.success) {
 *   toast(`تم تعطيل حساب ${result.data.name}`)
 * }
 *
 * @see {@link updateUserAction} - لإعادة تنشيط الحساب (تعيين isActive: true)
 *
 */
export async function deleteUserAction(
  id: string
): Promise<ActionResponse<UserResponse>> {
  try {
    // التحقق من صلاحيات المدير
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    // التحقق من وجود المستخدم
    const existingUser = await prisma.user.findUnique({ where: { id } })
    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
        message: "المستخدم غير موجود",
      }
    }

    // تعطيل المستخدم (بدلاً من الحذف الفعلي)
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        studentId: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { success: true, data: user }
  } catch {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}
