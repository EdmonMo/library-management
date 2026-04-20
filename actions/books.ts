"use server"

import { prisma } from "@/lib/prisma"
import { ActionResponse, BookListResponse } from "@/types/types"

type SearchBooksParams = {
  page: number
  limit: number
  search?: string | undefined
}

/**
 * استرجاع قائمة الكتب من قاعدة البيانات
 *
 * @description
 * يقوم هذا التابع بجلب الكتب من قاعدة البيانات مع الميزات التالية:
 *
 * 1. **البحث المتقدم:**
 *    - البحث في عنوان الكتاب (عنوان)
 *    - البحث في رقم ISBN (الترقيم الدولي المعياري للكتاب)
 *    - بحث غير حساس لحالة الأحرف (Case-insensitive)
 *
 * 2. **الترقيم (Pagination):**
 *    - تقسيم النتائج إلى صفحات لتقليل الحمل على الأداء
 *    - حساب إجمالي عدد الصفحات تلقائياً
 *
 * 3. **إحصائيات النسخ:**
 *    - حساب إجمالي عدد نسخ كل كتاب
 *    - حساب عدد النسخ المتاحة (المتوفرة للاستعارة)
 *    - تصفية النسخ حسب الحالة (AVAILABLE فقط)
 *
 * @param {SearchBooksParams} params - معلمات البحث والترقيم
 * @param {number} params.page - رقم الصفحة الحالية (يبدأ من 1)
 * @param {number} params.limit - عدد النتائج في كل صفحة
 * @param {string} [params.search] - كلمة البحث (اختيارية) تبحث في العنوان و ISBN
 *
 * @returns {Promise<ActionResponse<BookListResponse>>} استجابة تحتوي على:
 *   - success: نجاح أو فشل العملية
 *   - data: كائن يحتوي على الكتب وإجمالي العدد ومعلومات الترقيم
 *   - message: رسالة للمستخدم (في حالة الخطأ)
 *   - error: تفاصيل الخطأ التقني (للمطور)
 *
 * @example
 * // الاستخدام الأساسي - جلب أول 20 كتاب
 * const result = await getBooksAction({ page: 1, limit: 20 })
 *
 * @example
 * // البحث عن كتب تحتوي على كلمة "React"
 * const result = await getBooksAction({
 *   page: 1,
 *   limit: 20,
 *   search: "React"
 * })
 *
 *
 * @ملاحظات_البحث
 * - البحث غير حساس لحالة الأحرف (يكافئ "react" و "React" و "REACT")
 * - يبحث في كل من عنوان الكتاب ورقم ISBN
 * - إذا كان البحث فارغاً أو غير موجود، يتم جلب جميع الكتب
 *
 * @ملاحظات_الترقيم
 * - رقم الصفحة يبدأ من 1 (وليس 0)
 * - إذا كانت الصفحة المطلوبة أكبر من إجمالي الصفحات، سيتم إرجاع مصفوفة فارغة
 *
 * @returns_book_structure
 * كل كتاب يحتوي على:
 * - id: معرف فريد للكتاب
 * - title: عنوان الكتاب
 * - isbn: رقم ISBN (الترقيم الدولي المعياري)
 * - description: وصف الكتاب
 * - publisher: دار النشر
 * - publishedYear: سنة النشر
 * - coverImage: رابط صورة الغلاف
 * - categories: التصنيفات
 * - totalCopies: إجمالي عدد النسخ في المكتبة
 * - availableCopies: عدد النسخ المتاحة للاستعارة حالياً
 * - createdAt: تاريخ الإضافة
 * - updatedAt: تاريخ آخر تحديث
 */

export async function getBooksAction(
  params: SearchBooksParams
): Promise<ActionResponse<BookListResponse>> {
  try {
    const { page, limit, search } = params

    // بناء شروط البحث بناءً على وجود كلمة البحث
    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { isbn: { contains: search, mode: "insensitive" } },
      ]
    }

    // جلب الكتب وإجمالي العدد
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        select: {
          // تحديد الحقول المطلوبة فقط
          id: true,
          title: true,
          isbn: true,
          description: true,
          publisher: true,
          publishedYear: true,
          coverImage: true,
          categories: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              copies: true, // جلب إجمالي عدد النسخ
            },
          },
          copies: {
            select: {
              status: true, // جلب حالة كل نسخة لحساب المتاح منها
            },
          },
        },
        orderBy: { createdAt: "desc" }, // ترتيب من الأحدث إلى الأقدم
        skip: (page - 1) * limit, // عدد السجلات التي سيتم تخطيها
        take: limit, // عدد السجلات المطلوبة للصفحة الحالية
      }),
      prisma.book.count({ where }), // حساب إجمالي عدد الكتب المطابقة للبحث
    ])

    /**
     * تحويل البيانات لإضافة إحصائيات النسخ وتنسيق الاستجابة النهائية
     *
     * نقوم بـ:
     * 1. حساب totalCopies من _count.copies
     * 2. حساب availableCopies بتصفية النسخ ذات الحالة "AVAILABLE"
     * 3. إزالة الحقول المؤقتة (copies, _count) من الكائن النهائي
     */
    const booksWithCopies = books.map((book) => ({
      ...book,
      totalCopies: book._count.copies,
      availableCopies: book.copies.filter((copy) => copy.status === "AVAILABLE")
        .length,
      // إزالة الحقول المؤقتة التي لا نحتاجها في الاستجابة النهائية
      copies: undefined,
      _count: undefined,
    }))

    return {
      success: true,
      data: {
        books: booksWithCopies, // مصفوفة الكتب مع إحصائيات النسخ
        total, // إجمالي عدد الكتب (لحساب عدد الصفحات)
        page, // الصفحة الحالية (للمحافظة عليها في الواجهة)
        totalPages: Math.ceil(total / limit), // حساب إجمالي عدد الصفحات
      },
    }
  } catch (error) {
    // في حالة حدوث أي خطأ غير متوقع
    return { success: false, error: error, message: "حدث خطأ في السيرفر" }
  }
}
