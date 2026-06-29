# CryptoBooks — TODOs for Real Account Setup

## Accounts Needed (in order of priority)

### 1. Supabase (Required for auth + DB)
- **URL:** https://supabase.com
- **What to create:** Free tier project
- **What to copy to me:**
  - `SUPABASE_URL` (looks like `https://xxxxxx.supabase.co`)
  - `SUPABASE_ANON_KEY` (long public key)
  - `SUPABASE_SERVICE_ROLE_KEY` (secret key, for server-side)
- **Where to put it:** `.env.local` file in `frontend/`
- **What I'll do:** Replace SQLite with PostgreSQL, swap mock auth for Supabase Auth, update Prisma schema connection
- **Time estimate:** 5 minutes of copy-paste

### 2. Etherscan (Required for real blockchain data)
- **URL:** https://etherscan.io/register
- **What to create:** Free account, then API key
- **What to copy to me:** `ETHERSCAN_API_KEY`
- **Where to put it:** `.env.local`
- **What I'll do:** Uncomment `EtherscanProvider` in `src/lib/services/blockchain.ts`, swap `MockProvider` for `EtherscanProvider` in one config line
- **Time estimate:** 3 minutes of copy-paste
- **Same account gives you:** PolygonScan, BscScan, Arbiscan, Optimistic Etherscan keys (same login, different API keys)

### 3. Vercel (Required for deployment)
- **URL:** https://vercel.com
- **What to create:** Account (sign up with GitHub)
- **What to copy to me:** Nothing, just connect the GitHub repo in Vercel UI
- **What I'll do:** Add all env vars to Vercel project settings, verify deploy
- **Time estimate:** 10 minutes of clicking

### 4. Stripe (Required for payments — Phase 3)
- **URL:** https://stripe.com
- **What to create:** Account + Products (Pro $19/mo, Business $49/mo)
- **What to copy to me:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **When needed:** Phase 3 (Week 4), not before
- **Time estimate:** 15 minutes of setup

### 5. CoinGecko (Optional — for USD price lookup)
- **URL:** https://www.coingecko.com/en/api
- **What to create:** Free account + API key
- **What to copy to me:** `COINGECKO_API_KEY`
- **When needed:** Phase 2 (statements with USD values), or use free tier without key
- **Time estimate:** 5 minutes

---

## Migration Steps (When You Have Keys)

### Supabase Migration (Phase 0 → Phase 0)
1. Create Supabase project
2. Get connection string from Settings → Database → Connection String (URI)
3. Update `prisma/schema.prisma` datasource to PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
4. Update `prisma.config.ts` with Supabase connection URL
5. Run `npx prisma migrate dev` (re-apply schema to Postgres)
6. Update auth: swap mock auth for Supabase Auth in `src/lib/auth.ts`
7. Test: sign up, log in, create wallet

### Etherscan Migration (Phase 0 → Phase 0)
1. Add `ETHERSCAN_API_KEY` to `.env.local`
2. Update `src/lib/services/blockchain.ts`:
   ```typescript
   const provider = createProvider("ethereum", process.env.ETHERSCAN_API_KEY);
   ```
3. Or better: create a config file that selects provider based on env
4. Test: paste real tx hash, see if it fetches from real blockchain

---

## Local Dev Without Any Accounts (Current State)

✅ **What works now:**
- Next.js app running on `localhost:3000`
- SQLite database with all tables (User, Wallet, Receipt, Statement, Invoice, ApiKey)
- Mock blockchain data (3 sample transactions)
- Mock auth (dev mode, no real login needed)
- Receipt generation UI (hero page, form, PDF preview)
- Statement generation (date range, wallet selection, PDF generation)

❌ **What won't work yet:**
- Real blockchain data (no Etherscan API key)
- Real user accounts (no Supabase auth)
- Cloud deployment (no Vercel account)
- Payments (no Stripe account)

---

## Estimated Time to "Real Everything"

- **Supabase:** 5 minutes (create project + copy 3 keys)
- **Etherscan:** 3 minutes (create account + copy 1 key)
- **Vercel:** 10 minutes (connect repo + add env vars)
- **Stripe:** 15 minutes (Phase 3, not needed now)
- **Total time needed from you:** ~20 minutes (when you're ready)
- **My time to plug in + test:** ~30 minutes per service

## One-Sitting Option

When you have 30 minutes, we can do all three (Supabase + Etherscan + Vercel) in one session. I guide you through each, you copy-paste keys, I plug them in and verify everything works.
