"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import {
  ActionResponse,
  RentalListResponse,
  RentalResponse,
  RentalStatsResponse,
} from "@/types/types"

function computeRentalStatus(
  status: string,
  dueDate: Date,
  returnedAt: Date | null
): "ACTIVE" | "RETURNED" | "OVERDUE" | "LOST" {
  if (returnedAt) return "RETURNED"
  if (status === "LOST") return "LOST"
  if (status === "ACTIVE" && dueDate < new Date()) return "OVERDUE"
  return "ACTIVE"
}

const rentalSelect = {
  id: true,
  bookCopyId: true,
  studentId: true,
  rentedAt: true,
  dueDate: true,
  returnedAt: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  bookCopy: {
    select: {
      id: true,
      copyNumber: true,
      status: true,
      book: {
        select: {
          id: true,
          title: true,
          isbn: true,
          publisher: true,
          coverImage: true,
        },
      },
    },
  },
  student: {
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      department: true,
    },
  },
} as const

function mapRental(rental: Record<string, unknown>): RentalResponse {
  const r = rental as {
    id: string
    bookCopyId: string
    studentId: string
    rentedAt: Date
    dueDate: Date
    returnedAt: Date | null
    status: string
    notes: string | null
    createdAt: Date
    updatedAt: Date
    bookCopy: {
      id: string
      copyNumber: number
      status: string
      book: {
        id: string
        title: string
        isbn: string
        publisher: string | null
        coverImage: string | null
      }
    }
    student: {
      id: string
      name: string
      email: string
      studentId: string | null
      department: string | null
    }
  }
  return {
    ...r,
    status: computeRentalStatus(r.status, r.dueDate, r.returnedAt),
  }
}

export async function getMyRentalsAction(params: {
  page?: number
  limit?: number
}): Promise<ActionResponse<RentalListResponse>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", message: "يجب تسجيل الدخول" }
    }

    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const studentId = session.user.id

    const [rentals, total] = await Promise.all([
      prisma.rental.findMany({
        where: { studentId },
        select: rentalSelect,
        orderBy: { rentedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rental.count({ where: { studentId } }),
    ])

    return {
      success: true,
      data: {
        rentals: rentals.map(mapRental),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    return { success: false, error, message: "حدث خطأ في السيرفر" }
  }
}

type GetAllRentalsParams = {
  page?: number
  limit?: number
  status?: string
  search?: string
  studentId?: string
}

export async function getAllRentalsAction(
  params: GetAllRentalsParams
): Promise<ActionResponse<RentalListResponse>> {
  try {
    const session = await auth()
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")
    ) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول",
      }
    }

    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const where: Record<string, unknown> = {}

    if (params.status) {
      if (params.status === "OVERDUE") {
        where.status = "ACTIVE"
        where.dueDate = { lt: new Date() }
      } else {
        where.status = params.status
      }
    }

    if (params.search) {
      where.OR = [
        { student: { name: { contains: params.search, mode: "insensitive" } } },
        {
          bookCopy: {
            book: { title: { contains: params.search, mode: "insensitive" } },
          },
        },
      ]
    }

    if (params.studentId) {
      where.studentId = params.studentId
    }

    const [rentals, total] = await Promise.all([
      prisma.rental.findMany({
        where,
        select: rentalSelect,
        orderBy: { rentedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rental.count({ where }),
    ])

    return {
      success: true,
      data: {
        rentals: rentals.map(mapRental),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    return { success: false, error, message: "حدث خطأ في السيرفر" }
  }
}

export async function getStudentRentalsAction(
  studentId: string,
  params: { page?: number; limit?: number }
): Promise<ActionResponse<RentalListResponse>> {
  try {
    const session = await auth()
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")
    ) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول",
      }
    }

    const page = params.page ?? 1
    const limit = params.limit ?? 20

    const [rentals, total] = await Promise.all([
      prisma.rental.findMany({
        where: { studentId },
        select: rentalSelect,
        orderBy: { rentedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rental.count({ where: { studentId } }),
    ])

    return {
      success: true,
      data: {
        rentals: rentals.map(mapRental),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    return { success: false, error, message: "حدث خطأ في السيرفر" }
  }
}

export async function createRentalAction(
  bookCopyId: string
): Promise<ActionResponse<RentalResponse>> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized", message: "يجب تسجيل الدخول" }
    }

    const studentId = session.user.id

    const activeRentalsCount = await prisma.rental.count({
      where: {
        studentId,
        status: "ACTIVE",
      },
    })

    if (activeRentalsCount >= 3) {
      return {
        success: false,
        error: "Limit exceeded",
        message: "لا يمكنك استعارة أكثر من 3 كتب في نفس الوقت",
      }
    }

    const bookCopy = await prisma.bookCopy.findUnique({
      where: { id: bookCopyId },
      include: { book: true },
    })

    if (!bookCopy) {
      return {
        success: false,
        error: "Not found",
        message: "نسخة الكتاب غير موجودة",
      }
    }

    if (bookCopy.status !== "AVAILABLE") {
      return {
        success: false,
        error: "Not available",
        message: "هذه النسخة غير متاحة للاستعارة",
      }
    }

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    const rental = await prisma.$transaction(async (tx) => {
      const created = await tx.rental.create({
        data: {
          bookCopyId,
          studentId,
          dueDate,
          status: "ACTIVE",
        },
        select: rentalSelect,
      })

      await tx.bookCopy.update({
        where: { id: bookCopyId },
        data: { status: "RENTED" },
      })

      return created
    })

    return {
      success: true,
      data: mapRental(rental as Record<string, unknown>),
      message: "تم استعارة الكتاب بنجاح",
    }
  } catch (error) {
    return { success: false, error, message: "حدث خطأ في السيرفر" }
  }
}

export async function returnRentalAction(
  rentalId: string,
  notes?: string
): Promise<ActionResponse<RentalResponse>> {
  try {
    const session = await auth()
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")
    ) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول",
      }
    }

    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      select: { id: true, status: true, bookCopyId: true },
    })

    if (!rental) {
      return {
        success: false,
        error: "Not found",
        message: "الاستعارة غير موجودة",
      }
    }

    if (rental.status !== "ACTIVE") {
      return {
        success: false,
        error: "Invalid status",
        message: "لا يمكن إرجاع كتاب غير مستعار",
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const returned = await tx.rental.update({
        where: { id: rentalId },
        data: {
          status: "RETURNED",
          returnedAt: new Date(),
          notes: notes ?? null,
        },
        select: rentalSelect,
      })

      await tx.bookCopy.update({
        where: { id: rental.bookCopyId },
        data: { status: "AVAILABLE" },
      })

      return returned
    })

    return {
      success: true,
      data: mapRental(updated as Record<string, unknown>),
      message: "تم إرجاع الكتاب بنجاح",
    }
  } catch (error) {
    return { success: false, error, message: "حدث خطأ في السيرفر" }
  }
}

export async function getRentalStatsAction(): Promise<
  ActionResponse<RentalStatsResponse>
> {
  try {
    const session = await auth()
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "EMPLOYEE")
    ) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول",
      }
    }

    const now = new Date()

    const [active, overdue, returned, total] = await Promise.all([
      prisma.rental.count({
        where: { status: "ACTIVE", dueDate: { gte: now } },
      }),
      prisma.rental.count({
        where: { status: "ACTIVE", dueDate: { lt: now } },
      }),
      prisma.rental.count({ where: { status: "RETURNED" } }),
      prisma.rental.count(),
    ])

    return {
      success: true,
      data: { active, overdue, returned, total },
    }
  } catch (error) {
    return { success: false, error, message: "حدث خطأ في السيرفر" }
  }
}
