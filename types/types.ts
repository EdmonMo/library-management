export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "EMPLOYEE" | "STUDENT"
  department: string | null
  studentId: string | null
  phone: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserList {
  users: User[]
  total: number
  page: number
  totalPages: number
}
