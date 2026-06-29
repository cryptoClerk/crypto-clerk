# CryptoBooks — Development Checklist

> Working document. Check off items as completed. 
> **Current Phase:** Phase 0 — Foundation
> **Last Updated:** 2026-06-29

---

## Phase 0: Foundation (Week 1)
**Goal:** Project scaffolded, auth working, one chain connected
**Status:** ⬜ Not started

- [ ] **0.1** Create Next.js project (`create-next-app` with TypeScript, App Router, Tailwind)
- [ ] **0.2** Install shadcn/ui and add base components (Button, Input, Card, Dialog, Table)
- [ ] **0.3** Set up Supabase project
  - [ ] Create project at supabase.com
  - [ ] Get `SUPABASE_URL` and `SUPABASE_ANON_KEY`
  - [ ] Add service role key for server-side operations
- [ ] **0.4** Set up Prisma
  - [ ] Install Prisma (`npm install prisma @prisma/client`)
  - [ ] Initialize (`npx prisma init`)
  - [ ] Write schema (copy from `development/architecture.md`)
  - [ ] Run first migration (`npx prisma migrate dev --name init`)
- [ ] **0.5** Set up auth (Supabase Auth or Clerk — pick one)
  - [ ] Email/password sign-up
  - [ ] Email/password login
  - [ ] Logout
  - [ ] Password reset flow
- [ ] **0.6** Connect Etherscan API
  - [ ] Get free API key at etherscan.io
  - [ ] Test: fetch one transaction by hash (`module=proxy&action=eth_getTransactionByHash`)
  - [ ] Test: fetch token transfers (`module=account&action=tokentx`)
  - [ ] Verify data structure matches what we need
- [ ] **0.7** Deploy to Vercel staging
  - [ ] Push repo to GitHub
  - [ ] Connect to Vercel project
  - [ ] Add environment variables
  - [ ] Verify staging URL loads
- [ ] **0.8** 🚪 **Phase 0 Gate**
  - [ ] Etherscan API reliable? (yes/no)
  - [ ] Auth working smoothly? (yes/no)
  - [ ] **Decision:** Go / No-Go to Phase 1

---

## Phase 1: Receipt Generator (Week 2)
**Goal:** No-signup receipt generation works end-to-end
**Status:** ⬜ Blocked — Phase 0 not complete

- [ ] **1.1** Hero page with tx hash input
  - [ ] Clean landing page design (hero section, input field)
  - [ ] Auto-detect chain from tx hash (Ethereum by default, or allow manual override)
- [ ] **1.2** Fetch transaction from Etherscan
  - [ ] API route: `POST /api/receipts/fetch`
  - [ ] Parse ERC-20 transfer (USDC, USDT, DAI) — get `value`, `tokenSymbol`, `from`, `to`, `timeStamp`
  - [ ] Handle edge cases: not found, not a token transfer, failed tx
- [ ] **1.3** Receipt form (client name, description, business info)
  - [ ] Form with validation (Zod)
  - [ ] Pre-fill tx data (readonly)
  - [ ] Optional: save business info to user profile (if logged in)
- [ ] **1.4** PDF generation (client-side)
  - [ ] Create receipt template component (styled HTML)
  - [ ] Use html2canvas + jsPDF to capture and save as PDF
  - [ ] Ensure PDF looks professional (A4 format, branded header)
- [ ] **1.5** Download + save flow
  - [ ] Download button triggers PDF generation
  - [ ] If logged in: save receipt to database
  - [ ] If not logged in: just download, show prompt to save account after 3 receipts
- [ ] **1.6** Free tier limit (5 receipts/month)
  - [ ] Track receipt count per user (or per IP for non-logged-in)
  - [ ] Show remaining count
  - [ ] Gate at 5: show "Sign up for unlimited" CTA
- [ ] **1.7** 🚪 **Phase 1 Gate**
  - [ ] Can generate a receipt in under 30 seconds? (yes/no)
  - [ ] PDF quality acceptable? (yes/no)
  - [ ] **Decision:** Go / No-Go to Phase 2

---

## Phase 2: Statements (Week 3)
**Goal:** Users can generate bank-style statements
**Status:** ⬜ Blocked — Phase 1 not complete

- [ ] **2.1** Wallet management
  - [ ] Add wallet page (paste address + label + select chain)
  - [ ] Save to DB (Wallet model)
  - [ ] List wallets in dashboard
  - [ ] Remove wallet
- [ ] **2.2** Fetch token transfer history
  - [ ] API route: `POST /api/statements/fetch`
  - [ ] Use `tokentx` endpoint for each wallet
  - [ ] Handle pagination (Etherscan returns max 10k records per call)
  - [ ] Support multiple wallets in one request
- [ ] **2.3** USD value lookup
  - [ ] CoinGecko API: historical price for each token on each date
  - [ ] Cache prices to avoid API spam (localStorage or DB)
  - [ ] Fallback: manual override if price unavailable
- [ ] **2.4** Statement generator UI
  - [ ] Date range picker (presets: This Month, Last Month, Q1, Q2, etc. + custom)
  - [ ] Wallet selector (multi-select)
  - [ ] "Generate Statement" button
- [ ] **2.5** Statement PDF template
  - [ ] Bank-style layout: header, date range, wallet list, transaction table, totals
  - [ ] Columns: Date, From/Client, Description, Token Amount, USD Value, Running Balance
  - [ ] Starting/ending balance (single combined total across all wallets)
  - [ ] Option: per-wallet breakdown page for accountants
- [ ] **2.6** CSV export
  - [ ] Generate CSV from same data as PDF
  - [ ] Columns: Date, Tx Hash, From, To, Token, Amount, USD Value, Category, Client Name
  - [ ] Download CSV button
- [ ] **2.7** Save statements to account
  - [ ] Save generated statements to DB
  - [ ] List past statements in dashboard
  - [ ] Re-download past statements
- [ ] **2.8** 🚪 **Phase 2 Gate**
  - [ ] Can generate a full-year statement in under 30 seconds? (yes/no)
  - [ ] USD value accuracy good enough? (yes/no)
  - [ ] **Decision:** Go / No-Go to Phase 3

---

## Phase 3: Launch (Week 4)
**Goal:** Production-ready, ready for users
**Status:** ⬜ Blocked — Phase 2 not complete

- [ ] **3.1** Multi-chain support (Polygon, BSC)
  - [ ] Add PolygonScan API key
  - [ ] Add BscScan API key
  - [ ] Update chain detection logic
  - [ ] Test receipts on Polygon and BSC
- [ ] **3.2** Design polish
  - [ ] Logo + branding (header, favicon, OG image)
  - [ ] Receipt/statement template final design (colors, fonts, logo placement)
  - [ ] Responsive mobile testing (iOS Safari, Android Chrome)
- [ ] **3.3** Landing page
  - [ ] Hero section with demo video/GIF (screen recording of receipt generation)
  - [ ] Features section (3 cards)
  - [ ] Pricing section (Free/Pro/Business)
  - [ ] FAQ section (5-8 questions)
  - [ ] Footer with links (Twitter, GitHub, support email)
- [ ] **3.4** Stripe integration
  - [ ] Create Stripe account
  - [ ] Set up Products + Prices (Pro $19/mo, Business $49/mo)
  - [ ] Checkout flow (Stripe hosted checkout)
  - [ ] Webhooks: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
  - [ ] Update user plan in DB on webhook
- [ ] **3.5** Email setup
  - [ ] Welcome email on signup
  - [ ] Receipt generated confirmation (optional, just a nice touch)
  - [ ] Payment confirmation email (Stripe handles this mostly)
- [ ] **3.6** Analytics
  - [ ] Vercel Analytics enabled
  - [ ] Custom events: receipt_generated, statement_generated, user_upgraded
  - [ ] Setup Google Analytics (optional, Vercel might be enough)
- [ ] **3.7** Help docs
  - [ ] `/help` page or external docs (GitBook/Notion)
  - [ ] How to generate a receipt
  - [ ] How to generate a statement
  - [ ] Supported chains and tokens
  - [ ] Pricing FAQ
- [ ] **3.8** 🚪 **Phase 3 Gate**
  - [ ] Stripe payments working? (yes/no)
  - [ ] Landing page compelling? (yes/no)
  - [ ] **Decision:** Go / No-Go to launch

---

## Phase 4: Post-Launch (Months 2-3)
**Goal:** Iterate, add v2 features, build community
**Status:** ⬜ Blocked — Launch not complete

- [ ] **4.1** Invoice builder (v2)
  - [ ] Create invoice form (line items, client info, due date)
  - [ ] Hosted payment page with QR code
  - [ ] Payment status tracking (poll blockchain for payment tx)
- [ ] **4.2** Auto-categorization agent
  - [ ] Learn from user edits (remember wallet → client mappings)
  - [ ] Suggest categories for new transactions
  - [ ] Bulk categorize UI (select multiple txns, apply category)
- [ ] **4.3** Natural language queries
  - [ ] Search bar: "How much did I make from Nike last quarter?"
  - [ ] Parse intent, query DB, return summary
- [ ] **4.4** API keys for Business tier
  - [ ] Generate API keys in dashboard
  - [ ] Protect all existing endpoints with API key auth
  - [ ] API docs page (`/api-docs`)
- [ ] **4.5** Webhooks
  - [ ] Register webhook URL in settings
  - [ ] Events: payment.received, invoice.paid
  - [ ] Deliver to registered URLs
- [ ] **4.6** Community
  - [ ] Create Discord server for support + community
  - [ ] Post launch thread on Twitter/X
  - [ ] Launch on Product Hunt
  - [ ] Post on Indie Hackers
  - [ ] Post on Reddit (r/ethdev, r/ethfinance, r/freelance)
- [ ] **4.7** 🚪 **Phase 4 Gate**
  - [ ] First 20 paying users? (yes/no)
  - [ ] Churn < 10%? (yes/no)
  - [ ] **Decision:** Continue scaling / pivot features

---

## Quick Reference

| Phase | Name | Status | Gate Cleared |
|-------|------|--------|-------------|
| 0 | Foundation | ⬜ Not started | ⬜ |
| 1 | Receipt Generator | ⬜ Blocked | ⬜ |
| 2 | Statements | ⬜ Blocked | ⬜ |
| 3 | Launch | ⬜ Blocked | ⬜ |
| 4 | Post-Launch | ⬜ Blocked | ⬜ |

**Next unblocked task:** 0.1 — Create Next.js project
