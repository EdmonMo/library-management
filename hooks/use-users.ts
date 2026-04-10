import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  UserListQuery,
  CreateUserInput,
  UpdateUserInput,
} from "@/lib/validations"
import { api } from "@/lib/api-client"
import { User, UserList } from "@/types/types"

export function useGetUsers(params: UserListQuery) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () =>
      api.get<UserList>("/api/users", {
        page: params.page,
        limit: params.limit,
        ...(params.role && { role: params.role }),
        ...(params.isActive !== undefined && { isActive: params.isActive }),
        ...(params.search && { search: params.search }),
      }),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserInput) => api.post("/api/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      api.patch<User>(`/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete<User>(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
