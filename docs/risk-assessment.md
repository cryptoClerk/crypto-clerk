# CryptoBooks — Risk Assessment

## Product Risks

### MVP Scope Creep
**Risk:** Trying to build everything at once
**Mitigation:** Strict 3-product MVP (receipts, statements, export). Invoices v2. Dashboard v3.

### User Doesn't Understand Value
**Risk:** "Why pay when I can screenshot Etherscan?"
**Mitigation:** Free tier proves value. Show side-by-side: screenshot vs. professional receipt.

### Low Conversion
**Risk:** Free users never upgrade
**Mitigation:** Gate the most valuable features (statements, CSV export, bulk). 5 receipts/mo is enough to hook, not enough to rely on.

---

## Technical Risks

### API Dependency
**Risk:** Etherscan rate limits or goes down
**Mitigation:** Multi-provider fallback (Alchemy, BlockCypher). Queue system for bulk requests.

### Blockchain Data Accuracy
**Risk:** USD values at time of transaction are wrong
**Mitigation:** Use multiple price oracles. Allow manual override. Disclaimer on all outputs.

### Multi-Chain Complexity
**Risk:** Supporting 10+ chains explodes scope
**Mitigation:** Start with Ethereum + Polygon (80% of users). Add chains based on demand.

---

## Market Risks

### Competition Response
**Risk:** Koinly/CoinTracker adds receipts/statements
**Mitigation:** Niche focus on freelancers. Agent ecosystem moat. Community brand.

### Crypto Market Downturn
**Risk:** Fewer freelancers getting paid in crypto
**Mitigation:** Focus on stablecoins (USDC) — used in bull and bear markets.

### Regulatory Ban
**Risk:** Country bans crypto payments
**Mitigation:** Decentralized product, global audience, no custody of funds.

---

## Operational Risks

### Solo Founder Burnout
**Risk:** Scope too big for one person
**Mitigation:** Ship MVP in 4 weeks. Validate before scaling. Hire/freelance for v2.

### Customer Support Overload
**Risk:** Crypto newbies need lots of hand-holding
**Mitigation:** Excellent docs, video tutorials, FAQ. Consider Discord community for support.

---

## Risk Priority Matrix

| Risk | Severity | Likelihood | Priority |
|------|----------|-----------|----------|
| Scope creep | High | High | **1** |
| API dependency | Medium | Medium | **2** |
| Low conversion | High | Medium | **3** |
| Competition response | Medium | High | **4** |
| Founder burnout | High | Medium | **5** |
