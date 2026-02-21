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
- Authentication with Auth.js (credentials + Google OAuth)
- Enrollment + lesson completion tracking
- Points system and auditable points ledger
- Role-based admin access for course, lesson, materials, and point adjustment management

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

1. Configure environment:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to your PostgreSQL connection string.

Also configure auth variables:

- `AUTH_SECRET` (secure random string)
- `AUTH_GOOGLE_ID` (Google OAuth client ID)
- `AUTH_GOOGLE_SECRET` (Google OAuth client secret)

1. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

1. Seed sample data:

```bash
npm run prisma:seed
```

Default local seeded credentials:

- Admin: `admin@consultingacademy.dev` / `admin12345`
- Learner: `learner@consultingacademy.dev` / `learner12345`

1. Start dev server:

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

1. Deploy.

## Notes

- Use embedded video URLs (e.g., YouTube embed links) for lesson playback.
- Materials are URL-based in MVP (S3/R2/Drive links).
- Configure Google OAuth credentials in the provider console for Google sign-in.
