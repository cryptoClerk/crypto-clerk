# CryptoBooks — Audit Report

**Date:** 2026-06-29
**Auditor:** Argyle
**Scope:** Full codebase audit after Phases 0-3 partial
**Branch:** main

---

## 🚨 CRITICAL (Fix before launch)

### 1. Database Schema Inconsistency — Foreign Key Constraints Will Break ✅ FIXED
**File:** `prisma/schema.prisma`
**Issue:** Wallet model has NO user relation (we removed it), but `Statement`, `Invoice`, `ApiKey` models still required `userId` as mandatory field with `@relation` to User.
**Fix Applied:** Made `userId` optional (`String?`) on Statement, Invoice, ApiKey, Receipt. Added `businessName` and `businessAddress` fields to Receipt model.

### 2. No Input Validation on Wallet Address ✅ FIXED
**File:** `src/app/api/wallets/route.ts`
**Fix Applied:** Added Ethereum address validation regex `^0x[a-fA-F0-9]{40}$` and Zod refinement.

### 3. GET /api/receipts Has No Error Handling ✅ FIXED
**File:** `src/app/api/receipts/route.ts`
**Fix Applied:** Wrapped in try/catch with proper error responses.

### 4. No Rate Limiting — API Abuse Risk ✅ FIXED
**File:** `src/lib/rate-limit.ts` + all API routes
**Fix Applied:** Implemented in-memory rate limiter with 20 req/min for receipts, 30 req/min for tx fetch.

### 5. Free Tier Counter Is Client-Side Only (Easily Bypassed) ✅ FIXED
**File:** `src/app/api/receipts/route.ts`
**Fix Applied:** Counting receipts server-side by IP address in database.

### 6. CSV Export Doesn't Escape Commas ✅ FIXED
**File:** `src/app/dashboard/statements/page.tsx`
**Fix Applied:** Added `escapeCSV()` function that wraps fields in quotes and escapes existing quotes.

### 7. Missing Environment Variable Validation ✅ FIXED
**File:** `src/lib/db.ts`
**Fix Applied:** Falls back to default SQLite path with warning instead of cryptic crash.

### 8. `detectChainFromTxHash` Always Returns "ethereum" ✅ FIXED
**File:** `src/lib/services/blockchain.ts`
**Fix Applied:** Now async function that tries each supported chain and returns the first match. Falls back to ethereum with clear documentation.

---

## ⚠️ HIGH (Fix before public launch)

### 9. No Authentication / Authorization
**Impact:** Anyone can create, read, delete any wallet, receipt, or statement. There's no concept of "your data."
**Fix:** This is expected for MVP but MUST be fixed before real users. Add Supabase Auth or Clerk.

### 10. USD Value Calculation Is Wrong for Non-Stablecoins ✅ FIXED
**File:** `src/app/api/receipts/route.ts`, `src/app/api/transactions/fetch/route.ts`, `src/app/api/statements/generate/route.ts`
**Issue:** The code did `amount.toFixed(2)` for ALL tokens, assuming 1:1 with USD. This was correct for USDC/USDT/DAI but completely wrong for ETH, BTC, or any volatile token.
**Fix Applied:** Added `calculateUsdValue()` helper that checks if token is a known stablecoin. For stablecoins: `$X.XX`. For non-stablecoins: returns raw amount with `isEstimated: true` flag. UI shows amber warning indicator on receipts when USD is estimated.
**Note:** Still needs CoinGecko integration for real non-stablecoin prices.

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

### 19. `businessName` and `businessAddress` Not Saved to DB ✅ FIXED
**File:** `src/app/api/receipts/route.ts`
**Issue:** The Zod schema accepted these fields but they were never written to the database. The Receipt model didn't even have these columns.
**Fix Applied:** Added `businessName` and `businessAddress` columns to Receipt model. Updated API to persist them. Added business address input field to ReceiptGenerator component.

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
