/**
 * API Client — a thin typed wrapper around the native fetch API.
 *
 * Centralizes:
 *  - JSON headers & body serialization
 *  - Query string building for GET params
 *  - Consistent error handling via ApiError
 *  - Full TypeScript inference with generics
 */

type RequestType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

/** Config passed to the internal request function */
interface ApiConfig {
  method: RequestType
  body?: Record<string, unknown>
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * Standard shape of every API response.
 * Matches the { success, data, error } format used in route handlers.
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

/**
 * Custom error thrown when an API call returns a non-2xx status.
 * Carries the HTTP status code and optional validation details.
 */
export class ApiError extends Error {
  status: number
  details?: Record<string, unknown>

  constructor(
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(translateError(message))
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

/**
 * Maps English API error messages → Arabic.
 * Add new translations here as you create new error messages.
 */
const ERROR_MESSAGES_AR: Record<string, string> = {
  // Auth
  "Email already in use": "البريد الإلكتروني مستخدم بالفعل",
  "Current password is incorrect": "كلمة المرور الحالية غير صحيحة",
  "Only students can update their profile here":
    "يمكن للطلاب فقط تحديث ملفاتهم الشخصية",
  // Common
  "User not found": "لم يتم العثور على المستخدم",
  "Invalid input": "بيانات غير صالحة",
  "Internal server error": "حدث خطأ غير متوقع",
  // Auth middleware
  Unauthorized: "يجب تسجيل الدخول أولاً",
  Forbidden: " الوصول غير مسموح",
}

function translateError(message: string): string {
  return ERROR_MESSAGES_AR[message] ?? message
}

/**
 * Builds a URL with query string params.
 *
 * Example:
 *   buildUrl("/api/users", { page: 1, limit: 10 })
 *   → "/api/users?page=1&limit=10"
 *
 * Undefined values are skipped so optional params work cleanly.
 */
function buildUrl(
  url: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (!params) return url

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `${url}?${queryString}` : url
}

/**
 * Core request function. Handles:
 *  1. URL + query param building
 *  2. Setting Content-Type header when there's a body
 *  3. JSON.stringify for request body
 *  4. Parsing JSON response
 *  5. Throwing ApiError on non-ok responses
 */
async function request<T>(
  url: string,
  config: ApiConfig
): Promise<ApiResponse<T>> {
  const { method, body, params } = config

  const fullUrl = buildUrl(url, params)

  const response = await fetch(fullUrl, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(
      data.error || "حدث خطأ ما",
      response.status,
      data.details
    )
  }

  return data as ApiResponse<T>
}

/**
 * Simple API client with one method per HTTP verb.
 *
 * Usage:
 *   const { data } = await api.get<User[]>("/api/users", { page: 1 })
 *   const { data } = await api.post<User>("/api/users", { name: "Ali" })
 */
export const api = {
  /** GET — use params for query string (?key=value) */
  get: <T>(
    url: string,
    params?: Record<string, string | number | boolean | undefined>
  ) => request<T>(url, { method: "GET", params }),

  /** POST — body is auto-JSON-stringified */
  post: <T>(url: string, body: Record<string, unknown>) =>
    request<T>(url, { method: "POST", body }),

  /** PUT — body is auto-JSON-stringified */
  put: <T>(url: string, body: Record<string, unknown>) =>
    request<T>(url, { method: "PUT", body }),

  /** PATCH — body is auto-JSON-stringified */
  patch: <T>(url: string, body: Record<string, unknown>) =>
    request<T>(url, { method: "PATCH", body }),

  /** DELETE — no body needed */
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
}
