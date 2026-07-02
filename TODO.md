# CryptoClerks — Remaining Tasks

## Post-MVP Rough Edges

1. **Dashboard auth integration** — Usage stats currently hardcoded to demo user, need real auth context
2. **Statement history UI** — API endpoint exists (`/api/statements/history`) but not displayed in dashboard
3. **Email service** — Logs to console, needs real provider (Resend/SendGrid/AWS SES)
4. **UI polish** — Mobile responsiveness, empty states, loading skeletons
5. **Landing page** — Add real screenshots/testimonials instead of placeholder text

## Deferred (explicitly)

6. **Stripe payments** — Payment processing for invoices
7. **SDK for human developers** — Typed npm package `@cryptoclerks/sdk`
8. **Publish MCP to npm** — Package built but not published to registry

## Completed Today (2026-07-01)

- ✅ Receipts (tx hash → PDF)
- ✅ Statements (wallets → PDF + CSV)
- ✅ Invoices (create → PDF + payment link)
- ✅ Multi-chain (6 chains)
- ✅ Auth + dashboard
- ✅ API v1 with full documentation
- ✅ MCP server for AI agents
- ✅ Usage tracking infrastructure
- ✅ Email infrastructure (placeholder)
- ✅ Rebrand: CryptoBooks → CryptoClerks

## Notes

- MVP is functionally complete and deployed
- Core loop works end-to-end
- Ready for demo/showing to users
- Deferred items can be added as user feedback comes in
