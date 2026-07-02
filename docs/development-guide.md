# CryptoClerks — Development Guide
## Invoice → Receipt Loop & Payment Detection System

**Version:** 2026-07-01  
**Status:** MVP complete, new direction in progress

---

## Product Vision

CryptoClerks is the infrastructure layer for businesses paid in crypto. We connect **invoices**, **payments**, and **receipts** into one automatic loop:

1. User creates invoice with payment QR code
2. Customer scans and pays
3. We detect the blockchain transaction
4. Receipt auto-generated, invoice marked paid
5. Customer gets receipt (no signup needed)

This is not a tax tool. This is the operating system for crypto payments.

---

## Current State (What Works Today)

### Receipts
- Hero page input for tx hash + chain + client details
- Generates PDF receipt from blockchain data
- Works on all 6 chains (Ethereum, Polygon, BSC, Arbitrum, Optimism, Base)
- Saved to DB with user association
- Free tier: 5/month, Pro: unlimited

### Statements
- Multi-wallet support
- Date range filtering (presets + custom)
- Fetches token transfers via Etherscan
- Historical USD pricing via CoinGecko
- PDF + CSV export
- Saved to statement history

### Invoices
- Create invoice with client info, amount, token, due date
- Auto-generated invoice number (INV-YYMMDD-XXXX)
- Payment link: `/invoices/{id}`
- PDF download with branded layout
- Manual payment status (user pastes tx hash → poll endpoint)

### API
- Full REST API v1 with API key auth
- All endpoints documented at `/api-docs`
- Rate limits: Free 30/min, Pro 120/min, Business 300/min
- MCP server built for AI agent integration

### Auth
- Supabase auth (email + Google OAuth)
- Users, wallets, receipts, statements, invoices stored in PostgreSQL
- API keys for programmatic access

### Infrastructure
- Deployed on Render: `https://crypto-clerk.onrender.com`
- GitHub: `https://github.com/cryptoClerk/crypto-clerk`
- Etherscan V2 API for multi-chain data
- CoinGecko for historical pricing
- Prisma ORM with PostgreSQL

---

## What Needs to Change (New Direction)

### The New Flow

```
User creates invoice
  ↓
Invoice has: paymentAddress, amount, token, clientWallet (optional)
  ↓
Customer opens public invoice page (no login needed)
  ↓
Customer scans QR with their wallet app
  ↓
Payment broadcast to blockchain
  ↓
Background job polls Etherscan for new token transfers
  ↓
Payment detected → Auto-generate receipt
  ↓
Match receipt to invoice (by to_address + from_address + amount + token)
  ↓
Invoice status: "pending" → "partial" / "paid" / "overpaid"
  ↓
Email receipt to customer (optional, collected on invoice page)
  ↓
Notify user (freelancer) that payment arrived
```

---

## Technical Changes Required

### 1. Invoice Model Changes

**Current:**
```
Invoice:
  id, invoiceNumber, clientName, clientEmail
  amount, token, dueDate
  status: "pending" | "paid" | "overdue" | "cancelled"
  paymentTxHash, paymentAddress, pdfUrl
  userId, createdAt
```

**Required:**
```
Invoice:
  id, invoiceNumber, clientName, clientEmail
  paymentAddress (required — the wallet they pay TO)
  clientWallet (optional — the wallet they pay FROM)
  amount, token, dueDate
  status: "pending" | "partial" | "paid" | "overpaid" | "cancelled"
  paidAmount (running total, default 0)
  remainingAmount (default = amount)
  receiptIds[] (linked receipts)
  paymentTxHash (legacy, keep for manual override)
  pdfUrl, userId, createdAt
```

**Files to change:**
- `prisma/schema.prisma` — Add fields
- `prisma/migrations/` — Migration SQL
- `src/app/api/invoices/route.ts` — Accept paymentAddress in create
- `src/app/api/invoices/[id]/route.ts` — Return new fields
- `src/app/api/invoices/[id]/pdf/route.ts` — Show paidAmount/remaining on PDF

---

### 2. Public Invoice Page (No Login Required)

**Current:** No public page. Invoice detail requires login.

**Required:** New page `/pay/{invoiceId}` accessible without auth:
- Show invoice details (amount, token, due date)
- QR code with payment address + amount + token
- Optional: customer email field ("Send receipt to:")
- Optional: pay buttons (MetaMask, WalletConnect, etc.)
- Status indicator: "Pending", "Paid", "Partial ($X remaining)"
- If paid: show receipt download link

**Files to create:**
- `src/app/pay/[id]/page.tsx` — Public invoice page
- `src/app/api/invoices/[id]/public/route.ts` — Public API (no auth)

**Files to change:**
- `src/app/api/invoices/[id]/route.ts` — Add `include: { receipts: true }` to show linked receipts

---

### 3. Payment Detection System (Background Job)

**Current:** Manual — user pastes tx hash, poll endpoint checks blockchain.

**Required:** Automatic background detection:
- Poll Etherscan every 5 minutes for new token transfers to tracked payment addresses
- Compare against unpaid invoices
- When match found:
  - Generate receipt from tx hash
  - Link receipt to invoice
  - Update invoice status (paid / partial / overpaid)
  - Send email if customer email was provided

**Implementation Options:**

**Option A: Cron job (simplest for MVP)**
- Cron endpoint `/api/cron/payment-watch`
- Triggered every 5 minutes via cron job (Render cron or external)
- Queries all invoices with status "pending" or "partial"
- For each, checks Etherscan for new token transfers to paymentAddress
- Matches by amount + token + from_address (if clientWallet known)
- If match: generates receipt, updates invoice, sends email

**Option B: Webhook listener (better long-term)**
- Use Alchemy/Infura webhook for "token transfer" events
- No polling needed — instant notification
- Requires paid plan for webhook services

**Recommended: Option A for MVP, migrate to Option B later**

**Files to create:**
- `src/app/api/cron/payment-watch/route.ts` — Main cron job
- `src/lib/services/payment-detector.ts` — Detection logic
- `src/lib/services/receipt-generator.ts` — Auto-generate receipt from tx
- `src/lib/services/invoice-matcher.ts` — Match receipt to invoice
- `src/lib/services/notification.ts` — Email notification logic

**Files to change:**
- `src/app/api/invoices/poll/route.ts` — Keep as manual override, but deprecate
- `src/app/api/receipts/route.ts` — Allow auto-generation without user input

---

### 4. Receipt → Invoice Matching Engine

**Logic:**

```typescript
function matchReceiptToInvoice(receipt: Receipt): Invoice | null {
  // Find all unpaid invoices for this payment address
  const candidates = await prisma.invoice.findMany({
    where: {
      paymentAddress: receipt.toAddress,
      token: receipt.token,
      status: { in: ["pending", "partial"] },
    },
    orderBy: { createdAt: "asc" }, // Oldest first (FIFO)
  });

  // If clientWallet is set on invoice, match by from_address too
  const matches = candidates.filter(inv => {
    if (inv.clientWallet && inv.clientWallet !== receipt.fromAddress) return false;
    return true;
  });

  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];
  
  // Multiple matches — ambiguous
  // Log for manual review, don't auto-match
  return null; // Or return oldest and let user confirm
}

function updateInvoiceStatus(invoice: Invoice, receiptAmount: number) {
  const newPaid = parseFloat(invoice.paidAmount) + receiptAmount;
  const remaining = parseFloat(invoice.amount) - newPaid;
  
  if (remaining <= 0) {
    return { status: "paid", paidAmount: newPaid, remainingAmount: 0 };
  } else if (remaining < 0) {
    return { status: "overpaid", paidAmount: newPaid, remainingAmount: 0 };
  } else {
    return { status: "partial", paidAmount: newPaid, remainingAmount: remaining };
  }
}
```

**Edge Cases to Handle:**
- Partial payment → invoice stays "partial", allow more payments
- Overpayment → invoice "paid", extra is just a receipt
- Wrong token → no match, receipt is standalone
- Multiple invoices, same amount → oldest first, or ask user to confirm
- Wrong from_address → no match (if clientWallet is set)

**Files to create:**
- `src/lib/services/invoice-matcher.ts` — Core matching logic

---

### 5. Auto-Receipt Generation

**Current:** User provides txHash, clientName, description, chain manually.

**Required:** Auto-generate from detected payment:
- Receipt amount = token transfer amount
- Token = token symbol from transfer
- From address = from_address (customer)
- To address = to_address (paymentAddress)
- Client name = invoice.clientName
- Description = invoice details (or "Payment for Invoice #XXX")
- Chain = detected from Etherscan
- Date = transaction timestamp
- Auto-generate PDF and save

**Files to change:**
- `src/app/api/receipts/route.ts` — Allow auto-generation with minimal fields (txHash + invoiceId)
- `src/lib/services/receipt-generator.ts` — New service that auto-creates from tx data

---

### 6. Email Notifications

**Current:** Email service logs to console only.

**Required:** Real email sending when:
- Invoice is created (to customer if email provided)
- Payment is detected (receipt to customer + notification to freelancer)
- Invoice is overdue (reminder to customer)

**Content:**
- Payment received: "Acme Corp paid Invoice #INV-1234. Receipt: [link]"
- Receipt to customer: "Your receipt for payment to Freelancer LLC. [download PDF]"

**Email providers to integrate (in order):**
1. Resend (free tier: 3000 emails/day, easy API)
2. SendGrid (free tier: 100 emails/day)
3. AWS SES (cheapest at scale, more complex setup)

**Files to change:**
- `src/app/api/email/route.ts` — Replace console.log with real email send
- `src/lib/services/notification.ts` — Template emails

**Files to create:**
- `src/lib/email-templates/` — HTML email templates

---

### 7. Customer Email Collection (on Public Invoice Page)

**On the `/pay/{invoiceId}` page:**
- Show invoice details
- Optional input: "Email for receipt (optional): [________]"
- Save to invoice.customerEmail (if not already set from invoice creation)
- When payment detected, email receipt to this address

**No signup required.** Just an email field on a public page. Like leaving your email at a restaurant checkout.

---

### 8. Invoice Creation Flow Changes

**Current:** User creates invoice → gets list of invoices.

**New:** User creates invoice → gets:
- Invoice detail page
- Shareable link: `https://crypto-clerk.onrender.com/pay/INV-1234`
- Copy link button
- QR code (for the user to download/screenshot and share)

**Files to change:**
- `src/app/dashboard/invoices/page.tsx` — Add "Share" button with copyable link
- `src/app/api/invoices/route.ts` — Return `publicUrl` on create

---

### 9. Dashboard Updates

**New sections needed:**
- **Invoice tracker:** Show unpaid invoices with payment status, last payment date, remaining amount
- **Recent payments:** Auto-detected payments + receipts
- **Payment notifications:** Alerts when new payment arrives
- **Matching review:** When system can't auto-match, show for manual confirmation

**Files to create:**
- `src/components/dashboard/PaymentTracker.tsx`
- `src/components/dashboard/RecentPayments.tsx`
- `src/components/dashboard/NotificationPanel.tsx`

---

### 10. MCP Server Update

**Add new tools:**
- `watch_invoice_payment` — Start watching an invoice for payment
- `get_payment_status` — Check if invoice has been paid
- `list_recent_payments` — Show auto-detected payments

**Files to change:**
- `mcp-server/src/index.ts` — Add new tools

---

## Implementation Order (Priority)

### Phase 1: Foundation (Week 1)
1. Update invoice model (add paymentAddress, clientWallet, paidAmount, remainingAmount)
2. Create public invoice page (`/pay/{id}`)
3. Update invoice creation flow to include paymentAddress
4. Update invoice PDF to show payment status

### Phase 2: Payment Detection (Week 2)
5. Build payment detection cron job (`/api/cron/payment-watch`)
6. Build matching engine (`invoice-matcher.ts`)
7. Build auto-receipt generator
8. Test with real transactions on testnet

### Phase 3: Notifications (Week 3)
9. Integrate real email service (Resend)
10. Build email templates for payment received, receipt sent, overdue reminder
11. Add email collection to public invoice page
12. Add dashboard notifications

### Phase 4: Polish (Week 4)
13. Build dashboard payment tracker
14. Handle edge cases in matching (ambiguous payments, manual override)
15. Add "Share invoice" feature to dashboard
16. Update MCP server with new tools
17. Publish MCP server to npm

---

## Files to Create (New)

```
prisma/migrations/
  202607011900_add_invoice_fields/          # Migration for new invoice fields

src/app/pay/
  [id]/page.tsx                             # Public invoice page (no auth)

src/app/api/cron/payment-watch/
  route.ts                                  # Background detection cron job

src/lib/services/
  payment-detector.ts                       # Polls Etherscan for payments
  receipt-generator.ts                     # Auto-generates receipt from tx
  invoice-matcher.ts                       # Matches receipts to invoices
  notification.ts                          # Email/notification logic

src/lib/email-templates/
  payment-received.html                    # Email to freelancer
  receipt-to-customer.html                 # Email to customer
  invoice-overdue.html                     # Reminder email

src/components/dashboard/
  PaymentTracker.tsx                        # Show unpaid invoices
  RecentPayments.tsx                        # Auto-detected payments
  NotificationPanel.tsx                     # Payment alerts
```

## Files to Modify (Existing)

```
prisma/schema.prisma                        # Add invoice fields

src/app/api/invoices/route.ts              # Accept paymentAddress, clientWallet
src/app/api/invoices/[id]/route.ts         # Return new fields + receipts
src/app/api/invoices/[id]/pdf/route.ts   # Show paid/remaining on PDF
src/app/api/invoices/[id]/poll/route.ts  # Deprecate manual, support auto
src/app/api/invoices/poll/route.ts        # Same as above
src/app/api/receipts/route.ts             # Auto-generate support
src/app/api/email/route.ts                # Send real emails

src/app/dashboard/page.tsx                 # Add payment tracker section
src/app/dashboard/invoices/page.tsx        # Add shareable link button
src/app/api-docs/page.tsx                 # Document new public endpoints

mcp-server/src/index.ts                   # Add payment watch tools
```

---

## Key Decisions Made

1. **No smart contracts for MVP** — Matching engine first, smart contracts later as Pro feature
2. **Public invoice page** — No login required for customers to pay
3. **Email is optional** — Customer can provide email for receipt, but not required
4. **Cron job for detection** — Simple polling every 5 minutes, migrate to webhooks later
5. **FIFO matching** — Oldest unpaid invoice matched first when ambiguous
6. **Manual override available** — Freelancer can always manually link receipt to invoice

---

## Success Criteria

- Freelancer can create invoice → share link → customer pays → receipt auto-generated → invoice marked paid
- Customer gets receipt without downloading an app or creating an account
- Freelancer gets notification that payment arrived
- The entire loop takes under 5 minutes from payment to receipt

---

*Last updated: 2026-07-01 20:45 CDT*
