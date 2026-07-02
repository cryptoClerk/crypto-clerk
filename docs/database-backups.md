# Database Backup Strategy

## Overview

PostgreSQL database backups for CryptoClerks.

## Current Setup

- **Provider:** Render PostgreSQL
- **Type:** Managed PostgreSQL
- **Size:** Current usage small, will grow with users

## Render Managed Backups (Automatic)

Render automatically creates daily backups for managed PostgreSQL databases:
- **Frequency:** Daily
- **Retention:** 7 days (free tier), 30 days (paid)
- **Recovery:** Point-in-time recovery available

**To verify:** Check Render dashboard → PostgreSQL → Backups tab

## Additional Backup Options

### Option 1: Render CLI Manual Backups

```bash
# Install Render CLI
npm install -g @render/cli

# Create manual backup
render databases backup create <database-id>

# List backups
render databases backup list <database-id>
```

### Option 2: pg_dump Scheduled Backups

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql

# Upload to S3 or cloud storage
aws s3 cp backup_$DATE.sql s3://cryptoclerks-backups/

# Keep only last 30 backups
aws s3 ls s3://cryptoclerks-backups/ | sort | head -n -30 | awk '{print $4}' | xargs -I {} aws s3 rm s3://cryptoclerks-backups/{}
```

**Schedule:** Run via cron job daily at 3 AM

### Option 3: Prisma Migrate + Seed (for schema)

```bash
# Export schema
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script > schema.sql

# This is already version controlled in migrations/ folder
```

## Recommended Strategy

### Phase 1 (Now - Free)
1. Rely on Render automatic daily backups
2. Document recovery process
3. Test recovery once to verify

### Phase 2 (Growth - $20-50/month)
1. Add daily pg_dump to S3/R2
2. Keep 30 days of backups
3. Add monitoring for backup failures

### Phase 3 (Scale - $100+/month)
1. Hourly incremental backups
2. Cross-region replication
3. Automated disaster recovery testing

## Recovery Process

### From Render Backup:
1. Go to Render Dashboard → PostgreSQL → Backups
2. Select backup date
3. Click "Restore" or download SQL
4. For new database: Create new PostgreSQL instance, restore from backup

### From pg_dump:
```bash
# Restore from SQL file
psql $DATABASE_URL < backup_20260701_030000.sql
```

## Disaster Recovery Plan

**RPO (Recovery Point Objective):** 24 hours (daily backups)
**RTO (Recovery Time Objective):** 2 hours (create new DB + restore)

**Steps:**
1. Identify data loss timeframe
2. Select appropriate backup
3. Create new PostgreSQL instance (if needed)
4. Restore from backup
5. Verify data integrity
6. Update DATABASE_URL if new instance
7. Test application connectivity

## Monitoring

Set up alerts for:
- Backup failures (if using custom scripts)
- Database connection issues
- Storage space running low

---

*Document created: 2026-07-01*
