# AGENTS.md — Library Management

## Stack

- **Framework**: Next.js 16 (App Router), Turbopack in dev
- **Auth**: NextAuth v5 beta — Credentials provider, JWT strategy
- **Database**: Prisma 7 + PostgreSQL (`@prisma/adapter-pg`)
- **UI**: Tailwind CSS 4, Shadcn UI (base-nova style, RTL), Lucide icons
- **Forms**: React Hook Form + Zod (Arabic error messages in `lib/validations.ts`)
- **Tables**: TanStack Table
- **PM**: pnpm

## Commands

```sh
pnpm dev          # dev server with Turbopack
pnpm build        # production build
pnpm lint         # ESLint
pnpm format       # Prettier (only .ts/.tsx files)
pnpm typecheck    # tsc --noEmit
pnpm db:seed      # seed DB with sample data (tsx prisma/seed.ts)
```

## Architecture

- **Dual data layer**: both Server Actions (`actions/`) and API routes (`app/api/`) are used. Server Actions are the primary pattern for auth and data mutations.
- **Auth**: `lib/auth.ts` exports `{ auth, handlers, signIn, signOut }`. Session is JWT-based. Types augmented in `types/next-auth.d.ts`.
- **Prisma**: Singleton client in `lib/prisma.ts` using `PrismaPg` adapter. Config in `prisma.config.ts` (Prisma 7 format). Schema at `prisma/schema.prisma`.
- **Path alias**: `@/*` → root.
- **Response envelope**: Server Actions return `ActionResponse<T>` (`types/types.ts`) with `success`, `data?`, `error?`, `message?`, `details?`.
- **Seed**: `pnpm db:seed` creates admin/employee/student users (password: `123123123`), 15+ authors, 12 categories, 20 books with copies, and sample active rentals.

## Conventions

- **RTL Arabic UI**: root layout (`app/layout.tsx`) uses `lang="ar" dir="rtl"`, Noto Sans Arabic font, `DirectionProvider` from Base UI, Sonner Toaster at `top-center`.
- **No semicolons**, double quotes, trailingComma: es5, tabWidth 2. Prettier with `prettier-plugin-tailwindcss`.
- **tsconfig** is deliberately loose: `strict: false`, `noImplicitAny: false`, etc.
- **Zod schemas** in `lib/validations.ts` with Arabic error messages. Re-exported types (`CreateUserFormData`, etc.).
- **Role-based scoping**: admin routes under `(dashboard)/(admin)/`, employee/student in respective dirs. Helper `checkAdmin()` in `lib/helper.ts`.
- **`.env` is gitignored**. Copy `.env.example` → `.env` for local setup (3 vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).

## Database schema (Prisma)

Models: `User`, `Author`, `Category`, `Book`, `BookCopy`, `Rental`. Enums: `Role` (ADMIN/EMPLOYEE/STUDENT), `CopyStatus` (AVAILABLE/RENTED/LOST/DAMAGED), `RentalStatus` (ACTIVE/RETURNED/OVERDUE/LOST). Books have M:N relations with authors and categories. BookCopy has `@@unique([bookId, copyNumber])`.

## Shadcn UI

Add components via `npx shadcn@latest add <name>`. Config in `components.json` (style: base-nova, RTL enabled, `cn` utility at `@/lib/utils`).
