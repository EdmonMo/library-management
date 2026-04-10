# API Patterns Guide

This guide explains how data fetching works in this project and how to add new API endpoints with hooks.

---

## Architecture Overview

```
Component (page.tsx)
    ↓ uses
hooks/use-*.ts          ← TanStack Query hooks
    ↓ uses
lib/api-client.ts       ← Fetch wrapper
    ↓ calls
/api/.../route.ts       ← Next.js API routes
```

---

## Key Concepts

### Query vs Mutation

| Type         | Use for                               | Hook          |
| ------------ | ------------------------------------- | ------------- |
| **Query**    | GET requests (fetching data)          | `useQuery`    |
| **Mutation** | POST/PUT/PATCH/DELETE (changing data) | `useMutation` |

### What You Get for Free

- `isPending` — loading state (replaces `useState(false)`)
- `error` — error message (replaces `useState("")`)
- `data` — the response data
- Auto refetch on window focus (queries)
- Cache (queries)

---

## How to Add a New Feature

### Step 1: Create the API Route

File: `app/api/books/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const books = await prisma.book.findMany()
  return NextResponse.json({ success: true, data: books })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const book = await prisma.book.create({ data: body })
  return NextResponse.json({ success: true, data: book }, { status: 201 })
}
```

### Step 2: Add Validation Schema

File: `lib/validations.ts`

```ts
export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
})

export type CreateBookInput = z.infer<typeof createBookSchema>
```

### Step 3: Create an interface for the returned type

File: `types/types.ts`

```ts
export interface Book {
  id: string
  title: string
  author: string
  createdAt: string
}
```

### Step 4: Create Hooks

File: `hooks/use-books.ts`

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getBooks, createBook } from "@/lib/api/books"
import type { CreateBookInput } from "@/lib/validations"

// Query hook — for GET
export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => api.get<Book[]>("/api/books"),
  })
}

// Mutation hook — for POST
export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBookInput) => api.post<Book>("/api/books", data),
    onSuccess: () => {
      // Refetch the books list after creating
      queryClient.invalidateQueries({ queryKey: ["books"] })
    },
  })
}
```

### Step 5: Use in Component

File: `app/books/page.tsx`

```tsx
"use client"

import { useBooks, useCreateBook } from "@/hooks/use-books"

export default function BooksPage() {
  const { data, isPending, error } = useBooks()
  const createBook = useCreateBook()

  if (isPending) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      {data?.data.map((book) => (
        <div key={book.id}>{book.title}</div>
      ))}

      <button
        onClick={() =>
          createBook.mutate({ title: "New Book", author: "Author" })
        }
      >
        Add Book
      </button>
    </div>
  )
}
```

---

## Quick Reference

### Accessing data from a query

```ts
const { data, isPending, error } = useBooks()
// data?.data  ← your actual array (nested because of ApiResponse<T>)
// isPending   ← boolean
// error       ← error object or undefined
```

### Calling a mutation

```ts
const mutation = useCreateBook()

// With form data:
mutation.mutate({ title: "Book", author: "Author" })

// With async/await:
await mutation.mutateAsync({ title: "Book", author: "Author" })

// With success/error callbacks:
await mutation.mutateAsync(data, {
  onSuccess: () => { /* navigate, toast, etc. */ },
})

// State:
mutation.isPending   // loading
mutation.error       // error object
```

### Invalidate queries (refetch)

```ts
const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey: ["books"] })
```

---

## File Structure

```
lib/
  api-client.ts       ← fetch wrapper (don't edit usually)
  api/
    users.ts          ← API functions for users
    profile.ts        ← API functions for profile
    auth.ts           ← API functions for auth
    books.ts          ← add new ones here

hooks/
  use-users.ts        ← hooks for users
  use-profile.ts      ← hooks for profile
  use-auth.ts         ← hooks for auth
  use-books.ts        ← add new ones here
```
