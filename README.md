# University Library Management System

A comprehensive library management system built with Next.js, designed to handle book inventory, borrowing workflows, and user management for university libraries.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** Shadcn/UI + Tailwind CSS 4
- **Database:** Prisma ORM + PostgreSQL
- **Forms:** React Hook Form + Zod validation
- **Tables:** TanStack Table
- **Styling:** Tailwind CSS 4 + CSS Variables
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Theme:** next-themes (Dark/Light mode)
- **Language:** TypeScript

## Features

### Admin

- Manage employee and admin accounts
- View system-wide analytics and reports
- Configure library settings and policies
- Manage book categories and authors
- View all borrowing history and overdue books

### Employee (Librarian)

- Add, edit, and remove books from inventory
- Manage book copies and their status
- Process book rentals and returns
- Search and filter book catalog
- View borrowing history for individual students
- Generate reports on book availability

### Student

- Create and edit their own accounts
- Browse and search book catalog
- View available copies and book details
- Rent books (subject to availability and limits)
- View personal borrowing history
- Track current rentals and due dates

## Project Structure

```
library-management/
├── app/
│   ├── (auth)/          # Authentication routes
│   ├── (dashboard)/     # Dashboard layouts
│   │   ├── admin/       # Admin panel
│   │   ├── employee/    # Employee panel
│   │   └── student/     # Student panel
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── books/           # Book-related components
│   ├── rentals/         # Rental-related components
│   └── dashboard/       # Dashboard components
├── hooks/               # Custom React hooks
├── lib/
│   ├── prisma.ts        # Prisma client
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd library-management
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your database connection in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/library_db"
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Generate Prisma Client:

```bash
npx prisma generate
```

7. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

| Command          | Description                             |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | Start development server with Turbopack |
| `pnpm build`     | Build for production                    |
| `pnpm start`     | Start production server                 |
| `pnpm lint`      | Run ESLint                              |
| `pnpm format`    | Format code with Prettier               |
| `pnpm typecheck` | Run TypeScript type checking            |

## Adding Shadcn Components

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add table
```

## Development Notes

- RTL support is enabled in `components.json`
- Dark/Light theme toggle is available via `next-themes`
- All forms use React Hook Form with Zod validation
- Data tables use TanStack Table for sorting, filtering, and pagination
- Toast notifications use Sonner for user feedback

## License

MIT
