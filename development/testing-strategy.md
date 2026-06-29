# CryptoBooks — Testing Strategy

## Testing Pyramid

```
    /\\
   /  \\      E2E (Playwright) — critical user flows
  /----\\
 /      \\    Integration (Vitest + MSW) — API routes, data fetching
/--------\\
           Unit (Vitest) — utilities, helpers, pure functions
```

## Unit Tests (Vitest)

**What to test:**
- Transaction hash validation (correct format per chain)
- USD price calculation (from crypto amount + historical price)
- Date formatting utilities
- Receipt/statement data transformation
- API response parsing (Etherscan → our format)

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { validateTxHash } from './utils';

describe('validateTxHash', () => {
  it('accepts valid Ethereum tx hash', () => {
    expect(validateTxHash('0xabc123...', 'ethereum')).toBe(true);
  });
  
  it('rejects invalid hash', () => {
    expect(validateTxHash('not-a-hash', 'ethereum')).toBe(false);
  });
});
```

## Integration Tests (Vitest + MSW)

**What to test:**
- API route handlers (mock Etherscan responses)
- Database queries with Prisma (test database)
- Auth flows (mock Supabase/Clerk)

**Setup:**
- Mock server worker (MSW) intercepts HTTP requests
- Separate test database (Supabase local or SQLite)
- Reset DB between tests

## E2E Tests (Playwright)

**Critical flows to test:**
1. **Receipt generation (no auth):**
   - Visit homepage
   - Paste tx hash
   - Fill client name + description
   - Click generate
   - Verify PDF download

2. **Signup + statement generation:**
   - Generate 5 receipts (hit limit)
   - Click "Sign up to continue"
   - Create account
   - Add wallet
   - Generate statement
   - Verify PDF contains expected transactions

3. **Invoice creation + payment:**
   - Log in
   - Create invoice
   - Verify hosted payment page loads
   - (Optional: mock payment confirmation)

**Run config:**
```bash
# Run E2E tests
npx playwright test

# Run with UI for debugging
npx playwright test --ui

# Run specific test
npx playwright test receipt-generator.spec.ts
```

## Manual Testing Checklist

### Receipts
- [ ] Valid tx hash on Ethereum → generates correct receipt
- [ ] Valid tx hash on Polygon → generates correct receipt
- [ ] Invalid tx hash → shows error
- [ ] Transaction not found → shows error
- [ ] USD value displays correctly
- [ ] PDF download works on Chrome, Safari, Firefox
- [ ] Mobile: input + generate works on iOS Safari

### Statements
- [ ] Single wallet, 1 month → correct transactions
- [ ] Multiple wallets → combined transactions
- [ ] No transactions in range → shows "no data" message
- [ ] CSV export has correct columns
- [ ] Large statement (500+ txns) → doesn't timeout

### Auth
- [ ] Sign up with email
- [ ] Sign up with Google
- [ ] Login
- [ ] Password reset
- [ ] Logout

## CI/CD Integration

**GitHub Actions workflow:**
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npx playwright install
      - run: npm run test:e2e
```

## Test Data

**Mock Etherscan responses** stored in `tests/fixtures/`
- Sample transactions (ERC-20 transfer, ETH transfer, failed tx)
- Sample token transfer lists
- Sample balances

**Never use real API keys in tests** — use mock responses.
