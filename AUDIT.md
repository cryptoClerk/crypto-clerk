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

### 9. No Authentication / Authorization ✅ PARTIALLY FIXED
**Impact:** Anyone can create, read, delete any wallet, receipt, or statement. There's no concept of "your data."
**Fix Applied:** Added IP-based soft scoping to receipts (GET now filters by IP). Added `src/lib/auth.ts` with `getClientIP()` and `requireAuth()` helpers ready for real auth integration.
**Note:** Still needs real auth (Supabase/Clerk) before public launch. IP-based scoping is a temporary measure.

### 10. USD Value Calculation Is Wrong for Non-Stablecoins ✅ FIXED
**File:** `src/app/api/receipts/route.ts`, `src/app/api/transactions/fetch/route.ts`, `src/app/api/statements/generate/route.ts`
**Issue:** The code did `amount.toFixed(2)` for ALL tokens, assuming 1:1 with USD. This was correct for USDC/USDT/DAI but completely wrong for ETH, BTC, or any volatile token.
**Fix Applied:** Added `calculateUsdValue()` helper that checks if token is a known stablecoin. For stablecoins: `$X.XX`. For non-stablecoins: returns raw amount with `isEstimated: true` flag. UI shows amber warning indicator on receipts when USD is estimated.
**Note:** Still needs CoinGecko integration for real non-stablecoin prices.

### 11. No CORS Configuration ✅ FIXED
**File:** `next.config.ts`
**Fix Applied:** Added CORS headers to all `/api/*` routes with configurable `ALLOWED_ORIGIN` env var. Defaults to `*` for development.

### 12. Missing `key` Prop Stability in Lists ✅ FIXED
**File:** `src/components/statements/StatementPreview.tsx`
**Fix Applied:** Changed key from `txn.txHash + index` to `${txn.txHash}-${txn.date}-${index}` for better stability.

### 13. Date String Comparison Is Timezone-Sensitive ✅ FIXED
**File:** `src/app/api/statements/generate/route.ts`
**Fix Applied:** Changed date filtering to compare ISO date strings (`YYYY-MM-DD`) instead of Date objects, eliminating timezone issues.

### 14. `URL.createObjectURL` Memory Leak in CSV Export ✅ FIXED
**File:** `src/app/dashboard/statements/page.tsx`
**Fix Applied:** Already had `setTimeout(() => URL.revokeObjectURL(url), 100)` — verified this is correct.

### 15. No Pagination on List Endpoints ✅ FIXED
**File:** `src/app/api/receipts/route.ts`, `src/app/api/wallets/route.ts`
**Fix Applied:** Added `page`, `limit`, `skip`, `take` parameters to both endpoints. Returns pagination metadata including `total`, `totalPages`, `hasMore`.

---

## 🟡 MEDIUM (Fix before scaling)

### 16. Console.error in Production
**File:** All API routes
**Issue:** `console.error()` logs will clutter production logs and potentially leak sensitive info.
**Fix:** Replace with a proper logging service (Sentry, LogRocket) or at minimum, check `process.env.NODE_ENV` before logging.

### 17. No Health Check Endpoint ✅ FIXED
**Impact:** No way for monitoring tools (Vercel, UptimeRobot) to verify the app is actually working vs. just returning 200 on `/`.
**Fix Applied:** Added `/api/health` endpoint that checks database connectivity and returns `status: "healthy"` or `status: "unhealthy"` with 503.

### 18. No Input Validation on txHash Format ✅ FIXED
**File:** All API routes accepting txHash
**Fix Applied:** Added regex validation `^0x[a-fA-F0-9]{64}$` to both `/api/receipts` and `/api/transactions/fetch` routes via Zod refinement.

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
