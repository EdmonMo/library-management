import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { UpdateProfileInput, ChangePasswordInput } from "@/lib/validations"
import { api } from "@/lib/api-client"
import { User } from "@/types/types"

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get<User>("/api/auth/me"),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      api.patch<User>("/api/auth/me", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      api.patch<unknown>("/api/auth/change-password", data),
  })
}
