# CryptoBooks

Generate professional receipts, bank-style statements, and invoices from your blockchain transactions. No more Etherscan screenshots.

![Homepage](screenshot-homepage.png)

## Features

- **Receipt Generator** — Paste a tx hash, add client details, download a PDF
- **Statements** — Multi-wallet, date-range, CSV export, bank-style PDF
- **Multi-Chain** — Ethereum, Polygon, BSC, Arbitrum, Optimism
- **Free Tier** — 5 receipts/month, no credit card
- **PDF Export** — Professional receipts your accountant will love

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Blockchain:** Etherscan API (multi-chain)
- **Auth:** Supabase Auth (optional, IP-based fallback)
- **Payments:** Stripe (Phase 3)
- **Deployment:** Render

## Project Structure

```
cryptobooks/
├── frontend/           # Next.js app
│   ├── src/
│   │   ├── app/        # App Router (pages + API routes)
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities, Prisma, auth
│   │   └── data/       # Mock data (fallback)
│   ├── prisma/         # Schema + migrations
│   └── public/         # Static assets
├── docs/               # Business docs, API spec
├── design/             # Wireframes, UI components
└── planning/           # Roadmap, milestones
```

## Setup

### Prerequisites

- Node.js 20+
- npm or yarn

### Environment Variables

Create `frontend/.env.local`:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"

# Blockchain APIs
ETHERSCAN_API_KEY="your-etherscan-key"

# Auth (Supabase — optional for MVP)
NEXT_PUBLIC_SUPABASE_URL="https://project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# Payments (Stripe — Phase 3)
# STRIPE_SECRET_KEY="sk_live_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."

# CORS
ALLOWED_ORIGIN="https://your-app.onrender.com"
```

### Local Development

```bash
cd frontend
npm install
npx prisma generate
npm run dev
```

Open http://localhost:3000

### Database Setup

```bash
cd frontend
npx prisma migrate dev
```

## Deployment

### Render (Recommended)

1. Connect GitHub repo in Render dashboard
2. Set root directory to `frontend`
3. Add environment variables in Render dashboard
4. Deploy

### Vercel (Alternative)

1. Import GitHub repo in Vercel
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | None |
| GET | `/api/receipts` | List receipts | IP-based |
| POST | `/api/receipts` | Create receipt | IP-based |
| GET | `/api/wallets` | List wallets | None |
| POST | `/api/wallets` | Add wallet | None |
| DELETE | `/api/wallets` | Remove wallet | None |
| GET | `/api/transactions/fetch` | Fetch tx data | None |
| POST | `/api/statements/generate` | Generate statement | None |

See `docs/API_REFERENCE.md` for full documentation.

## Contributing

See `docs/development/` for architecture, API spec, and testing strategy.

## Roadmap

- Phase 0: MVP (receipts, local SQLite, mock data) ✅
- Phase 1: Real blockchain data (Etherscan integration) ✅
- Phase 2: Dashboard, statements, CSV export ✅
- Phase 3: Landing page, Stripe payments, Pro/Business tiers ✅
- Phase 4: Supabase Auth, user accounts, multi-tenancy
- Phase 5: Mobile app, more chains, accountant portal

## License

MIT
