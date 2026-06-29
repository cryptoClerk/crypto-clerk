# CryptoBooks — Security & Compliance

## Data We Handle
- Public wallet addresses (user-provided)
- Transaction hashes (public blockchain data)
- Client names and service descriptions (user-provided)
- Business info (name, address — user-provided)
- Email addresses (for accounts)
- **We do NOT handle:** private keys, seed phrases, wallet credentials

---

## Security Measures

### Authentication
- Supabase Auth or Clerk (industry standard)
- Email/password + OAuth (Google)
- Wallet connect for convenience, NOT for auth
- JWT tokens with short expiry
- HTTPS only

### Data Storage
- Wallet addresses: encrypted at rest in PostgreSQL
- User business info: encrypted at rest
- Transaction data: fetched from chain explorers, not stored unless user saves
- **No private keys ever touch our servers**

### API Security
- Rate limiting per API key
- CORS restricted to our domain
- Input validation on all endpoints
- No raw SQL — use ORM (Prisma)

### Infrastructure
- Vercel (edge network, DDoS protection)
- Supabase (managed PostgreSQL, SOC 2)
- Environment variables in Vercel (encrypted)

---

## Compliance Considerations

### Financial Services Regulations
**Risk:** Presenting crypto txns as "bank statements" may trigger financial services regs in some jurisdictions.

**Mitigation:**
- Call them "Transaction Summaries" or "Income Reports" not "Bank Statements"
- Include disclaimer: "Not a bank statement. Generated from public blockchain data."
- Avoid language implying we are a financial institution

### GDPR / CCPA
- Right to delete: user can delete account + all data
- Data export: user can download all their data
- Minimal data collection: only what's needed
- No selling user data

### Tax Jurisdiction
- We generate reports, we do NOT give tax advice
- Disclaimer: "Consult a tax professional"
- USD values are estimates based on historical prices

### Terms of Service
- Users warrant they own the wallet addresses they add
- Prohibited use: money laundering, sanctions evasion
- We reserve right to suspend for ToS violations

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API key abuse (Etherscan) | Medium | Medium | Rate limits, multiple keys, Alchemy fallback |
| User adds wrong wallet | High | Low | Clearly labeled, easy to remove |
| Data breach | Low | High | Encryption, SOC 2 providers, no private keys |
| Regulatory scrutiny | Medium | Medium | Disclaimers, "not a bank" positioning |
| Competitor copies features | High | Medium | Speed, brand, agent ecosystem moat |
