# CryptoBooks — Analytics Plan

## Metrics to Track

### Acquisition
| Metric | Tool | Target |
|--------|------|--------|
| Website visitors | Vercel Analytics | 1,000/mo at launch |
| Signup rate | Custom | 15% of visitors |
| Traffic sources | Vercel + UTM | Know which channel works |

### Activation
| Metric | Definition | Target |
|--------|-----------|--------|
| Receipt generated | User clicks "Generate" | 60% of signups |
| Statement generated | User generates statement | 40% of signups |
| Time to first receipt | From landing to first receipt | < 2 minutes |

### Retention
| Metric | Definition | Target |
|--------|-----------|--------|
| Weekly active users | Logged in + generated something | 30% of signups |
| Monthly active users | Same, monthly | 20% of signups |
| Receipts per active user | Avg per month | 4+ |

### Revenue
| Metric | Definition | Target |
|--------|-----------|--------|
| Free → Pro conversion | % of free users upgrading | 3% |
| Pro → Business conversion | % of Pro upgrading | 1% |
| MRR | Monthly recurring revenue | $10,000 by month 6 |
| Churn | % of paying users canceling | < 10%/mo |
| ARPU | Average revenue per user | $22/mo |

### Referral
| Metric | Definition | Target |
|--------|-----------|--------|
| Referral signups | Signups from referral links | 10% of total |
| NPS score | User satisfaction | > 40 |

---

## Tracking Setup

### Vercel Analytics (Free)
- Page views
- Core Web Vitals
- Visitor geography

### Custom Events (Supabase or Mixpanel)
```javascript
// Track key events
trackEvent('receipt_generated', { chain, token, amount });
trackEvent('statement_generated', { wallet_count, tx_count, date_range });
trackEvent('user_upgraded', { from_plan, to_plan });
trackEvent('api_call', { endpoint, api_key_id });
```

### Stripe Dashboard
- MRR, churn, ARPU
- Subscription events
- Failed payments

---

## Reporting

**Weekly (Monday):**
- New signups
- Receipts/statements generated
- Revenue (if any)
- Top traffic source

**Monthly (1st of month):**
- Full funnel metrics
- Churn analysis
- Feature usage breakdown
- Plan to improve weakest metric

---

## Dashboard (Internal)

Simple admin page at `/admin` (protected):
- Total users, active users, paying users
- Recent receipts/statements
- Revenue chart
- Error logs

**Not in MVP** — manual Supabase queries + Stripe dashboard suffice at first.
