# CryptoBooks — Product Specification

## Core Products

### 1. Receipt Generator
**What:** Generate a professional PDF receipt from a single blockchain transaction.

**Inputs:**
- Transaction hash (auto-detects chain)
- Client name (who paid you)
- Service description (what you did)
- Your business info (name, address — optional, saved in profile)

**Auto-populated:**
- Transaction hash, from/to addresses
- Amount in crypto + USD value at time of tx
- Date, block number, chain
- Gas fee (optional, for records)

**Output:** Branded PDF receipt, downloadable + shareable link

**Use case:** Freelancer gets paid in USDC, needs proof of income for their own books or to send back to client as acknowledgment.

---

### 2. Statement Generator
**What:** Generate bank-style statements from wallet transaction history over a date range.

**Inputs:**
- One or more wallet addresses
- Date range (daily / weekly / monthly / quarterly / yearly / custom)
- Optional: categorize transactions, add client names

**Auto-populated:**
- All token transfers (USDC, USDT, DAI, etc.) from block explorers
- USD values at time of transaction (from price oracle)
- Starting/ending balances
- Running total

**Output:** Branded PDF statement + CSV export

**Use case:** Proof of income for apartment applications, loan applications, tax filing, visa/immigration.

---

### 3. Invoice Builder (v2)
**What:** Create branded invoices with a crypto payment link/QR code.

**Inputs:**
- Invoice number, date, due date
- Line items (description, quantity, rate, amount)
- Client info
- Your business info + logo
- Payment wallet address + preferred token/chain

**Output:**
- Branded PDF invoice
- Hosted payment page with QR code (deep link to wallet)
- Payment status tracking (check if tx confirmed on-chain)

**Use case:** Freelancer wants to bill client in USDC instead of invoicing in fiat.

---

### 4. Transaction Export
**What:** Export clean, categorized transaction data for accountants.

**Inputs:**
- Wallet addresses
- Date range
- Categories/tags (optional)

**Output:**
- CSV with columns: Date, Client, Description, Crypto Amount, Token, USD Value, Tx Hash, Category
- PDF summary

**Use case:** Hand to accountant at tax time. No more spreadsheet hell.

---

### 5. Multi-Wallet Dashboard (v2)
**What:** One view across all wallets, all chains.

**Features:**
- Add/remove wallet addresses
- Auto-detect chains from addresses
- Unified transaction feed
- Monthly income summaries
- Outstanding invoice tracking

---

## Product Principles
1. **No signup to try** — first receipt free, no account needed
2. **Paste and go** — tx hash in, PDF out in 30 seconds
3. **Fiat-first display** — landlords don't care about USDC, they care about dollars
4. **Progressive disclosure** — don't overwhelm, surface details on demand
5. **API-first** — every feature callable programmatically for agent integrations
