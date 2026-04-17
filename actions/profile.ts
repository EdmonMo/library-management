// export async function getProfileAction(): Promise<
//   ActionResponse<UserResponse>
// > {
//   try {
//     const session = await getServerSession()
//     if (!session) {
//       return { success: false, error: "Unauthorized" }
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         department: true,
//         studentId: true,
//         phone: true,
//         isActive: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     })

//     if (!user) {
//       return { success: false, error: "User not found" }
//     }

//     return { success: true, data: user }
//   } catch {
//     return { success: false, error: "Internal server error" }
//   }
// }

// export async function updateProfileAction(
//   formData: FormData
// ): Promise<ActionResponse<UserResponse>> {
//   try {
//     const session = await getServerSession()
//     if (!session) {
//       return { success: false, error: "Unauthorized" }
//     }

//     if (session.user.role !== "STUDENT") {
//       return {
//         success: false,
//         error: "Only students can update their profile here",
//       }
//     }

//     const validationResult = updateProfileSchema.safeParse({
//       name: formData.get("name"),
//       department: formData.get("department"),
//       phone: formData.get("phone"),
//     })

//     if (!validationResult.success) {
//       return {
//         success: false,
//         error: "Invalid input",
//         details: validationResult.error.flatten(),
//       }
//     }

//     const { name, department, phone } = validationResult.data

//     const updatedUser = await prisma.user.update({
//       where: { id: session.user.id },
//       data: { name, department, phone },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         department: true,
//         studentId: true,
//         phone: true,
//         isActive: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     })

//     return { success: true, data: updatedUser }
//   } catch {
//     return { success: false, error: "Internal server error" }
//   }
// }

// export async function changePasswordAction(
//   formData: FormData
// ): Promise<ActionResponse> {
//   try {
//     const session = await getServerSession()
//     if (!session) {
//       return { success: false, error: "Unauthorized" }
//     }

//     const validationResult = changePasswordSchema.safeParse({
//       currentPassword: formData.get("currentPassword"),
//       newPassword: formData.get("newPassword"),
//     })

//     if (!validationResult.success) {
//       return {
//         success: false,
//         error: "Invalid input",
//         details: validationResult.error.flatten(),
//       }
//     }

//     const { currentPassword, newPassword } = validationResult.data

//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       select: { id: true, password: true },
//     })

//     if (!user) {
//       return { success: false, error: "User not found" }
//     }

//     const isValid = await compare(currentPassword, user.password)
//     if (!isValid) {
//       return { success: false, error: "Current password is incorrect" }
//     }

//     const hashedPassword = await hash(newPassword, 12)

//     await prisma.user.update({
//       where: { id: user.id },
//       data: { password: hashedPassword },
//     })

//     return { success: true, message: "Password changed successfully" }
//   } catch {
//     return { success: false, error: "Internal server error" }
//   }
// }
