import z from "zod"

export const createUserSchema = z.object({
  name: z.string().min(1, "اسم المستخدم مطلوب"),
  email: z.string().email("البريد الالكتروني المدخل غير صحيح"),
  password: z.string().min(8, "كلمة السر يجب ان تكون على الاقل 8 احرف"),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  department: z.string().optional(),
  phone: z.string().optional(),
})

export const updateUserSchema = createUserSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export const userListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(["ADMIN", "EMPLOYEE", "STUDENT"]).optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
})

export const signupSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الالكتروني المدخل غير صحيح"),
  password: z.string().min(8, "كلمة السر يجب ان تكون على الاقل 8 احرف"),
  department: z.string().optional(),
  phone: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email("البريد الالكتروني المدخل غير صحيح"),
  password: z.string().min(8, "كلمة السر مطلوبة"),
  rememberMe: z.boolean().default(false),
})

export const updateProfileSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "كلمة السر الحالية مطلوبة"),
  newPassword: z.string().min(8, "كلمة السر يجب ان تكون على الاقل 8 احرف"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserListQuery = z.infer<typeof userListQuerySchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
