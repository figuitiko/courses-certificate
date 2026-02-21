# Consulting Academy

Production-grade MVP for a consulting learning platform built with Next.js App Router, Prisma, PostgreSQL, shadcn-style UI components, and Server Actions.

## Stack

- Next.js (App Router + TypeScript)
- Tailwind CSS
- Prisma + PostgreSQL
- Zod validation
- Server Components by default, client components only for interactive UI

## Features

- Course catalog and course detail pages
- Cookie-based user handle profile (no auth MVP)
- Enrollment + lesson completion tracking
- Points system and auditable points ledger
- Admin mode (cookie toggle) for course, lesson, materials, and point adjustment management

## Routes

- `/` marketing home
- `/courses` catalog
- `/courses/[courseId]` detail
- `/learn/[courseId]` learner view
- `/my-courses` enrollment progress
- `/profile` profile + points ledger
- `/admin` admin dashboard
- `/admin/courses` course management
- `/admin/courses/[courseId]` lesson/material management
- `/admin/users` user + points management

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to your PostgreSQL connection string.

3. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4. Seed sample data:

```bash
npm run prisma:seed
```

5. Start dev server:

```bash
npm run dev
```

## Prisma commands

- `npm run prisma:generate`
- `npm run prisma:migrate -- --name <migration-name>`
- `npm run prisma:seed`

## Deploy (Vercel)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Configure `DATABASE_URL` in project environment variables.
4. Run migration before first production traffic:

```bash
npx prisma migrate deploy
```

5. Deploy.

## Notes

- Use embedded video URLs (e.g., YouTube embed links) for lesson playback.
- Materials are URL-based in MVP (S3/R2/Drive links).
- Admin mode is intentionally lightweight and not secure for production without real authentication.
