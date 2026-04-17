"use server"

import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { LoginFormData, SignupFormData } from "@/lib/validations"
import { ActionResponse, UserResponse } from "@/types/types"
import { signIn, signOut } from "@/lib/auth"

/**
 * إنشاء حساب مستخدم جديد في النظام بدور "طالب".
 *
 * @description
 * يقوم هذا التابع بمعالجة تسجيل المستخدم الجديد من خلال الخطوات التالية:
 * 1. التأكد من عدم وجود مستخدم آخر بنفس البريد الإلكتروني
 * 2. تشفير كلمة المرور باستخدام bcryptjs بقوة 12 جولة
 * 3. إنشاء سجل مستخدم جديد في قاعدة البيانات بدور STUDENT
 * 4. إعادة بيانات المستخدم مع استبعاد الحساسة (مثل كلمة المرور)
 *
 * @param {SignupFormData} signupForm - بيانات نموذج التسجيل (الاسم، البريد، كلمة المرور، القسم، الهاتف)
 * @returns {Promise<ActionResponse<UserResponse>>} -
 * استجابة تحتوي على:
 *   - success: نجاح أو فشل العملية
 *   - data: كائن يحتوي على بيانات المستخدم الذي تم انشاءه
 *   - message: رسالة للمستخدم (في حالة الخطأ)
 *   - error: تفاصيل الخطأ التقني (للمطور)
 *
 * @example
 * // الاستخدام في نموذج تسجيل:
 * const result = await signupAction({ name: "أحمد", email: "ahmed@example.com", password: "123456", department: "علوم الحاسوب", phone: "0501234567" })
 * if (result.success) {
 *   toast("تم إنشاء الحساب")
 * }
 */

export async function signupAction(
  signupForm: SignupFormData
): Promise<ActionResponse<UserResponse>> {
  try {
    const { name, email, password, department, phone } = signupForm

    // التحقق من وجود مستخدم بنفس البريد الإلكتروني مسبقاً
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return {
        success: false,
        error: "Email already exists",
        message: "البريد الالكتروني مستخدم بالفعل",
      }
    }

    // تشفير كلمة المرور قبل التخزين في قاعدة البيانات
    const hashedPassword = await hash(password, 12)

    // إنشاء المستخدم الجديد في قاعدة البيانات
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT", // تعيين دور الطالب بشكل افتراضي
        department,
        phone,
      },
      // تحديد الحقول المراد إرجاعها فقط (استبعاد كلمة المرور والحقول الحساسة)
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

    return { success: true, data: user, message: "تم انشاء الحساب" }
  } catch {
    // في حالة حدوث أي خطأ غير متوقع
    return {
      success: false,
      error: "Internal server error",
      message: "حدث خطأ ما",
    }
  }
}

/**
 * تسجيل دخول المستخدم إلى النظام باستخدام البريد الالكتروني وكلمة السر.
 *
 * @description
 * تقوم هذه الأكشن بتسجيل دخول المستخدم من خلال:
 * 1. استدعاء دالة المصادقة signIn من مكتبة NextAuth.js
 * 2. استخدام استراتيجية "credentials" للتحقق من البريد وكلمة المرور
 * 3. منع إعادة التوجيه التلقائي للتحكم في تدفق التطبيق
 *
 * @param {LoginFormData} loginForm - بيانات نموذج تسجيل الدخول (البريد الإلكتروني، كلمة المرور)
 * @returns {Promise<ActionResponse>} - استجابة بنجاح العملية أو رسالة خطأ
 *
 * @example
 * // الاستخدام في نموذج تسجيل الدخول:
 * const result = await loginAction({ email: "ahmed@example.com", password: "123456" })
 * if (result.success) {
 *   // توجيه المستخدم إلى لوحة التحكم
 *   router.push("/dashboard")
 * }
 */

export async function loginAction(
  loginForm: LoginFormData
): Promise<ActionResponse> {
  try {
    await signIn("credentials", {
      ...loginForm,
      redirect: false, // منع إعادة التوجيه التلقائي للتحكم يدوياً
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: error }
  }
}

/**
 * تسجيل خروج المستخدم من النظام وإنهاء الجلسة النشطة.
 *
 * @description
 * يقوم هذا التابع بتسجيل خروج المستخدم الحالي من خلال:
 * 1. استدعاء دالة signOut من NextAuth.js
 * 2. مسح جلسة المستخدم المخزنة (كوكيز، tokens)
 *
 * @returns {Promise<ActionResponse>} - استجابة بنجاح تسجيل الخروج أو رسالة خطأ
 *
 * @example
 * // الاستخدام في زر تسجيل الخروج:
 * const handleLogout = async () => {
 *   const result = await logoutAction()
 *   if (result.success) {
 *     router.push("/login")
 *   }
 * }
 */

export async function logoutAction(): Promise<ActionResponse> {
  try {
    await signOut({ redirect: false })

    return { success: true }
  } catch (error) {
    return { success: false, error: error }
  }
}
