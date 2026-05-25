# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build
npm run lint     # eslint check
```

No test suite is configured.

## Architecture

SuccessionIQ is a Next.js 16 App Router application — a marketplace for buying, selling, and AI-valuing businesses. All source lives at the project root (no `src/` directory).

### Key directories

- `app/` — pages and API routes using App Router conventions
- `components/` — shared UI (`Nav.tsx`, `NavAuth.tsx`)
- `lib/` — Supabase client factories and shared TypeScript types
- `supabase/migrations/` — SQL migrations applied manually via Supabase dashboard or CLI

### Data layer

Supabase is the database and auth provider. Two client factories exist because Next.js App Router requires different clients for server vs. browser contexts:

- `lib/supabase-server.ts` — `createSupabaseServerClient()` — async, reads cookies via `next/headers`; use in Server Components and Route Handlers
- `lib/supabase-browser.ts` — `createSupabaseBrowserClient()` — sync, for Client Components
- `lib/supabase.ts` — legacy/alternate client (check before using; prefer the above two)

All tables have RLS enabled. Key tables: `listings`, `valuations`, `profiles`, `brokers`. A Postgres trigger auto-creates a `profiles` row on user signup.

### User roles

Three roles defined in `lib/types.ts`: `seller`, `buyer`, `broker`. Role is stored on `profiles.role`. Broker-specific routes (e.g. `/broker/bulk-upload`) verify `profiles.role === 'broker'` server-side before proceeding.

### AI routes

All Claude calls go through Next.js Route Handlers in `app/api/`:

| Route | Model | Purpose |
|---|---|---|
| `/api/valuate` | `claude-opus-4-5` | Business valuation — returns structured JSON (low/mid/high range, method, risks) |
| `/api/generate-description` | `claude-opus-4-7` | Single listing description generation |
| `/api/broker/bulk-upload` | `claude-sonnet-4-6` | Bulk CSV listing upload with parallel description generation |

All AI routes use prompt caching (`cache_control: { type: "ephemeral" }`) on the system prompt. The valuation route has a JSON-fix retry loop if the model returns malformed JSON.

### Styling

Tailwind CSS v4 — uses `@import "tailwindcss"` in `globals.css` (no `tailwind.config.*` file). Fonts are Hanken Grotesk (sans) and Geist Mono, loaded via `next/font/google`.

### Auth flow

Supabase Auth with cookie-based sessions (`@supabase/ssr`). Auth pages live under `app/auth/` (login, signup, forgot-password, reset-password, callback). The callback page at `/auth/callback` handles the OAuth/magic-link exchange.

### Environment variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```
