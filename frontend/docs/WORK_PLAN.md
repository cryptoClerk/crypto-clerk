# CryptoBooks — Independent Work Plan

**Status:** Awaiting approval before any code changes  
**Estimated time:** 1.5–2 hours of work  
**Blockers:** None — all work below can be done without user interaction, VPN access, or account credentials

---

## 1. Clean Up Stale TODOs & Comments (5 min)

**What:** Remove or update 11 outdated TODO/FIXME comments across the codebase.

**Why:** Several say things like "Replace with real Etherscan API" but we already did that. Others are misleading. Cleaning these up makes the codebase look professional and prevents confusion for future contributors.

**Files to touch:**
- `src/data/mockBlockchain.ts` — Remove "Replace with real Etherscan API" (already done)
- `src/lib/auth.ts` — Clarify that IP auth is intentional for MVP, not a temporary hack
- `src/lib/logger.ts` — Keep Sentry TODO but reword as "Optional: add Sentry in production"
- `src/lib/rate-limit.ts` — Keep Redis note but reword as "Future: Redis for multi-instance scaling"
- `src/app/api/receipts/route.ts` — Keep CoinGecko TODO (still valid)
- `src/app/api/transactions/fetch/route.ts` — Same
- `src/app/api/statements/generate/route.ts` — Same
- `src/app/api/wallets/route.ts` — Clarify auth note

**Deliverable:** Cleaner codebase with accurate, honest comments.

---

## 2. Add Basic Test Suite (20 min)

**What:** Write unit tests for the most critical paths — the ones that break, users notice immediately.

**Why:** Currently zero tests exist. One broken API change would only be discovered when a user hits it. Tests catch regressions before deploy.

**What to test:**
- Wallet address validation (regex)
- Transaction hash validation (regex)
- Rate limiter logic (counting, resetting, headers)
- USD value calculation (stablecoin vs. non-stablecoin detection)
- CSV escaping (comma, quote, newline handling)
- IP extraction from request headers
- `calculateUsdValue()` helper

**What NOT to test:**
- Database queries (need real DB connection, blocked by VPN)
- Etherscan API calls (would hit rate limits, need mock)
- UI components (needs browser env, heavier setup)

**Test framework:** Jest (already available via Next.js, no new deps)

**Deliverable:** `src/lib/__tests__/` folder with passing tests for all utility functions.

---

## 3. Supabase Auth Scaffolding (15 min)

**What:** Write the full auth system code so it's ready to plug in Supabase keys.

**Why:** When you eventually get Supabase auth keys, this will be a 2-minute hookup instead of hours of writing. The auth is the biggest remaining architectural piece for real users.

**What to write:**
- `src/lib/supabase.ts` — Client/server Supabase init (ready for env vars)
- `src/lib/auth.ts` — Upgrade `requireAuth()` to check Supabase session when available, fall back to IP-based when not
- `src/components/auth/AuthModal.tsx` — Sign up / Sign in modal with email+password
- `src/components/auth/UserMenu.tsx` — Header dropdown for authenticated user (name, logout)
- `src/app/auth/callback/route.ts` — OAuth callback handler (for GitHub login)
- `src/middleware.ts` — Route protection (redirect unauthenticated users to login)

**What to leave as TODO (for later, with your keys):**
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` env vars (you'll add these to Render)
- OAuth providers (GitHub, Google) — only email/password for now
- Password reset flow

**Deliverable:** Complete auth layer that does nothing without env vars, but works instantly once they're added.

---

## 4. Update README.md (10 min)

**What:** Write a proper README that makes the project look professional and helps anyone (including future you) set it up.

**Why:** Current README is a generic Next.js scaffold. A real README reduces onboarding friction, looks good to investors/contributors, and serves as documentation.

**Sections to add:**
- What is CryptoBooks (one sentence)
- Features list (receipts, statements, invoices, multi-chain)
- Screenshots (use existing ones in repo)
- Tech stack (Next.js, Prisma, PostgreSQL, Tailwind, shadcn)
- Setup instructions (clone, install, env vars, run)
- Environment variables reference (all keys needed, where to get them)
- Deployment guide (Render or Vercel)
- Project structure (explain `frontend/` layout)
- API documentation (list endpoints, methods, params)
- Contributing / roadmap (link to docs/)

**Deliverable:** Professional README that replaces the generic one.

---

## 5. Code Quality Fixes (10 min)

**What:** Small cleanups that don't change functionality but reduce future bugs.

**Why:** Defensive programming. These catch edge cases before users hit them.

**Items:**
- Add input length limits (txHash 66 chars, wallet address 42 chars, client name 100 chars)
- Add stricter Zod validation (e.g., date format checking, prevent empty strings after trim)
- Add fallback for missing `NEXT_PUBLIC_` env vars (some client-side code might need them)
- Ensure all API routes return consistent error shapes (`{ error: string }`)
- Add `try/catch` around any remaining unguarded `JSON.parse()` calls
- Add `@ts-expect-error` comments where TypeScript is intentionally bypassed, with explanation

**Deliverable:** Defensive code, consistent error handling, no silent failures.

---

## 6. Stripe Integration Scaffolding (15 min)

**What:** Write the complete Stripe payment system code so it works instantly when keys are added.

**Why:** When you eventually get Stripe keys (Phase 3), this will be a 2-minute hookup instead of hours of writing. The checkout flow, subscription checking, and webhook handling are the biggest pieces of the payment system.

**What to write:**
- `src/lib/stripe.ts` — Stripe client init (server-side, ready for env vars)
- `src/lib/subscription.ts` — Check user's tier (free/pro/business), feature gates
- `src/app/api/stripe/checkout/route.ts` — Create checkout session for Pro/Business
- `src/app/api/stripe/webhook/route.ts` — Handle Stripe webhook events (subscription created, updated, cancelled)
- `src/app/api/stripe/portal/route.ts` — Redirect to Stripe Customer Portal for billing management
- `src/components/pricing/PricingCard.tsx` — Pricing cards with "Subscribe" buttons (3 tiers)
- `src/components/pricing/UpgradeModal.tsx` — Modal shown when free tier hits limits

**What to leave as TODO (for later, with your keys):**
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` env vars (you'll add to Render)
- Stripe product/price IDs for Pro ($19/mo) and Business ($49/mo)
- Webhook endpoint URL (your Render URL + `/api/stripe/webhook`)

**Deliverable:** Complete payment system that does nothing without keys, but works instantly once they're added.

---

## 7. API Documentation (10 min)

**What:** Write a standalone API reference document documenting all endpoints.

**Why:** A dedicated API docs file is easier to reference than scrolling through README. Useful for future mobile apps, integrations, or third-party developers.

**What to document:**
- All `/api/*` endpoints with:
  - HTTP method
  - Request body schema (with example)
  - Response schema (success + error)
  - Rate limits
  - Auth requirements (if any)
- Rate limiting headers explanation
- Error code reference (400, 429, 500, etc.)
- Pagination format for list endpoints

**Deliverable:** `docs/API_REFERENCE.md` with full endpoint documentation.

---

## 8. Performance / DX Improvements (10 min)

**What:** Small wins that make the app faster and nicer to work on.

**Items:**
- Add `next.config.ts` `images.remotePatterns` if we ever use external images
- Add `robots.txt` and `sitemap.xml` improvements (already exists, just verify)
- Add a `manifest.json` for PWA support (minimal effort, makes it installable on phones)
- Add `loading.tsx` files for dashboard routes (skeleton UI while data loads)
- Add `not-found.tsx` (better 404 page)

**Deliverable:** Faster perceived performance, better UX edge cases.

---

## Order of Execution

1. **Clean TODOs** (5 min) → Clear mental model
2. **Write tests** (20 min) → Safety net before changing auth code
3. **Supabase auth scaffolding** (15 min) → Biggest architectural piece
4. **Update README** (10 min) → Documentation while code is fresh in memory
5. **Code quality fixes** (10 min) → Defensive cleanup
6. **Stripe scaffolding** (15 min) → Payment system ready for keys
7. **API documentation** (10 min) → Reference for developers
8. **Performance/DX** (10 min) → Polish

**Total:** ~1 hour 35 minutes of focused work.

---

## What Will NOT Be Done (Blocked)

- ❌ Database migration (Supabase tables don't exist — needs VPN or your local machine)
- ❌ Real user auth testing (needs Supabase keys)
- ❌ Real blockchain testing on live site (needs DB + deployed app)
- ❌ Stripe testing (needs Stripe account + keys)
- ❌ CoinGecko integration (needs API key)
- ❌ Any deployment changes (Render already deployed, DB is the blocker)

---

## After Approval

Once you approve this plan, I will:
1. Execute each item in order
2. Commit after each major section (clean TODOs, tests, auth, README, quality, stripe, API docs, DX)
3. Push to GitHub after each commit so you can see progress
4. Report back when complete with a summary of what was done

**Next step after this work:** You'll need to run the database migration (or provide VPN access / SQL Editor access) so the app actually works end-to-end. Then we can test auth and blockchain together.

---

**Approval needed:** Reply "approved" or "go" and I'll start immediately. Reply with edits/questions if you want changes.
