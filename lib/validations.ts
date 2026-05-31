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

export const signupSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().email("البريد الالكتروني المدخل غير صحيح"),
    password: z.string().min(8, "كلمة السر يجب ان تكون على الاقل 8 احرف"),
    confirmPassword: z
      .string()
      .min(8, "تأكيد كلمة السر يجب ان تكون على الاقل 8 احرف"),
    department: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة السر وتأكيدها غير متطابقين",
    path: ["confirmPassword"],
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

export const createAuthorSchema = z.object({
  name: z.string().min(1, "اسم المؤلف مطلوب"),
  biography: z.string().optional(),
})

export const addBookSchema = z.object({
  title: z.string().min(1, "عنوان الكتاب مطلوب"),
  isbn: z.string().min(1, "رقم ISBN مطلوب"),
  description: z.string().optional(),
  publisher: z.string().optional(),
  publishedYear: z.coerce.number().int().optional(),
  coverImage: z.string().optional(),
  categories: z.array(z.string()),
  authors: z.array(z.string()).optional(),
  numberOfCopies: z.number().min(1, "يجب ان يكون هناك نسخة واحدة على الاقل"),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
export type CreateAuthorFormData = z.infer<typeof createAuthorSchema>
export const createRentalSchema = z.object({
  bookCopyId: z.string().min(1, "معرف نسخة الكتاب مطلوب"),
  studentId: z.string().min(1, "معرف الطالب مطلوب"),
})

export const returnRentalSchema = z.object({
  rentalId: z.string().min(1, "معرف الاستعارة مطلوب"),
  notes: z.string().optional(),
})

export type CreateRentalFormData = z.infer<typeof createRentalSchema>
export type ReturnRentalFormData = z.infer<typeof returnRentalSchema>
export type AddBookFormData = z.infer<typeof addBookSchema>
