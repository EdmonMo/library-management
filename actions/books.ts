"use server"

import { prisma } from "@/lib/prisma"
import { checkAdmin } from "@/lib/helper"
import {
  ActionResponse,
  BookDetailedResponse,
  BookListResponse,
  BookResponse,
} from "@/types/types"
import type { AddBookFormData } from "@/lib/validations"

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
export async function getBookById(
  id: string
): Promise<ActionResponse<BookDetailedResponse>> {
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { _count: true, authors: true, categories: true, copies: true },
    })
    if (!book) {
      return {
        success: false,
        error: "Not Found",
        message: "لم يتم العثور على الكتاب",
      }
    }

    return {
      success: true,
      data: book,
    }
  } catch (error) {
    return { success: false, error: error, message: "حدث خطأ في السيرفر" }
  }
}

export async function createBookAction(
  formData: AddBookFormData
): Promise<ActionResponse<BookResponse>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    const {
      title,
      isbn,
      description,
      publisher,
      publishedYear,
      coverImage,
      categories,
      authors,
      numberOfCopies,
    } = formData

    const existingBook = await prisma.book.findUnique({ where: { isbn } })
    if (existingBook) {
      return {
        success: false,
        error: "ISBN already exists",
        message: "رقم ISBN مستخدم بالفعل",
      }
    }

    const authorIds = await resolveAuthors(authors)
    const categoryIds = categories

    const book = await prisma.$transaction(async (tx) => {
      const created = await tx.book.create({
        data: {
          title,
          isbn,
          description: description ?? null,
          publisher: publisher ?? null,
          publishedYear: publishedYear?.getFullYear() ?? null,
          coverImage: coverImage ?? null,
          authors: {
            connect: authorIds.map((id) => ({ id })),
          },
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
        },
        select: {
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
        },
      })

      const copyData = Array.from({ length: numberOfCopies }, (_, i) => ({
        bookId: created.id,
        copyNumber: i + 1,
        status: "AVAILABLE" as const,
        location: null,
      }))

      await tx.bookCopy.createMany({ data: copyData })

      return created
    })

    return {
      success: true,
      data: {
        ...book,
        totalCopies: numberOfCopies,
        availableCopies: numberOfCopies,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ في السيرفر",
    }
  }
}

export async function updateBookAction(
  id: string,
  formData: AddBookFormData
): Promise<ActionResponse<BookResponse>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    const {
      title,
      isbn,
      description,
      publisher,
      publishedYear,
      coverImage,
      categories,
      authors,
    } = formData

    const existingBook = await prisma.book.findUnique({ where: { id } })
    if (!existingBook) {
      return {
        success: false,
        error: "Not found",
        message: "الكتاب غير موجود",
      }
    }

    if (isbn && isbn !== existingBook.isbn) {
      const isbnInUse = await prisma.book.findUnique({ where: { isbn } })
      if (isbnInUse) {
        return {
          success: false,
          error: "ISBN already exists",
          message: "رقم ISBN مستخدم بالفعل",
        }
      }
    }

    const authorIds = await resolveAuthors(authors)

    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        isbn,
        description: description ?? null,
        publisher: publisher ?? null,
        publishedYear: publishedYear?.getFullYear() ?? null,
        coverImage: coverImage ?? null,
        authors: {
          set: [],
          connect: authorIds.map((id) => ({ id })),
        },
        categories: {
          set: [],
          connect: categories.map((id) => ({ id })),
        },
      },
      select: {
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
          select: { copies: true },
        },
        copies: {
          select: { status: true },
        },
      },
    })

    const { _count, copies, ...bookData } = book

    return {
      success: true,
      data: {
        ...bookData,
        totalCopies: _count.copies,
        availableCopies: copies.filter((c) => c.status === "AVAILABLE").length,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

export async function deleteBookAction(
  id: string
): Promise<ActionResponse<void>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    const activeRentals = await prisma.rental.count({
      where: {
        bookCopy: { bookId: id },
        status: { in: ["ACTIVE", "OVERDUE"] },
      },
    })

    if (activeRentals > 0) {
      return {
        success: false,
        error: "Book has active rentals",
        message: "لا يمكن حذف الكتاب لأنه يحتوي على استعارات نشطة",
      }
    }

    await prisma.book.delete({ where: { id } })

    return { success: true, message: "تم حذف الكتاب بنجاح" }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

async function resolveAuthors(names: string[] | undefined): Promise<string[]> {
  if (!names || names.length === 0) return []

  const results: string[] = []
  for (const name of names) {
    if (!name || !name.trim()) continue
    const trimmed = name.trim()

    const author = await prisma.author.upsert({
      where: { name: trimmed },
      update: {},
      create: { name: trimmed },
    })
    results.push(author.id)
  }
  return results
}
