# CryptoBooks — Tech Stack

## Frontend

| Technology | Purpose | Why |
|-----------|---------|-----|
| **Next.js 14+** | Framework | App Router, server components, API routes in one codebase |
| **TypeScript** | Type safety | Catch bugs at build time, better DX |
| **Tailwind CSS** | Styling | Rapid UI development, consistent design system |
| **shadcn/ui** | UI components | Pre-built accessible components, copy-paste customization |
| **React Query** | Server state | Caching, background refetch, loading states |
| **Zustand** | Client state | Simple global state, lighter than Redux |
| **RainbowKit** | Wallet connection | Best-in-class wallet UI, handles 100+ wallets |
| **Wagmi/Viem** | Web3 interactions | Modern Ethereum library, typed, lightweight |
| **html2canvas + jsPDF** | PDF generation (MVP) | Client-side, zero server cost |
| **react-pdf** | PDF generation (v2) | React-based PDF templates, more control |

## Backend

| Technology | Purpose | Why |
|-----------|---------|-----|
| **Next.js API Routes** | API server | Same codebase as frontend, serverless |
| **Supabase** | Database + Auth | Managed Postgres, auth, real-time subscriptions, free tier generous |
| **Prisma** | ORM | Type-safe database queries, migrations, great DX |
| **Zod** | Validation | Schema validation for API inputs |

## Blockchain Data

| Technology | Purpose | Why |
|-----------|---------|-----|
| **Etherscan API** | Primary data source | Free tier generous, best Ethereum data |
| **Blockscan** | Multi-chain EVM | Same API format for Polygon, BSC, Arbitrum, Optimism |
| **Alchemy SDK** | Fallback | Unified API across chains, better rate limits |
| **CoinGecko API** | Price data | Free historical prices for USD conversion |

## Hosting & DevOps

| Technology | Purpose | Why |
|-----------|---------|-----|
| **Vercel** | Hosting | Free tier, edge network, auto-deploy from Git |
| **GitHub** | Source control | Free private repos, Actions for CI/CD |
| **Supabase** | Database hosting | Included in above |

## Development Tools

| Technology | Purpose |
|-----------|---------|
| **ESLint + Prettier** | Code quality |
| **Husky** | Git hooks (pre-commit lint) |
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |

---

## What We're NOT Using (and why)

- **No smart contracts** — unnecessary for MVP, adds audit cost/complexity
- **No separate backend service** — Next.js API routes handle everything at this scale
- **No Redis** — Supabase + React Query caching is sufficient
- **No Kubernetes/Docker** — overkill for MVP, Vercel serverless handles it
- **No separate mobile app** — responsive web first, PWA later if needed
