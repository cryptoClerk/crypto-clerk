# CryptoBooks — Agentic Access Plan

## Vision
CryptoBooks becomes the standard infrastructure for AI agents that need to interact with crypto income data.

## Two Agent Categories

### 1. Our Internal Agents (Product Intelligence)

**Auto-Categorization Agent**
- Learns from user's manual edits
- First time user marks `0xABC...` as "Client: Nike" → remembers
- Suggests categories for new transactions
- Confidence thresholds: >80% auto-apply, 50-80% suggest, <50% leave blank

**Smart Description Agent**
- Pattern recognition:
  - Recurring monthly amounts from same address → "Retainer payment"
  - Large one-off → "Project payment"
- Associates ENS names and known addresses with labels

**Tax Helper Agent**
- Year-end audit: "You have 47 uncategorized transactions. Want me to bulk-categorize?"
- Anomaly detection: "This $50,000 payment is 10x your average. Income or transfer?"
- Missing info alerts: "3 transactions lack client names. Your accountant needs these."

**Natural Language Query Agent**
- "How much did I make from Nike last quarter?"
- "Show me all payments over $5,000"
- "Generate a statement for just my consulting work"
- "What was my best month this year?"

---

### 2. External Agents (Customer's AI Assistants)

**The Scenario**
User has their own AI assistant (Claude, ChatGPT, custom agent). They say:
> "Hey agent, send my accountant all my crypto income for Q2."

**The Agent Calls CryptoBooks API:**
```
GET /api/v1/statements?wallet=0x...&start=2025-04-01&end=2025-06-30&format=json
Authorization: Bearer <api_key>
```

**Agent Does:**
1. Gets structured JSON data
2. Formats into professional email
3. Attaches PDF statement
4. Sends to accountant

**All without the user touching CryptoBooks UI.**

---

## API-First Architecture

### Authentication
- API keys for Business tier users
- OAuth 2.0 for third-party agent platforms
- Rate limits: Free 100 req/hr, Pro 1,000/hr, Business 10,000/hr

### Key Endpoints
```
POST /api/v1/receipts/generate       # Generate receipt from tx hash
GET  /api/v1/wallets/{id}/transactions  # List transactions
GET  /api/v1/statements               # Generate statement (JSON or PDF)
POST /api/v1/invoices                 # Create invoice
GET  /api/v1/invoices/{id}/status     # Check payment status on-chain
POST /api/v1/categories/bulk          # Bulk categorize transactions
GET  /api/v1/analytics/summary        # Income summary by period
```

### Webhooks
```
POST https://your-agent.com/webhook/cryptobooks
Event: payment.received
Payload: { tx_hash, amount, token, wallet, timestamp }
```

### Agent SDK (Future)
```javascript
import { CryptoBooksAgent } from '@cryptobooks/agent-sdk';

const cb = new CryptoBooksAgent({ apiKey: '...' });

// Agent asks natural language question
const income = await cb.query("Total income from DAOs in Q2 2025");

// Agent generates and emails statement
const statement = await cb.generateStatement({
  wallets: ['0x...'],
  startDate: '2025-04-01',
  endDate: '2025-06-30',
  format: 'pdf'
});
await cb.email({ to: 'accountant@example.com', attachment: statement });
```

---

## Go-to-Market for Agents
1. **Launch API docs** with clear agent integration examples
2. **Partner with agent platforms** — AutoGPT, LangChain, etc.
3. **Build example agents** — open-source templates
4. **Community:** "Build a CryptoBooks agent" hackathon

---

## Competitive Moat via Agents
If every AI agent that handles freelance finances integrates CryptoBooks:
- We become **infrastructure**, not just a SaaS tool
- Switching cost increases (agents depend on our data format)
- Network effects: more agents → more users → more data → better categorization
