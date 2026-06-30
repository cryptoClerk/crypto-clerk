# CryptoBooks API Reference

Base URL: `https://crypto-clerk.onrender.com/api`

---

## Authentication

Most endpoints use **IP-based authentication** for the free tier. When Supabase Auth is configured, pass a Bearer token in the Authorization header:

```bash
Authorization: Bearer <supabase-jwt-token>
```

---

## Rate Limiting

All endpoints are rate limited. Response headers include:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when the window resets

Default limits:
- Receipts: 20 requests/minute
- Transaction fetch: 30 requests/minute

---

## Health Check

### GET /api/health

Check if the API is running and database is connected.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-06-30T12:00:00Z",
  "checks": {
    "database": "ok"
  }
}
```

**Response (503):**
```json
{
  "status": "unhealthy",
  "timestamp": "2024-06-30T12:00:00Z",
  "checks": {
    "database": "error"
  }
}
```

---

## Receipts

### GET /api/receipts

List all receipts for the current IP (or authenticated user).

**Query Parameters:**
- `page` (number, optional): Page number, default 1
- `limit` (number, optional): Items per page, default 20, max 100

**Response (200):**
```json
{
  "receipts": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3,
    "hasMore": true
  },
  "count": 50,
  "freeTierLimit": 5,
  "remaining": 0
}
```

### POST /api/receipts

Create a new receipt from a blockchain transaction.

**Request Body:**
```json
{
  "txHash": "0x...",
  "chain": "ethereum",
  "clientName": "Acme Corp",
  "description": "Website design payment",
  "businessName": "My Design Co",
  "businessAddress": "123 Main St"
}
```

**Validation:**
- `txHash`: Must be 0x + 64 hex characters
- `chain`: Required, max 20 chars
- `clientName`: Required, max 100 chars
- `description`: Required, max 500 chars

**Response (200):**
```json
{
  "success": true,
  "receipt": { ... },
  "usdIsEstimated": false
}
```

**Response (429):** Rate limit exceeded
**Response (400):** Validation error

---

## Wallets

### GET /api/wallets

List all wallets.

**Query Parameters:**
- `page` (number, optional): Page number, default 1
- `limit` (number, optional): Items per page, default 50, max 100

**Response (200):**
```json
{
  "wallets": [...],
  "pagination": { ... }
}
```

### POST /api/wallets

Add a new wallet address.

**Request Body:**
```json
{
  "address": "0x...",
  "chain": "ethereum",
  "label": "Main wallet"
}
```

**Validation:**
- `address`: Must be 0x + 40 hex characters
- `chain`: Required, max 20 chars
- `label`: Optional, max 100 chars

### DELETE /api/wallets?id={id}

Remove a wallet by ID.

---

## Transactions

### GET /api/transactions/fetch

Fetch real blockchain transaction data.

**Query Parameters:**
- `txHash` (string, required): Transaction hash
- `chain` (string, optional): Chain name (auto-detected if omitted)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "txHash": "0x...",
    "chain": "ethereum",
    "chainName": "Ethereum",
    "fromAddress": "0x...",
    "toAddress": "0x...",
    "amount": "100.5",
    "token": "USDC",
    "usdValue": "100.50",
    "usdIsEstimated": false,
    "date": "2024-06-30T12:00:00Z"
  }
}
```

---

## Statements

### POST /api/statements/generate

Generate a financial statement for a wallet address.

**Request Body:**
```json
{
  "walletAddress": "0x...",
  "chain": "ethereum",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x...",
    "chain": "ethereum",
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "transactions": [...],
    "totalIncome": 5000.00,
    "totalTransactions": 45
  }
}
```

---

## Stripe (Phase 3)

### POST /api/stripe/checkout

Create a Stripe Checkout session for subscription.

**Request Body:**
```json
{
  "priceId": "price_...",
  "userId": "user-uuid"
}
```

**Response (200):**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

### POST /api/stripe/webhook

Stripe webhook handler for subscription events. Not for direct use.

### POST /api/stripe/portal

Create a Stripe Customer Portal session.

**Request Body:**
```json
{
  "customerId": "cus_..."
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request — validation error |
| 401 | Unauthorized — authentication required |
| 429 | Too Many Requests — rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable — Stripe/DB not configured |

## Pagination Format

All list endpoints use the same pagination structure:

```json
{
  "page": 1,
  "limit": 20,
  "total": 100,
  "totalPages": 5,
  "hasMore": true
}
```

Request the next page by incrementing `page` until `hasMore` is false.
