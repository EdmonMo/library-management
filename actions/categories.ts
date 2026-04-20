"use server"

import { checkAdmin } from "@/lib/helper"
import { prisma } from "@/lib/prisma"
import { CreateCategoryFormData } from "@/lib/validations"
import {
  ActionResponse,
  CategoryListResponse,
  CategoryResponse,
} from "@/types/types"

/**
 * متغيرات البحث عن الفئات
 * @param {number} page - رقم الصفحة الحالية
 * @param {number} limit - عدد النتائج في كل صفحة
 * @param {string} name - البحث عن طريق اسم الفئة (اختياري)
 */
type SearchCategoriesParams = {
  page: number
  limit: number
  name?: string | undefined
}

/**
 * استرجاع قائمة الفئات
 *
 * @description
 * يقوم هذا التابع بجلب قائمة الفئات من قاعدة البيانات مع الميزات التالية:
 *
 * 1. **التحقق من الصلاحيات:**
 *    - فقط المستخدمين بدور ADMIN يمكنهم الوصول
 *    - في حالة عدم وجود صلاحية، يتم إرجاع رسالة رفض الوصول
 *
 * 2. **البحث المتقدم:**
 *    - بحث عن طريق اسم الفئة
 *    - بحث غير حساس لحالة الأحرف
 *
 * 3. **الترقيم (Pagination):**
 *    - تقسيم النتائج إلى صفحات
 *    - حساب إجمالي عدد الصفحات تلقائياً
 *
 * @param {SearchUsersParams} params - معاملات البحث والترقيم
 * @param {number} params.page - رقم الصفحة الحالية (يبدأ من 1)
 * @param {number} params.limit - عدد النتائج في كل صفحة
 * @param {string} [params.name] - كلمة البحث (اختيارية) تبحث في اسم الفئة
 * @returns {Promise<ActionResponse<CategoryListResponse>>} - قائمة الفئات مع معلومات الترقيم
 *
 * @example
 * // جلب أول 20 فئة
 * const result = await getCategoriesAction({ page: 1, limit: 20 })
 *
 * @example
 * // البحث عن الفئات باسم "خيال علمي"
 * const result = await getCategoriesAction({
 *   page: 1,
 *   limit: 20,
 *   name: "خيال علمي"
 * })
 */
export async function getCategoriesAction(
  params: SearchCategoriesParams
): Promise<ActionResponse<CategoryListResponse>> {
  try {
    const { page, limit, name } = params

    const where: Record<string, unknown> = {}
    if (name) {
      where.OR = [{ name: { contains: name, mode: "insensitive" } }]
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.category.count({ where }),
    ])

    return {
      success: true,
      data: {
        categories,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    return { success: false, error: error, message: "حدث خطأ في السيرفر" }
  }
}

/**
 * استرجاع فئة محددة بواسطة المعرف
 *
 * @description
 * يقوم هذا التابع بجلب فئة معينة بواسطة المعرف مع عدد الكتب المرتبطة بهذه الفئة
 *
 * الميزات:
 * - التحقق من صلاحيات المدير
 * - جلب جميع بيانات الفئة
 * - حساب عدد الكتب المرتبطة بهذه الفئة (_count.books)
 *
 * @param {string} id - معرف المستخدم (UUID)
 * @returns {Promise<ActionResponse<CategoryResponse & { _count: { books: number } }>>}
 *          بيانات الفئة مع عدد الكتب المرتبطة بها
 *
 * @example
 * // جلب بيانات فئة محددة
 * const result = await getCategoryByIdAction("cmo1uyfqv000200f08t1bz0gn")
 *
 */
export async function getCategoryByIdAction(
  id: string
): Promise<ActionResponse<CategoryResponse & { _count: { books: number } }>> {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { books: true },
        },
      },
    })

    if (!category) {
      return {
        success: false,
        error: "Category not found",
        message: "الفئة غير موجودة",
      }
    }

    return { success: true, data: category }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

export async function createCategoryAction(
  createCategoryForm: CreateCategoryFormData
): Promise<ActionResponse<CategoryResponse>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin)
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }

    let { name, description } = createCategoryForm

    if (description === "") description = null

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    })
    if (existingCategory) {
      return {
        success: false,
        error: "Category with the same name already in use",
        message: "اسم الفئة مستخدم بالفعل",
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return { success: true, data: category }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ في السيرفر",
    }
  }
}

export async function updateCategoryAction(
  id: string,
  updateCategoryForm: CreateCategoryFormData
): Promise<ActionResponse<CategoryResponse>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin)
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }

    let { name, description } = updateCategoryForm

    if (description === "") description = null

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })
    if (!existingCategory) {
      return {
        success: false,
        error: "Category not found",
        message: "الفئة غير موجودة",
      }
    }
    if (name && name !== existingCategory.name) {
      const nameInUse = await prisma.category.findUnique({ where: { name } })
      if (nameInUse)
        return {
          success: false,
          error: "Category with the same name already in use",
          message: "اسم الفئة مستخدم بالفعل",
        }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { success: true, data: category }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

export async function deleteCategoryAction(
  id: string
): Promise<ActionResponse<CategoryResponse>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    const existingCategory = await prisma.category.findUnique({ where: { id } })
    if (!existingCategory) {
      return {
        success: false,
        error: "Category not found",
        message: "لا يوجد فئة بهذا المعرف",
      }
    }

    const category = await prisma.category.delete({
      where: { id },
    })

    return { success: true, data: category }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}
