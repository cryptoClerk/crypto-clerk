# CryptoBooks — Customer Lifecycle

## Persona: Crypto Freelancer
**Name:** Alex
**Work:** UX designer, gets paid in USDC by DAOs and crypto startups
**Pain:** Landlord wants 3 months of bank statements. Alex has Etherscan.

---

## Lifecycle Stages

### 1. Discovery
**Where:** Crypto Twitter thread, Reddit post, Product Hunt
**Trigger:** Sees a demo of "generate a receipt from a tx hash in 30 seconds"
**Action:** Clicks link → lands on cryptobooks.app

### 2. First Use (No Signup)
**Goal:** Generate one receipt
**Flow:**
1. Paste tx hash in hero input
2. Auto-pull: chain, amount, date, addresses
3. Fill in: "Client: Acme DAO", "Service: Landing page design"
4. Download PDF
**Time:** 30 seconds
**Emotion:** "Holy shit, that was easy"

### 3. Activation (Signup Required)
**Trigger:** Tries to generate a statement (multi-txn) or hits 5-receipt limit
**Flow:**
1. Email + password or Google OAuth
2. Optional: connect wallet (MetaMask, WalletConnect)
3. Land on dashboard

### 4. Habit Formation
**Weekly actions:**
- Log in after getting paid
- Paste tx hash, generate receipt, done
- Monthly: generate statement for records

### 5. The "Big Cleanup" (Onboarding v2)
**Trigger:** Tax season or new user with 2 years of unrecorded payments
**Flow:**
1. Bulk paste 5-20 wallet addresses
2. Pick date range (e.g., "all of 2024")
3. System pulls all transactions
4. Bulk categorize: select 50 txns → "Mark as Design Income"
5. Generate annual statement + CSV export
**Time:** 15-30 minutes for years of data
**Emotion:** "I should have had this 2 years ago"

### 6. Expansion
**Trigger:** Needs more features
**Upgrade path:**
- Free → Pro: $19/mo for unlimited + custom branding
- Pro → Business: $49/mo for team + API + white-label

### 7. Advocacy
**Actions:**
- Shares CryptoBooks receipt screenshots on Twitter
- Recommends to freelancer friends
- Requests API access for their own automation

---

## Key Conversion Points
| Stage | Metric | Target |
|-------|--------|--------|
| Visit → First receipt | Conversion | 20% |
| First receipt → Signup | Conversion | 15% |
| Signup → Generate statement | Activation | 40% |
| Active user → Pro upgrade | Conversion | 3% |
| Pro → Business upgrade | Conversion | 1% |
