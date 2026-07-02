# Staging Environment Setup

## Overview

We need a staging environment for testing before deploying to production.

## Current Setup

- **Production:** https://crypto-clerk.onrender.com (Render)
- **Database:** PostgreSQL on Render (production)
- **Code:** GitHub main branch auto-deploys to production

## Recommended Staging Setup

### Option 1: Render Staging (Recommended)

1. Create a new Render service: `crypto-clerk-staging`
2. Point to a `staging` branch in GitHub
3. Use separate environment variables:
   - `DATABASE_URL` → staging PostgreSQL database
   - `ETHERSCAN_API_KEY` → same key (or test key)
   - `SENTRY_DSN` → optional for staging
   - `RESEND_API_KEY` → test key or omit
4. Auto-deploy on `staging` branch push

### Option 2: Vercel Preview Deployments

1. Connect GitHub repo to Vercel
2. Preview deployments for every PR
3. Use staging database for preview builds
4. Simple but limited to frontend only

### Option 3: Local Docker

1. Docker Compose with:
   - Next.js app
   - PostgreSQL database
   - Redis (for caching, optional)
2. Good for local development
3. Not accessible for client testing

## Recommended Approach: Render Staging

**Steps:**
1. Create `staging` branch in GitHub
2. Create new Render service pointing to `staging` branch
3. Create staging PostgreSQL database
4. Set environment variables for staging
5. Configure auto-deploy
6. Test payment flow on staging before merging to main

## Environment Variables for Staging

```
DATABASE_URL=postgresql://staging-user:pass@staging-db.render.com/staging
ETHERSCAN_API_KEY=your_key_here
COINGECKO_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=https://crypto-clerk-staging.onrender.com
RESEND_API_KEY=optional_for_staging
SENTRY_DSN=optional_for_staging
CRON_SECRET=random_secret_for_staging
```

## Deployment Flow

1. Development → local testing
2. Push to `staging` branch → auto-deploy to staging
3. Test on staging environment
4. PR from `staging` to `main`
5. Merge to `main` → auto-deploy to production

---

*Document created: 2026-07-01*
