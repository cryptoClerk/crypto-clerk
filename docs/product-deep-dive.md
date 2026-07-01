# CryptoBooks — Product Deep Dive

**Date:** 2026-07-01
**Products:** Receipts, Statements, Invoices
**Goal:** Understand each product deeply — customer, problem, mechanics, friction, moat

---

## 🧾 PRODUCT 1: RECEIPTS

### What It Is
Turn a blockchain transaction hash into a professional PDF receipt. Like a grocery receipt, but for crypto payments.

### Customer Profile
**Primary:** Freelancers/contractors who GET PAID in crypto
- Web3 developers, designers, consultants
- International workers avoiding wire fees
- DeFi/natives who live on-chain

**Secondary:** Payers who SEND crypto and want documentation
- Companies paying international contractors
- DAOs distributing grants
- Clients who need proof-of-payment for their own accounting

### Problem Solved
**"I got paid in USDC but I have no receipt for my accountant."**

When you're paid in crypto:
- No employer generates a W-2 or 1099
- The blockchain has the record, but it's raw, technical, and scary to an accountant
- You need something that looks like a traditional receipt for tax filing, expense reports, or proof of income

**Current alternatives:**
- Screenshot Etherscan (ugly, unprofessional)
- Manual spreadsheet (time-consuming, error-prone)
- Nothing (audit risk, can't prove income)

### How It Works (Technical)
1. User pastes Ethereum tx hash (0x...)
2. App queries Etherscan API V2 → fetches transaction details
3. Parses: from, to, amount, token (USDC/USDT/DAI), timestamp, gas fees
4. Formats into professional PDF template
5. User downloads/prints/shares PDF

**Input:** One tx hash
**Output:** One PDF receipt
**Time:** ~3 seconds

### Friction Points & Solutions

| Friction | How We Lower It |
|----------|-----------------|
| Finding tx hash | Auto-detect from connected wallet (future) |
| Understanding "what is a tx hash" | Simple help text + examples |
| Different chains (ETH, Polygon, etc.) | Auto-detect chain from hash |
| Accountant doesn't understand crypto | Professional PDF looks like traditional receipt |
| Multiple receipts to manage | Dashboard saves history (with auth) |

### Moat
**Weak right now:** Anyone can build this. It's a PDF generator + API call.

**How we strengthen it:**
- **Speed:** 3 seconds from hash to PDF
- **Accuracy:** Direct from blockchain, no manual entry errors
- **Multi-chain:** One tool for ETH, Polygon, BSC, Arbitrum, Optimism
- **History:** Save receipts to account, search/filter later
- **Integrations:** Soon connect wallet → auto-import all your receipts

---

## 📊 PRODUCT 2: STATEMENTS

### What It Is
Generate a bank-style statement from a crypto wallet address over a date range. Like a Chase bank statement, but for your MetaMask.

### Customer Profile
**Primary:** Freelancers who need INCOME VERIFICATION
- Applying for apartment (landlord wants bank statement)
- Applying for loan (bank wants proof of income)
- Tax season (accountant wants organized records)
- Visa/immigration (need proof of funds)

**Secondary:** Businesses doing crypto payroll
- Need to show payment history to auditors
- Compliance reporting
- Reconciliation

### Problem Solved
**"I earned $50k in USDC this year but I have no bank statement to show my landlord."**

Traditional banks give you monthly statements automatically. Crypto wallets don't.

**The gap:**
- Your wallet has 200 transactions across 5 chains
- Your accountant wants it organized by month with running balance
- Your landlord wants a simple PDF showing regular income
- You don't want to manually copy-paste from Etherscan

**Current alternatives:**
- Manual spreadsheet (8+ hours of work)
- Etherscan CSV export (only one chain, messy formatting)
- Koinly/CoinTracker (expensive, complex, built for traders not freelancers)

### How It Works (Technical)
1. User inputs wallet address + date range (e.g., Jan 1 - Mar 31, 2026)
2. App queries Etherscan API for ALL token transfers to that address
3. Filters by date range
4. Calculates: incoming total, outgoing total, net balance, running total
5. Generates multi-page PDF:
   - Cover page: Summary (total in, total out, net)
   - Transaction pages: Date, from, to, amount, token, running balance
   - Footer: Page numbers, generated date

**Input:** Wallet address + date range
**Output:** Multi-page PDF statement
**Time:** ~10-30 seconds (depends on tx count)

### Friction Points & Solutions

| Friction | How We Lower It |
|----------|-----------------|
| Multiple wallets across chains | Aggregate all chains into one statement |
| Privacy (showing wallet address) | Option to redact address, show only tx details |
| Mixed tokens (USDC, USDT, ETH) | Normalize to USD values, show both native + USD |
| Gas fees don't matter for income | Filter option: show only incoming, hide gas |
| Date range confusion | Presets: "Last 30 days", "This year", "Last quarter" |
| Huge wallets (10k+ txs) | Paginate, or offer "Summary only" mode |

### Moat
**Stronger than receipts:** This is genuinely hard to build well.

**Our advantages:**
- **Multi-chain aggregation:** Most tools do one chain. We do 5+.
- **Professional formatting:** Bank-style, not spreadsheet-style
- **Freelancer-focused:** Built for income verification, not trading P&L
- **Speed:** What takes 8 hours manually takes 30 seconds here
- **Accuracy:** Blockchain data, no manual entry
- **Customization:** Date ranges, token filters, address redaction

**Competitors:**
- Koinly ($79+/year, trader-focused)
- CoinTracker ($59+/year, complex tax reports)
- Manual spreadsheets (free, time-consuming)

**Our angle:** Simple, fast, freelancer-specific. Not a tax tool. An income proof tool.

---

## 🧾 PRODUCT 3: INVOICES

### What It Is
Create a professional invoice, send to client, they pay in crypto, receipt auto-generated. Like FreshBooks/PayPal invoices, but for crypto.

### Customer Profile
**Primary:** Freelancers who BILL clients in crypto
- Web3 consultants billing DAOs
- International contractors avoiding wire fees
- Devs who prefer USDC over bank transfers

**Secondary:** Small businesses accepting crypto
- Crypto-native agencies
- Web3 startups paying contractors

### Problem Solved
**"I want to bill my client $5,000 in USDC but I don't want to just DM them my wallet address."**

Professional invoicing is expected in business:
- Looks legit to clients (not a sketchy wallet address in a text)
- Clear payment terms (due date, late fees)
- Line items (what they're paying for)
- Automatic receipt generation (no extra step after payment)
- Payment tracking (who paid, who hasn't)

**Current alternatives:**
- FreshBooks + manual crypto payment instructions (clunky)
- PayPal (high fees, doesn't support crypto)
- Just sending wallet address (unprofessional, no tracking)
- Request Network (complex, requires client to use specific tool)

### How It Works (Technical)

**Flow 1: Create → Send → Pay → Receipt (MVP)**
1. Freelancer creates invoice:
   - Client name, email
   - Line items (description, quantity, rate)
   - Due date
   - Payment instructions (wallet address, preferred chain)
2. Share invoice link with client
3. Client pays to wallet address
4. Freelancer pastes tx hash → auto-generates receipt
5. Mark invoice as "paid"

**Flow 2: Create → Pay → Auto-Receipt (Future)**
1. Freelancer creates invoice with unique payment address
2. Client pays to that address
3. Webhook detects payment → auto-mark as paid → auto-generate receipt

**Input:** Invoice details (client, line items, amount)
**Output:** Shareable invoice page + PDF + receipt after payment
**Time:** ~2 min to create, instant after payment

### Friction Points & Solutions

| Friction | How We Lower It |
|----------|-----------------|
| Client doesn't know how to pay in crypto | Clear payment instructions + "How to pay" guide |
| Trust issues (is this legit?) | Professional branded invoice page |
| Exchange rate volatility | Lock rate at invoice creation, show USD equivalent |
| "Did they pay yet?" | Manual "mark as paid" now, auto-detection later |
| Multiple invoices to track | Dashboard with status (draft, sent, paid, overdue) |
| Recurring invoices (monthly retainer) | "Duplicate last invoice" button, then full automation |

### Moat
**Strongest product — network effects possible:**

**Our advantages:**
- **Payment→Receipt in one flow:** No other tool does this seamlessly
- **Professional without complexity:** Not Request Network (too complex)
- **Crypto-native:** Not PayPal/Stripe pretending to support crypto
- **Lower fees:** No 3% processing fee (just gas, which is pennies on L2s)

**Viral potential:**
- Freelancer sends invoice to client
- Client sees CryptoBooks invoice → learns about tool
- Client might use it for their own contractors

**Lock-in:**
- Invoice history
- Client database
- Recurring invoice templates
- Payment tracking

---

## 🎯 HOW THE 3 PRODUCTS CONNECT

```
INVOICE → PAYMENT → RECEIPT → STATEMENT
   │         │         │          │
   │         │         │          └── "All my income this quarter"
   │         │         └───────────── "Proof I got paid for this job"
   │         └─────────────────────── "Here's my wallet address"
   └───────────────────────────────── "Please pay me $5,000"
```

**The flywheel:**
1. Freelancer creates INVOICE → sends to client
2. Client pays → freelancer gets tx hash → generates RECEIPT
3. At tax time → generates STATEMENT from all receipts
4. All 3 live in one dashboard → full financial picture

**The customer journey:**
- **First use:** Receipt (I got paid, I need proof) — easiest entry
- **Second use:** Statement (tax time, need organized records)
- **Third use:** Invoice (next project, want to look professional)
- **Retention:** All history in one place, can't easily switch

---

## 🏗️ TECHNICAL ARCHITECTURE (All 3)

```
Frontend (Next.js)
├── Receipt Form → API /transactions/fetch → PDF
├── Statement Form → API /statements/generate → PDF
└── Invoice Form → DB save → Shareable link → Payment → Receipt

API Layer
├── /transactions/fetch → Etherscan V2 API → Parse → JSON
├── /statements/generate → Etherscan V2 API → Aggregate → PDF
└── /invoices/* → Prisma/Supabase → CRUD

Data Layer
├── Supabase (auth, users, invoices, wallets)
└── Etherscan (blockchain data, no storage)

PDF Generation
├── Template engine (PDFKit or similar)
├── Professional styling (logo, colors, fonts)
└── Download/print/share
```

---

## 💰 PRICING STRATEGY (Hypothesis)

**Free Tier:**
- 5 receipts/month
- 1 statement/month
- 3 invoices/month
- Basic templates

**Pro ($19/month):**
- Unlimited receipts
- Unlimited statements
- 20 invoices/month
- Custom branding (logo, colors)
- CSV export
- Priority support

**Business ($49/month):**
- Unlimited everything
- Team members (5 seats)
- API access
- Webhooks (auto-payment detection)
- White-label invoices
- Dedicated support

**Why this pricing:**
- Koinly is $79/year (but complex, trader-focused)
- FreshBooks is $15/month (but no crypto)
- We split the difference: simpler than Koinly, cheaper than alternatives

---

## 🚀 WHAT TO BUILD FIRST

**Phase 0 (Now):** Receipts MVP — working, tested, live
**Phase 1 (This week):** Statements MVP — date range + PDF
**Phase 2 (Next week):** Invoices MVP — create, share, mark paid
**Phase 3 (Later):** Auth + Stripe + polish

**Why this order:**
1. Receipts = easiest to understand, fastest to test
2. Statements = natural next step (tax season, income proof)
3. Invoices = highest value, but most complex

---

## ❓ OPEN QUESTIONS

1. Should we support non-stablecoins? (ETH, BTC with USD conversion)
2. How do we handle privacy? (Wallet addresses are public, but users might not know that)
3. Do we need a mobile app? (Probably not MVP — web is fine)
4. Should we integrate with accounting software? (QuickBooks, Xero — Phase 4)
5. What about L2s? (Base, zkSync — Etherscan V2 supports 60+ chains)

---

*This is a living document. Update as we learn more about customers.*
