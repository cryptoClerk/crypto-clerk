# CryptoBooks — Audit Report

**Date:** 2026-06-29
**Auditor:** Argyle
**Scope:** Full codebase audit after Phases 0-3 partial
**Branch:** main

---

## 🚨 CRITICAL (Fix before launch)

### 1. Database Schema Inconsistency — Foreign Key Constraints Will Break
**File:** `prisma/schema.prisma`
**Issue:** Wallet model has NO user relation (we removed it), but `Statement`, `Invoice`, `ApiKey` models still require `userId` as mandatory field with `@relation` to User.
**Impact:** When you try to create a Statement, Invoice, or API key, Prisma will throw a foreign key constraint error because `userId` is required but there's no auth system providing user IDs yet.
**Fix:** Make `userId` optional on Statement, Invoice, ApiKey — OR implement auth before using those features.
```prisma
// Current (BROKEN):
model Statement {
  userId String  // Required — will crash without auth
  user   User @relation(fields: [userId], references: [id])
}

// Fix:
model Statement {
  userId String?
  user   User? @relation(fields: [userId], references: [id])
}
```

### 2. No Input Validation on Wallet Address
**File:** `src/app/api/wallets/route.ts`
**Issue:** The wallet address is saved as a raw string with no format validation. Someone could inject SQL, XSS, or garbage data.
**Fix:** Add Ethereum address validation:
```typescript
const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);
```

### 3. GET /api/receipts Has No Error Handling
**File:** `src/app/api/receipts/route.ts`
**Issue:** The GET handler has no try/catch. If the database is unreachable, the server will crash with an unhandled exception.
**Fix:** Wrap `prisma.receipt.findMany()` in try/catch.

### 4. No Rate Limiting — API Abuse Risk
**File:** All API routes (`/api/*`)
**Issue:** Anyone can spam the API endpoints. An attacker could:
- Hit `/api/receipts` thousands of times to fill the database
- Hit `/api/transactions/fetch` to exhaust Etherscan API limits (when real keys are added)
- DOS the server with expensive PDF generation
**Fix:** Add rate limiting middleware. For Next.js, use `rate-limiter-flexible` or a simple in-memory rate limiter.

### 5. Free Tier Counter Is Client-Side Only (Easily Bypassed)
**File:** `src/components/receipts/ReceiptGenerator.tsx`
**Issue:** Receipt count is stored in `localStorage` on the client. Any user can open DevTools and run `localStorage.clear()` to reset their count.
**Impact:** Free tier is essentially unlimited right now.
**Fix:** Track receipt counts server-side in the database, associated with IP address or session ID (until auth is ready).

### 6. CSV Export Doesn't Escape Commas
**File:** `src/app/dashboard/statements/page.tsx` — `handleExportCSV()`
**Issue:** If a transaction description or client name contains a comma, the CSV will be malformed.
**Fix:** Wrap fields in quotes and escape existing quotes:
```typescript
const escapeCSV = (field: string) => `"${field.replace(/"/g, '""')}"`;
```

### 7. Missing Environment Variable Validation
**File:** `src/lib/db.ts`
**Issue:** The app will crash with cryptic errors if `DATABASE_URL` is missing or malformed. No validation at startup.
**Fix:** Add startup validation:
```typescript
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}
```

### 8. `detectChainFromTxHash` Always Returns "ethereum"
**File:** `src/lib/services/blockchain.ts`
**Issue:** The function claims to "auto-detect chain" but always returns "ethereum". This is misleading UX — users think we're detecting when we're not.
**Fix:** Either implement real detection (e.g., try each chain's API until one returns data) OR remove the auto-detect claim and default to user's last selected chain.

---

## ⚠️ HIGH (Fix before public launch)

### 9. No Authentication / Authorization
**Impact:** Anyone can create, read, delete any wallet, receipt, or statement. There's no concept of "your data."
**Fix:** This is expected for MVP but MUST be fixed before real users. Add Supabase Auth or Clerk.

### 10. USD Value Calculation Is Wrong for Non-Stablecoins
**File:** `src/app/api/receipts/route.ts`, `src/app/api/statements/generate/route.ts`
**Issue:** The code does `amount.toFixed(2)` for ALL tokens, assuming 1:1 with USD. This is correct for USDC/USDT/DAI but completely wrong for ETH, BTC, or any volatile token.
**Impact:** If someone receives ETH, the receipt will show a wildly incorrect USD value.
**Fix:** Use CoinGecko API to fetch historical prices, or at minimum, only show USD values for known stablecoins and display raw amounts for others.

### 11. No CORS Configuration
**File:** `next.config.ts`
**Issue:** Default Next.js CORS allows all origins. When the API is public, this could be a security risk.
**Fix:** Add CORS headers to API routes restricting to your domain.

### 12. Missing `key` Prop Stability in Lists
**File:** `src/components/statements/StatementPreview.tsx`
**Issue:** Uses `key={txn.txHash + index}` which is unstable if two transactions have the same hash (unlikely but possible with different indices).
**Fix:** Use a truly unique key or just `index` if order is guaranteed.

### 13. Date String Comparison Is Timezone-Sensitive
**File:** `src/app/api/statements/generate/route.ts`
**Issue:** The date filtering compares JavaScript Date objects which are timezone-aware. A transaction at 11pm UTC on Dec 31 might show as Jan 1 locally.
**Fix:** Use ISO string comparison or normalize all dates to UTC before comparing.

### 14. `URL.createObjectURL` Memory Leak in CSV Export
**File:** `src/app/dashboard/statements/page.tsx`
**Issue:** Creates a blob URL but revokes it immediately after click. However, there's a small race condition where the click might not complete before revoke.
**Fix:** Use `setTimeout(() => URL.revokeObjectURL(url), 100)` instead of immediate revoke.

### 15. No Pagination on List Endpoints
**File:** `src/app/api/receipts/route.ts` (GET), `src/app/api/wallets/route.ts` (GET)
**Issue:** Returns ALL records (or top 50 for receipts). As the database grows, these endpoints will get slower and eventually OOM.
**Fix:** Add cursor-based pagination with `skip`/`take` parameters.

---

## 🟡 MEDIUM (Fix before scaling)

### 16. Console.error in Production
**File:** All API routes
**Issue:** `console.error()` logs will clutter production logs and potentially leak sensitive info.
**Fix:** Replace with a proper logging service (Sentry, LogRocket) or at minimum, check `process.env.NODE_ENV` before logging.

### 17. No Health Check Endpoint
**Impact:** No way for monitoring tools (Vercel, UptimeRobot) to verify the app is actually working vs. just returning 200 on `/`.
**Fix:** Add `/api/health` that checks database connectivity.

### 18. No Input Validation on txHash Format
**File:** All API routes accepting txHash
**Issue:** Accepts any string. Could pass garbage that causes downstream issues.
**Fix:** Add regex validation: `/^0x[a-fA-F0-9]{64}$/`

### 19. `businessName` and `businessAddress` Not Saved to DB
**File:** `src/app/api/receipts/route.ts`
**Issue:** The Zod schema accepts these fields but they're never written to the database. The Receipt model doesn't even have these columns.
**Fix:** Add columns to schema or remove from API validation.

### 20. No Error Boundary for React Components
**Impact:** If a component crashes, the entire page goes white. Bad UX.
**Fix:** Add `error.tsx` files in route segments.

---

## 🟢 LOW (Nice to have)

### 21. Missing Favicon and OG Image
**Impact:** No branding in browser tabs or social shares.

### 22. No Dark Mode
**Impact:** Personal preference, not a blocker.

### 23. No Toast Notifications
**Impact:** Users don't get clear success/error feedback for async actions.

### 24. No Robots.txt or Sitemap
**Impact:** SEO. Not critical for MVP.

### 25. `.env` File Committed to Git
**File:** `.env`
**Issue:** Contains `DATABASE_URL="file:./dev.db"` which is low-risk but still not best practice. Should be `.env.example` in git, `.env.local` ignored.
**Current status:** The `.gitignore` ignores `.env*` so this might already be handled. Verify.

---

## Summary

| Severity | Count | Block Launch? |
|----------|-------|---------------|
| 🚨 Critical | 8 | YES |
| ⚠️ High | 7 | YES |
| 🟡 Medium | 5 | NO |
| 🟢 Low | 5 | NO |

**Total Issues Found:** 25

**Must Fix Before Launch:**
1. Database schema (userId optional on Statement/Invoice/ApiKey)
2. Add rate limiting
3. Server-side receipt counting (not localStorage)
4. Fix CSV comma escaping
5. Add error handling to GET /api/receipts
6. Input validation on wallet addresses and tx hashes
7. Fix USD value calculation for non-stablecoins
8. Add auth (Supabase/Clerk)
9. CORS configuration
10. URL.revokeObjectURL fix

**Estimated Fix Time:** 2-3 hours
