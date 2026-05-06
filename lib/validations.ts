import z from "zod"

export const createUserSchema = z.object({
  name: z.string().min(1, "اسم المستخدم مطلوب"),
  email: z.string().email("البريد الالكتروني المدخل غير صحيح"),
  password: z.string().min(8, "كلمة السر يجب ان تكون على الاقل 8 احرف"),
  role: z.enum(["ADMIN", "EMPLOYEE", "STUDENT"]),
  department: z.string().optional(),
  phone: z.string().optional(),
  studentId: z.string().optional(),
})

export const updateUserSchema = createUserSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export const signupSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الالكتروني المدخل غير صحيح"),
  password: z.string().min(8, "كلمة السر يجب ان تكون على الاقل 8 احرف"),
  confirmPassword: z
    .string()
    .min(8, "تأكيد كلمة السر يجب ان تكون على الاقل 8 احرف"),
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

export const createCategorySchema = z.object({
  name: z.string().min(3, "اسم الفئة يجب ان لايقل عن 3 احرف"),
  description: z.string().optional(),
})

export const addBookSchema = z.object({
  title: z.string().min(1, "عنوان الكتاب مطلوب"),
  isbn: z.string().min(1, "رقم ISBN مطلوب"),
  description: z.string().optional(),
  publisher: z.string().optional(),
  publishedYear: z.date().optional(),
  coverImage: z.string().url().optional(),
  categories: z.array(z.string()),
  authors: z.array(z.string()).optional(),
  numberOfCopies: z.number().min(1, "يجب ان يكون هناك نسخة واحدة على الاقل"),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
export type AddBookFormData = z.infer<typeof addBookSchema>
