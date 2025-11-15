# TracTok

> TikTok Shop affiliate order tracking and bookkeeping platform

TracTok helps TikTok Shop affiliates track orders from placement through settlement and withdrawal, providing comprehensive insights into earnings and commission data.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Supabase Auth](https://supabase.com/auth)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📋 Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase account
- PostgreSQL database (via Supabase)

## 🛠️ Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd TracTok/tractok
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 3. Database Setup

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# (Optional) Seed database
pnpm prisma db seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

### Development

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking

### Testing

- `pnpm test` - Run unit tests (watch mode)
- `pnpm test:ui` - Open Vitest UI
- `pnpm test:e2e` - Run E2E tests with Playwright
- `pnpm test:e2e:ui` - Open Playwright UI

### Database

- `pnpm prisma studio` - Open Prisma Studio (database GUI)
- `pnpm prisma migrate dev` - Create and apply migrations
- `pnpm prisma generate` - Generate Prisma Client

## 🏗️ Project Structure

```
tractok/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── features/    # Feature-specific components
│   ├── lib/             # Core utilities and configurations
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   └── services/        # Business logic layer
├── prisma/              # Database schema and migrations
├── e2e/                 # Playwright E2E tests
├── __tests__/           # Vitest unit tests
└── public/              # Static assets
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation.

## 🧪 Testing

We follow Test-Driven Development (TDD) practices:

### Unit Tests (Vitest)

```bash
pnpm test
```

- Test business logic, utilities, and calculations
- Located in `__tests__/` directory
- Aim for 80%+ coverage on business logic

### E2E Tests (Playwright)

```bash
pnpm test:e2e
```

- Test complete user journeys
- Located in `e2e/` directory
- Run against local dev server

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Ensure all production environment variables are set:

- Database credentials
- Supabase keys
- TikTok API credentials (Phase 2+)
- Stripe keys (Phase 6+)

## 🔒 Security

- Never commit `.env.local` or `.env` files
- Use environment variables for all sensitive data
- Implement Row Level Security (RLS) in Supabase
- Validate all user inputs with Zod schemas
- Regular security audits with `pnpm audit`

## 📚 Development Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Write tests first (TDD)
3. Implement feature
4. Ensure tests pass: `pnpm test`
5. Check linting: `pnpm lint`
6. Format code: `pnpm format`
7. Commit (pre-commit hooks run automatically)
8. Push and create pull request

## 🤝 Contributing

This is currently a private project. For development questions, refer to:

- [Development Plan](../plan.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Features Roadmap](../features.md)

## 📈 Current Status

**Phase**: 0 - Project Setup ✅

### Completed

- ✅ Next.js 14 with TypeScript (strict mode)
- ✅ Tailwind CSS configured
- ✅ Testing framework (Vitest + Playwright)
- ✅ Git hooks (Husky + lint-staged)
- ✅ Project structure established
- ✅ First test passing

### Next Steps

- Phase 1: Core Infrastructure (Auth, Database, UI)
- Phase 2: TikTok OAuth Integration
- Phase 3: Order Tracking
- See [plan.md](../plan.md) for full roadmap

## 📄 License

Private/Proprietary - All rights reserved

## 💬 Support

For questions or issues during development, contact the project team.

---

**Built with** ❤️ **for TikTok Shop Affiliates**
