"use server"
import { auth } from "./auth"

/**
 * التحقق من صلاحيات المدير
 *
 * @description
 * دالة مساعدة للتحقق من أن المستخدم الحالي هو مدير ولديه صلاحية الوصول
 *
 * @returns {Promise<boolean>}
 *  - true إذا كان المستخدم مديراً
 *  - false ان لم يكن مديراً
 */
export async function checkAdmin(): Promise<boolean> {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return false
  }
  return true
}
