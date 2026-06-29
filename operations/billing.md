# CryptoBooks — Billing Plan

## Stripe Setup

### Products

**Pro Plan — $19/month**
- Unlimited receipts
- Unlimited statements
- Custom branding (logo, colors)
- CSV export
- Priority support

**Business Plan — $49/month**
- Everything in Pro
- Multi-user (up to 5 team members)
- API access
- White-label PDFs (remove CryptoBooks branding)
- Webhooks
- Dedicated support

### Stripe Configuration

```
Stripe Dashboard → Products → Create Product
- Name: CryptoBooks Pro
- Price: $19.00 / month
- Billing: Recurring, monthly

- Name: CryptoBooks Business
- Price: $49.00 / month
- Billing: Recurring, monthly
```

### Checkout Flow

1. User clicks "Upgrade to Pro" on pricing page
2. Redirect to Stripe Checkout (hosted)
3. User enters payment info
4. Stripe redirects back to `/success?session_id=...`
5. Webhook `checkout.session.completed` updates user's plan in DB
6. User sees "Pro" badge in dashboard

### Webhooks to Handle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activate subscription, update user plan |
| `invoice.paid` | Record payment, extend access |
| `invoice.payment_failed` | Notify user, grace period |
| `customer.subscription.deleted` | Downgrade to free |

### Customer Portal

Stripe Customer Portal allows users to:
- Update payment method
- Cancel subscription
- View billing history

**Integration:**
```typescript
// Generate portal link
const session = await stripe.billingPortal.sessions.create({
  customer: user.stripeCustomerId,
  return_url: 'https://cryptobooks.app/dashboard',
});
```

---

## Free Tier Limits

| Feature | Free | Pro | Business |
|---------|------|-----|----------|
| Receipts/mo | 5 | Unlimited | Unlimited |
| Statements/mo | 5 | Unlimited | Unlimited |
| Wallets | 3 | Unlimited | Unlimited |
| Branding | CryptoBooks default | Custom | White-label |
| CSV Export | No | Yes | Yes |
| API Access | No | No | Yes |
| Team Members | 1 | 1 | 5 |

---

## Revenue Tracking

**Stripe Dashboard shows:**
- MRR (monthly recurring revenue)
- Churn rate
- ARPU (average revenue per user)
- Failed payments
- Refunds

**Internal tracking:**
- `subscriptions` table in Supabase
- Track plan changes (upgrades/downgrades)
- Track revenue by channel (if UTM params used)

---

## Pricing Experiments (Future)

- Annual discount: $190/year (2 months free)
- Referral program: 1 month free for referrer + referred
- Student/non-profit discount
- Pay-as-you-go for infrequent users
