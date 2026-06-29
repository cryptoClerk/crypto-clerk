# CryptoBooks — Architecture

## High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  API Routes     │────▶│  Block Explorers│
│   (Frontend)    │     │  (Serverless)   │     │  (Etherscan etc)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │              ┌────────┴────────┐
         │              │                 │
         ▼              ▼                 ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────┐
│  User Browser   │  │  Supabase   │  │  Alchemy    │
│  (PDF gen)      │  │  (DB + Auth)│  │  (Fallback) │
└─────────────────┘  └─────────────┘  └─────────────┘
```

## Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** React Query (server state) + Zustand (client state)
- **PDF Generation:** Client-side with html2canvas + jsPDF (or react-pdf)
- **Wallet Connection:** RainbowKit (handles MetaMask, WalletConnect, etc.)

### Backend
- **API:** Next.js API Routes (serverless)
- **Auth:** Supabase Auth or Clerk
- **Database:** Supabase PostgreSQL
- **ORM:** Prisma
- **PDF Server-side:** Puppeteer (for high-quality server PDFs) or keep client-side

### Blockchain Data
- **Primary:** Etherscan API family (free tier)
- **Fallback:** Alchemy SDK (free tier)
- **Multi-chain:** Swap base URL per chain (Etherscan, BscScan, PolygonScan, etc.)

### Hosting
- **Frontend + API:** Vercel (free tier to start)
- **Database:** Supabase (free tier)
- **Domain:** Cloudflare or Vercel

---

## Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  businessName  String?
  businessAddress String?
  logoUrl       String?
  plan          String    @default("free") // free, pro, business
  createdAt     DateTime  @default(now())
  wallets       Wallet[]
  receipts      Receipt[]
  statements    Statement[]
  invoices      Invoice[]
  apiKeys       ApiKey[]
}

model Wallet {
  id        String   @id @default(uuid())
  address   String
  chain     String   // ethereum, polygon, bsc, etc.
  label     String?  // "Main Wallet", "DAO Payments"
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

model Receipt {
  id          String   @id @default(uuid())
  txHash      String
  chain       String
  fromAddress String
  toAddress   String
  amount      String   // store as string for precision
  token       String   // USDC, USDT, DAI, ETH
  usdValue    Decimal?
  clientName  String
  description String
  date        DateTime
  pdfUrl      String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}

model Statement {
  id          String   @id @default(uuid())
  startDate   DateTime
  endDate     DateTime
  wallets     String[] // wallet IDs or addresses
  pdfUrl      String?
  csvUrl      String?
  totalIncome Decimal?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}

model Invoice {
  id          String   @id @default(uuid())
  invoiceNumber String @unique
  clientName  String
  clientEmail String?
  amount      Decimal
  token       String
  dueDate     DateTime?
  status      String   @default("pending") // pending, paid, overdue
  paymentTxHash String?
  pdfUrl      String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}

model ApiKey {
  id        String   @id @default(uuid())
  key       String   @unique
  name      String   // "Production", "Development"
  lastUsed  DateTime?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## API Layer Design

### Explorer Interface (Abstracted)
```typescript
interface BlockchainExplorer {
  getTransaction(hash: string): Promise<Transaction>;
  getTokenTransfers(address: string, startBlock?: number, endBlock?: number): Promise<TokenTransfer[]>;
  getBalance(address: string): Promise<string>;
  // chain-specific config
  chain: string;
  baseUrl: string;
}

class EtherscanExplorer implements BlockchainExplorer { /* ... */ }
class AlchemyExplorer implements BlockchainExplorer { /* ... */ }

// Factory
function getExplorer(chain: string, preferAlchemy = false): BlockchainExplorer {
  if (preferAlchemy) return new AlchemyExplorer(chain);
  return new EtherscanExplorer(chain);
}
```

---

## PDF Generation Strategy

**Client-side (MVP):**
- html2canvas → capture styled HTML receipt
- jsPDF → save as PDF
- Pros: fast, no server load, free
- Cons: slight quality tradeoff, browser-dependent

**Server-side (Scale):**
- Puppeteer → render HTML in headless Chrome → PDF
- Pros: consistent quality, works for API-generated PDFs
- Cons: server cost, slower

**Decision:** Start client-side. Move to server-side for API/agent use cases.
