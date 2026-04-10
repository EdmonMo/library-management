import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"
import type { RegisterInput, LoginInput } from "@/lib/validations"
import { api } from "@/lib/api-client"
import { User } from "@/types/types"

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await api.post<User>("/api/auth/register", data)

      if (res.error) {
        throw new Error("المعلومات المدخلة غير صحيحة")
      }

      return res
    },
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (res?.error) {
        throw new Error("المعلومات المدخلة غير صحيحة")
      }
      return res
    },
  })
}
