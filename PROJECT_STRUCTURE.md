# TracTok Project Structure

## Overview

This document explains the organization of the TracTok codebase following Next.js 14 App Router best practices.

## Directory Structure

```
tractok/
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── api/               # API route handlers
│   │   ├── (auth)/            # Auth-related pages (login, register)
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI components (shadcn/ui)
│   │   └── features/          # Feature-specific components
│   │
│   ├── lib/
│   │   ├── utils/             # Utility functions
│   │   ├── validations/       # Zod validation schemas
│   │   ├── supabase/          # Supabase client and utilities
│   │   ├── prisma/            # Prisma client and utilities
│   │   └── env.ts             # Environment variable validation
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── services/              # Business logic and data access
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
│
├── e2e/                       # Playwright E2E tests
├── __tests__/                 # Vitest unit tests
└── public/                    # Static assets

```

## Folder Purposes

### `src/app/`

Next.js 14 App Router directory. Each folder represents a route:

- **API routes**: `app/api/[endpoint]/route.ts`
- **Pages**: `app/[route]/page.tsx`
- **Layouts**: `app/[route]/layout.tsx`
- **Loading states**: `app/[route]/loading.tsx`
- **Error boundaries**: `app/[route]/error.tsx`

### `src/components/`

React components organized by type:

- **`ui/`**: Low-level, reusable UI components (buttons, inputs, cards, etc.)
  - Will contain shadcn/ui components
  - Should be generic and reusable across features
- **`features/`**: Feature-specific components (OrderTable, EarningsChart, etc.)
  - Business logic components
  - Composed of ui components

### `src/lib/`

Core library code and utilities:

- **`utils/`**: Helper functions (date formatting, calculations, etc.)
- **`validations/`**: Zod schemas for form validation and API requests
- **`supabase/`**: Supabase client configuration and auth helpers
- **`prisma/`**: Prisma client singleton and query helpers

### `src/hooks/`

Custom React hooks for reusable logic:

- Data fetching hooks (with React Query)
- Auth hooks (`useUser`, `useSession`)
- Feature-specific hooks (`useOrders`, `useEarnings`)

### `src/types/`

TypeScript type definitions:

- Shared types used across the application
- Database types (generated from Prisma)
- API response types

### `src/services/`

Business logic and data access layer:

- Repository pattern implementations
- Service classes for complex operations
- TikTok API integration logic

### `prisma/`

Database-related files:

- **`schema.prisma`**: Database schema definition
- **`migrations/`**: Database migration files

### `e2e/`

End-to-end tests using Playwright:

- User flow tests (registration, login, order viewing, etc.)
- Integration tests across multiple pages

### `__tests__/`

Unit tests using Vitest:

- Component tests
- Business logic tests (calculations, validations)
- Utility function tests

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `OrderTable.tsx`, `Button.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `calculateCommission.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useOrders.ts`)
- **Types**: PascalCase (e.g., `Order.ts`, `User.ts`)

### Imports

Use absolute imports with `@/` alias:

```typescript
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { cn } from "@/lib/utils";
```

## Best Practices

1. **Separation of Concerns**: Keep components, logic, and data access separate
2. **Composition**: Build complex components from simpler ones
3. **Reusability**: Write generic components in `ui/`, specific ones in `features/`
4. **Type Safety**: Use TypeScript strictly, leverage Zod for runtime validation
5. **Testing**: Co-locate tests with code or use `__tests__/` for unit tests
6. **Server vs Client**: Use Server Components by default, Client Components when needed

## Development Workflow

1. **Create feature branch**: `git checkout -b feature/order-tracking`
2. **Define types**: Add TypeScript types in `src/types/`
3. **Create validation schemas**: Add Zod schemas in `src/lib/validations/`
4. **Write tests**: Create tests in `__tests__/` (TDD approach)
5. **Implement business logic**: Add services in `src/services/`
6. **Build UI**: Create components in `src/components/`
7. **Create pages**: Add routes in `src/app/`
8. **Run tests**: `pnpm test`
9. **E2E tests**: Add in `e2e/` and run with `pnpm test:e2e`
10. **Commit and push**: Tests run automatically via Husky pre-commit hook

---

_This structure will evolve as we build TracTok. Keep this document updated!_
