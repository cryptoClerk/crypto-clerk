# CryptoBooks — Development Phases

## Phase Breakdown

### Phase 0: Foundation
**Duration:** Week 1
**Focus:** Tooling, infrastructure, auth
**Risk if skipped:** Everything else is harder

### Phase 1: Receipt Generator MVP
**Duration:** Week 2
**Focus:** Core value proposition — fastest path to "holy shit this works"
**Success metric:** 100 receipts generated in first week

### Phase 2: Statements + Multi-Wallet
**Duration:** Week 3
**Focus:** The "big cleanup" use case — catch-up on historical transactions
**Success metric:** 50 statements generated in first week

### Phase 3: Launch
**Duration:** Week 4
**Focus:** Polish, payments, landing page, go-to-market
**Success metric:** 200 signups in first month

### Phase 4: Scale
**Duration:** Months 2-3
**Focus:** Invoices, API, agents, community
**Success metric:** 20 paying users by month 2

---

## Decision Gates

**Gate 1 (End of Week 1):**
- Is Etherscan API reliable enough?
- Is auth working smoothly?
- **Go/No-go:** Proceed to receipt generator

**Gate 2 (End of Week 2):**
- Are users generating receipts? (even just us testing)
- Is PDF quality acceptable?
- **Go/No-go:** Proceed to statements

**Gate 3 (End of Week 3):**
- Can we generate a full-year statement in under 30 seconds?
- Is USD value accuracy good enough?
- **Go/No-go:** Proceed to launch prep

**Gate 4 (Launch Day):**
- Is Stripe working?
- Is the landing page compelling?
- **Go/No-go:** Public launch

---

## Scope Control Rules

1. **No invoices in MVP.** Phase 4 only.
2. **No mobile app.** Responsive web only until 1,000 users.
3. **No non-EVM chains.** Solana, Bitcoin come after v2.
4. **No smart contracts.** Not needed for MVP.
5. **No white-label.** Business tier is manual until 50 Business customers.

**If it's not in Phase 0-3, it doesn't exist for launch.**
