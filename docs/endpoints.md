# API Endpoints

## Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Student self-registration |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Authenticated | Logout |
| GET | `/api/auth/me` | Authenticated | Get current user |
| PATCH | `/api/auth/me` | Authenticated | Update own profile (students) |
| PATCH | `/api/auth/change-password` | Authenticated | Change password |

## Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | List all users (with filters) |
| GET | `/api/users/:id` | Admin | Get user details |
| POST | `/api/users` | Admin | Create employee or admin account |
| PATCH | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Deactivate user |

## Authors

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/authors` | Public | List all authors |
| GET | `/api/authors/:id` | Public | Get author details |
| POST | `/api/authors` | Admin, Employee | Create author |
| PATCH | `/api/authors/:id` | Admin, Employee | Update author |
| DELETE | `/api/authors/:id` | Admin, Employee | Delete author |

## Categories

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | List all categories |
| GET | `/api/categories/:id` | Public | Get category details |
| POST | `/api/categories` | Admin, Employee | Create category |
| PATCH | `/api/categories/:id` | Admin, Employee | Update category |
| DELETE | `/api/categories/:id` | Admin, Employee | Delete category |

## Books

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/books` | Public | List/search books (with filters) |
| GET | `/api/books/:id` | Public | Get book details with copies |
| POST | `/api/books` | Admin, Employee | Create book |
| PATCH | `/api/books/:id` | Admin, Employee | Update book |
| DELETE | `/api/books/:id` | Admin, Employee | Delete book |

## Book Copies

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/books/:bookId/copies` | Admin, Employee | List copies for a book |
| POST | `/api/books/:bookId/copies` | Admin, Employee | Add new copy/copies |
| PATCH | `/api/books/:bookId/copies/:copyId` | Admin, Employee | Update copy status/location |
| DELETE | `/api/books/:bookId/copies/:copyId` | Admin, Employee | Remove a copy |

## Rentals

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/rentals` | All (scoped) | List rentals (students see own, staff see all) |
| GET | `/api/rentals/:id` | All (scoped) | Get rental details |
| POST | `/api/rentals` | Student | Rent a book (by copyId) |
| POST | `/api/rentals/:id/return` | Admin, Employee | Process return |
| PATCH | `/api/rentals/:id` | Admin, Employee | Update rental (mark lost, extend) |
| GET | `/api/rentals/overdue` | Admin, Employee | List all overdue rentals |

## Dashboard / Analytics

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/analytics/overview` | Admin, Employee | System stats (total books, active rentals, overdue) |
| GET | `/api/analytics/popular-books` | Admin, Employee | Most rented books |
| GET | `/api/analytics/student/:id` | Admin, Employee | Student borrowing history |

---

## Design Notes

- **Nested routes** for copies under books (`/api/books/:bookId/copies`) since copies only exist in context of a book
- **Scoped access** on `/api/rentals` — students only see their own, employees/admins see all
- **Public read** on books, authors, categories for catalog browsing
- **Action endpoints** like `/return` use POST for state-changing operations
- **Pagination, filtering, sorting** on all list endpoints via query params
