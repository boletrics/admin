# Boletrics Admin Dashboard

The **Admin Dashboard** is the platform administration interface for Boletrics, built with [Next.js](https://nextjs.org/) and deployed on [Cloudflare Workers](https://workers.cloudflare.com/) via [OpenNext](https://opennext.js.org/).

## Overview

This application provides system administrators with tools to manage and monitor the Boletrics ticketing platform, including:

- **Platform Health Monitoring** - Real-time system health status and infrastructure monitoring
- **Tenant Management** - Organization oversight, approval, and suspension controls
- **User Management** - Platform-wide user administration
- **Analytics & Reporting** - Revenue analytics, platform metrics, and usage statistics
- **Support Tickets** - Customer support ticket management
- **Infrastructure Management** - Database, API, and CDN monitoring
- **Access Control** - Admin user roles and permissions
- **Region Management** - Geographic region configuration

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: Zustand + Nanostores
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Authentication**: Better Auth integration
- **Testing**: Vitest + React Testing Library
- **Visual Testing**: Storybook
- **Deployment**: Cloudflare Workers via OpenNext

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3003](http://localhost:3003) to view the dashboard.

## Available Scripts

| Command             | Description                                    |
| :------------------ | :--------------------------------------------- |
| `pnpm dev`          | Start development server on port 3003          |
| `pnpm build`        | Build for production                           |
| `pnpm preview`      | Preview production build locally               |
| `pnpm deploy`       | Build and deploy to Cloudflare Workers         |
| `pnpm lint`         | Run ESLint                                     |
| `pnpm format`       | Format code with Prettier                      |
| `pnpm format:check` | Check code formatting                          |
| `pnpm typecheck`    | Run TypeScript type checking                   |
| `pnpm test`         | Run tests with coverage                        |
| `pnpm test:watch`   | Run tests in watch mode                        |
| `pnpm storybook`    | Start Storybook on port 6006                   |
| `pnpm ci:check`     | Run all CI checks (format, lint, types, tests) |

## Project Structure

```
admin/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin routes (analytics, health, tenants, etc.)
│   │   └── page.tsx            # Dashboard home
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities, stores, and API clients
│   ├── stories/                # Storybook stories
│   └── test/                   # Test utilities
├── public/                     # Static assets
└── wrangler.jsonc              # Cloudflare Workers configuration
```

## Related Services

- **auth-svc** - Authentication backend service
- **tickets-svc** - Ticketing backend service (admin reads platform metrics)
- **partner** - Organization dashboard (for event organizers)
- **tickets** - Customer-facing ticketing portal
- **auth** - Authentication frontend
