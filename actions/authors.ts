"use server"

import { checkAdmin } from "@/lib/helper"
import { prisma } from "@/lib/prisma"
import { CreateAuthorFormData } from "@/lib/validations"
import {
  ActionResponse,
  AuthorListResponse,
  AuthorResponse,
} from "@/types/types"

type SearchAuthorsParams = {
  page: number
  limit: number
  name?: string | undefined
}

export async function getAuthorsAction(
  params: SearchAuthorsParams
): Promise<ActionResponse<AuthorListResponse>> {
  try {
    const { page, limit, name } = params

    const where: Record<string, unknown> = {}
    if (name) {
      where.OR = [{ name: { contains: name, mode: "insensitive" } }]
    }

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where,
        select: {
          id: true,
          name: true,
          biography: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.author.count({ where }),
    ])

    return {
      success: true,
      data: {
        authors,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    return { success: false, error: error, message: "حدث خطأ في السيرفر" }
  }
}

export async function getAuthorByIdAction(
  id: string
): Promise<ActionResponse<AuthorResponse & { _count: { books: number } }>> {
  try {
    const author = await prisma.author.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        biography: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { books: true },
        },
      },
    })

    if (!author) {
      return {
        success: false,
        error: "Author not found",
        message: "المؤلف غير موجود",
      }
    }

    return { success: true, data: author }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

export async function createAuthorAction(
  createAuthorForm: CreateAuthorFormData
): Promise<ActionResponse<AuthorResponse>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin)
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }

    const { name } = createAuthorForm
    const biography =
      createAuthorForm.biography === "" ? null : createAuthorForm.biography

    const existingAuthor = await prisma.author.findUnique({
      where: { name },
    })
    if (existingAuthor) {
      return {
        success: false,
        error: "Author with the same name already exists",
        message: "اسم المؤلف مستخدم بالفعل",
      }
    }

    const author = await prisma.author.create({
      data: {
        name,
        biography,
      },
      select: {
        id: true,
        name: true,
        biography: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return { success: true, data: author }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ في السيرفر",
    }
  }
}

export async function updateAuthorAction(
  id: string,
  updateAuthorForm: CreateAuthorFormData
): Promise<ActionResponse<AuthorResponse>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin)
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }

    const { name } = updateAuthorForm
    const biography =
      updateAuthorForm.biography === "" ? null : updateAuthorForm.biography

    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    })
    if (!existingAuthor) {
      return {
        success: false,
        error: "Author not found",
        message: "المؤلف غير موجود",
      }
    }
    if (name && name !== existingAuthor.name) {
      const nameInUse = await prisma.author.findUnique({ where: { name } })
      if (nameInUse)
        return {
          success: false,
          error: "Author with the same name already exists",
          message: "اسم المؤلف مستخدم بالفعل",
        }
    }

    const author = await prisma.author.update({
      where: { id },
      data: {
        name,
        biography,
      },
      select: {
        id: true,
        name: true,
        biography: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { success: true, data: author }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

export async function deleteAuthorAction(
  id: string
): Promise<ActionResponse<AuthorResponse>> {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return {
        success: false,
        error: "Forbidden",
        message: "لا تملك صلاحية الوصول الى هذه الصفحة",
      }
    }

    const existingAuthor = await prisma.author.findUnique({ where: { id } })
    if (!existingAuthor) {
      return {
        success: false,
        error: "Author not found",
        message: "لا يوجد مؤلف بهذا المعرف",
      }
    }

    const author = await prisma.author.delete({
      where: { id },
    })

    return { success: true, data: author }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}
