"use server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  ChangePasswordFormData,
  UpdateProfileFormData,
} from "@/lib/validations"
import { ActionResponse, UserResponse } from "@/types/types"
import { compare, hash } from "bcryptjs"

export async function getProfileAction(): Promise<
  ActionResponse<UserResponse>
> {
  const { user: currentUser } = await auth()
  if (!currentUser) {
    return {
      success: false,
      error: "Unauthorized",
      message: "لا تملك صلاحية الوصول لهذه الصفحة",
    }
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: currentUser?.id },
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

    if (!user) {
      return {
        success: false,
        error: "User not found",
        message: "لم يتم العثور على المستخدم",
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

export async function updateProfileAction(
  updateProfileForm: UpdateProfileFormData
): Promise<ActionResponse<UserResponse>> {
  try {
    const { user } = await auth()
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        message: "لا تملك صلاحية الوصول لهذه الصفحة",
      }
    }

    if (user.role !== "STUDENT") {
      return {
        success: false,
        error: "Only students can update their profile here",
        message: "فقط الطالب يستطيع تعديل  معلوماته الشخصية",
      }
    }

    const { name, department, phone } = updateProfileForm

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name, department, phone },
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

    return {
      success: true,
      data: updatedUser,
      message: "تم تحديث معلوماتك بنجاح",
    }
  } catch {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

export async function changePasswordAction(
  changePasswordForm: ChangePasswordFormData
): Promise<ActionResponse> {
  try {
    const { user: currentUser } = await auth()
    if (!currentUser) {
      return {
        success: false,
        error: "Unauthorized",
        message: "لا تملك صلاحية الوصول لهذه الصفحة",
      }
    }

    const { currentPassword, newPassword } = changePasswordForm

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { id: true, password: true },
    })

    if (!user) {
      return {
        success: false,
        error: "User not found",
        message: "لم يتم العثور على المستخدم",
      }
    }

    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
      return {
        success: false,
        error: "Current password is incorrect",
        message: "كلمة المرور غير صحيحة",
      }
    }

    const hashedPassword = await hash(newPassword, 12)

    const isDuplicate = await compare(newPassword, user.password)
    if (isDuplicate) {
      return {
        success: false,
        error: "New password can't be the same as the old one",
        message: "كلمة المرور الجديدة لا يمكن ان تطابق القديمة",
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return { success: true, message: "تم تغيير كلمة المرور بنجاح" }
  } catch {
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}
