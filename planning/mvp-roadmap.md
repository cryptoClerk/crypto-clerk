# CryptoBooks — MVP Roadmap

## Phase 0: Foundation (Week 1)
**Goal:** Project scaffolded, auth working, one chain connected

- [ ] Next.js project setup with Tailwind + shadcn/ui
- [ ] Supabase project + Prisma schema
- [ ] Auth: email/password + Google OAuth
- [ ] Connect Etherscan API (Ethereum mainnet)
- [ ] Deploy to Vercel (staging)

**Deliverable:** Live staging URL with auth + hello world

---

## Phase 1: Receipt Generator (Week 2)
**Goal:** No-signup receipt generation works end-to-end

- [ ] Hero page: tx hash input + chain auto-detect
- [ ] Fetch transaction from Etherscan
- [ ] Parse ERC-20 transfer (USDC, USDT, DAI)
- [ ] Form: client name, description, business info
- [ ] Generate PDF (html2canvas + jsPDF)
- [ ] Download PDF
- [ ] Save to account (if logged in)
- [ ] Limit free users to 5 receipts/mo

**Deliverable:** cryptobooks.app — paste tx hash, get PDF

---

## Phase 2: Statements (Week 3)
**Goal:** Users can generate bank-style statements

- [ ] Wallet management (add/remove wallet addresses)
- [ ] Multi-wallet support
- [ ] Fetch token transfer history (Etherscan tokentx endpoint)
- [ ] Date range picker (monthly presets + custom)
- [ ] USD value lookup (CoinGecko historical prices)
- [ ] Statement PDF template (bank-style)
- [ ] CSV export
- [ ] Statement history (saved to account)

**Deliverable:** Full statement generator + CSV export

---

## Phase 3: Polish + Launch Prep (Week 4)
**Goal:** Production-ready, ready for users

- [ ] Add Polygon, BSC support (same API, different base URL)
- [ ] Design polish: logo, colors, receipt/statement templates
- [ ] Landing page with demo video/GIF
- [ ] Pricing page (Free/Pro/Business)
- [ ] Stripe integration for subscriptions
- [ ] Email: welcome, receipt generated, payment confirmation
- [ ] Help docs / FAQ
- [ ] Google Analytics + Vercel Analytics

**Deliverable:** Production launch

---

## Phase 4: Post-Launch (Month 2-3)
**Goal:** Iterate based on feedback, add v2 features

- [ ] Invoice builder (v2)
- [ ] Auto-categorization agent
- [ ] Natural language queries
- [ ] API keys for Business tier
- [ ] Agent SDK + documentation
- [ ] Mobile app (PWA or native)
- [ ] Bulk import / cleanup flow
- [ ] Customer support: Discord community

---

## Success Metrics by Phase

| Phase | Metric | Target |
|-------|--------|--------|
| Phase 1 | Receipts generated | 100 in first week |
| Phase 2 | Statements generated | 50 in first week |
| Phase 3 | Signups | 200 in first month |
| Phase 4 | Paying users | 20 in month 2 |
