# CryptoBooks — API Specification

## Base URL
```
https://api.cryptobooks.app/v1
```

## Authentication
- **Free/Pro:** Session cookie (Supabase/Clerk auth)
- **Business:** API Key in header: `Authorization: Bearer <api_key>`

## Rate Limits
| Plan | Limit |
|------|-------|
| Free | 100 requests/hour |
| Pro | 1,000 requests/hour |
| Business | 10,000 requests/hour |

---

## Endpoints

### Receipts

#### POST /receipts/generate
Generate a receipt from a transaction hash.

**Request:**
```json
{
  "txHash": "0xabc123...",
  "chain": "ethereum",
  "clientName": "Acme DAO",
  "description": "Landing page design",
  "businessName": "Alex Design Co",
  "businessAddress": "123 Main St"
}
```

**Response:**
```json
{
  "id": "rec_123",
  "txHash": "0xabc123...",
  "amount": "2500.00",
  "token": "USDC",
  "usdValue": "2500.00",
  "fromAddress": "0xclient...",
  "toAddress": "0xalex...",
  "date": "2025-06-15T10:30:00Z",
  "pdfUrl": "https://cryptobooks.app/r/rec_123.pdf",
  "createdAt": "2025-06-15T10:35:00Z"
}
```

---

### Wallets

#### POST /wallets
Add a wallet to user's account.

**Request:**
```json
{
  "address": "0x123...",
  "chain": "ethereum",
  "label": "Main Income Wallet"
}
```

#### GET /wallets/{id}/transactions
Get transactions for a wallet.

**Query params:**
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `token` (optional filter: USDC, USDT, etc.)

**Response:**
```json
{
  "wallet": "0x123...",
  "chain": "ethereum",
  "transactions": [
    {
      "txHash": "0xabc...",
      "date": "2025-06-15T10:30:00Z",
      "from": "0xclient...",
      "to": "0x123...",
      "amount": "2500.00",
      "token": "USDC",
      "usdValue": "2500.00",
      "category": "Design Income",
      "clientName": "Acme DAO"
    }
  ]
}
```

---

### Statements

#### POST /statements/generate
Generate a statement.

**Request:**
```json
{
  "walletIds": ["wal_1", "wal_2"],
  "startDate": "2025-04-01",
  "endDate": "2025-06-30",
  "format": "pdf" // or "csv" or "json"
}
```

**Response:**
```json
{
  "id": "stmt_123",
  "startDate": "2025-04-01",
  "endDate": "2025-06-30",
  "totalIncome": "18500.00",
  "totalTransactions": 23,
  "pdfUrl": "https://cryptobooks.app/s/stmt_123.pdf",
  "csvUrl": "https://cryptobooks.app/s/stmt_123.csv"
}
```

---

### Invoices

#### POST /invoices
Create an invoice.

**Request:**
```json
{
  "clientName": "Acme DAO",
  "clientEmail": "finance@acme.dao",
  "lineItems": [
    { "description": "Logo design", "quantity": 1, "rate": "3000.00" }
  ],
  "dueDate": "2025-07-15",
  "paymentWallet": "0x123...",
  "paymentToken": "USDC",
  "paymentChain": "ethereum"
}
```

#### GET /invoices/{id}/status
Check if invoice has been paid on-chain.

**Response:**
```json
{
  "id": "inv_123",
  "status": "paid",
  "paymentTxHash": "0xdef...",
  "paidAt": "2025-06-20T14:22:00Z",
  "amountReceived": "3000.00"
}
```

---

### Analytics

#### GET /analytics/summary
Income summary for a period.

**Query params:**
- `startDate`
- `endDate`
- `walletIds` (optional)

**Response:**
```json
{
  "totalIncome": "18500.00",
  "totalTransactions": 23,
  "averagePayment": "804.35",
  "topClient": "Acme DAO",
  "topClientAmount": "7500.00",
  "byMonth": [
    { "month": "2025-04", "income": "5000.00", "transactions": 5 },
    { "month": "2025-05", "income": "6500.00", "transactions": 8 },
    { "month": "2025-06", "income": "7000.00", "transactions": 10 }
  ]
}
```

---

### Webhooks

#### POST /webhooks
Register a webhook.

**Request:**
```json
{
  "url": "https://my-agent.com/webhook",
  "events": ["payment.received", "invoice.paid"]
}
```

**Webhook payload example:**
```json
{
  "event": "payment.received",
  "data": {
    "txHash": "0xabc...",
    "amount": "2500.00",
    "token": "USDC",
    "wallet": "0x123...",
    "timestamp": "2025-06-15T10:30:00Z"
  }
}
```
