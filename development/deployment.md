# CryptoBooks — Deployment Strategy

## Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Production** | cryptobooks.app | Live user-facing app |
| **Staging** | staging.cryptobooks.app | Pre-production testing |
| **Preview** | *.vercel.app | Per-PR preview deployments |

## Vercel Setup

1. **Connect GitHub repo** to Vercel
2. **Auto-deploy on push:**
   - `main` branch → Production
   - `staging` branch → Staging
   - Pull requests → Preview deployments
3. **Environment variables:**
   - `NEXT_PUBLIC_APP_URL`
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `ETHERSCAN_API_KEY`, `POLYGONSCAN_API_KEY`, etc.
   - `ALCHEMY_API_KEY`
   - `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (or Supabase auth keys)

## Database Migrations

**With Prisma:**
```bash
# Local development
npx prisma migrate dev --name add_receipts_table

# Deploy to production
npx prisma migrate deploy
```

**Strategy:**
- Migrations run in CI/CD pipeline (GitHub Actions)
- Production DB migrations require manual approval
- Never delete columns in migration — add nullable, backfill, then make required

## Domain Setup

1. Buy domain (Cloudflare, Namecheap, or Vercel)
2. Add to Vercel project
3. Configure DNS: CNAME `www` → `cname.vercel-dns.com`
4. Enable HTTPS (automatic on Vercel)

## Monitoring (Free Tier)

| Tool | Purpose |
|------|---------|
| **Vercel Analytics** | Web vitals, performance |
| **Vercel Logs** | Error tracking |
| **Supabase Dashboard** | DB performance, query times |
| **UptimeRobot** | Free uptime monitoring (checks every 5 min) |

## Backup Strategy

- Supabase provides daily automated backups on free tier
- For critical data: weekly pg_dump exports to cloud storage (S3/R2)
- Point-in-time recovery available on Pro tier ($25/mo)

## Rollback Plan

1. **Code rollback:** Revert commit, push to main → Vercel auto-deploys previous version (< 2 min)
2. **DB rollback:** Restore from Supabase backup (if migration went bad)
3. **Feature flags:** Use simple env vars or Supabase config table to toggle features without deploy
