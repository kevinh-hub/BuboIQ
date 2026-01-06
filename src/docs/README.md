# BuboIQ Back Office - Documentation Index

**Complete documentation for the production-ready Super Admin Console**

---

## 📚 Documentation Files

### 1. [QUICK_START.md](./QUICK_START.md) - **START HERE**
**Get Back Office running in 5 minutes**

- Database migrations (copy & paste SQL)
- Create super admin user (one SQL command)
- Deploy edge functions
- Access `/admin` route
- Verify everything works

**Use this if:** You want to get Back Office running ASAP

---

### 2. [ADMIN_README.md](./ADMIN_README.md)
**Complete feature documentation and API reference**

- Full feature descriptions (all 6 admin pages)
- API endpoint documentation with examples
- Database schema overview
- Environment variables
- Security model (RLS, audit logging)
- Keyboard shortcuts
- Troubleshooting guide

**Use this if:** You need to understand how Back Office works or integrate with the API

---

### 3. [RUNBOOK_BACK_OFFICE.md](./RUNBOOK_BACK_OFFICE.md)
**Operations playbook for production incidents**

- Common operations (tier changes, trial extensions, impersonation)
- Incident response playbooks
- Database queries for troubleshooting
- Rollback procedures
- Monitoring & alerts setup
- Data retention & GDPR compliance
- Backup & disaster recovery

**Use this if:** You're on-call or handling a production incident

---

### 4. [TESTING_SPEC.md](./TESTING_SPEC.md)
**Comprehensive testing guide**

- Unit tests (Vitest)
- Integration tests (Supabase)
- E2E tests (Playwright)
- RLS policy tests
- Contract tests (Stripe webhooks)
- Accessibility tests (Axe)
- CI/CD integration
- Test data policy (NO MOCK DATA)

**Use this if:** You're writing tests or setting up CI/CD

---

### 5. [BACK_OFFICE_SUMMARY.md](./BACK_OFFICE_SUMMARY.md)
**Executive summary and architecture overview**

- What we built (high-level)
- Architecture diagram
- Feature descriptions with use cases
- Data flow examples
- Security model
- Success criteria
- Metrics & KPIs
- Future enhancements roadmap

**Use this if:** You need a high-level overview or presenting to stakeholders

---

### 6. [MIGRATIONS.sql](./MIGRATIONS.sql)
**Complete database schema (run once)**

- All table definitions
- RLS policies
- Materialized views
- Indexes
- Triggers
- pg_cron jobs
- Grants & permissions

**Use this if:** Setting up database for the first time

---

### 7. [postman_collection.json](./postman_collection.json)
**Postman API testing collection**

- All 15+ admin API endpoints
- Request/response examples
- Authentication setup
- Environment variables
- Error handling examples

**Use this if:** Testing API endpoints manually or setting up automated tests

---

## 🚀 Quick Navigation

### I want to...

**...get started quickly**
→ [QUICK_START.md](./QUICK_START.md)

**...understand a specific feature**
→ [ADMIN_README.md](./ADMIN_README.md) → Find feature in table of contents

**...troubleshoot a production issue**
→ [RUNBOOK_BACK_OFFICE.md](./RUNBOOK_BACK_OFFICE.md) → Search for symptom

**...write tests**
→ [TESTING_SPEC.md](./TESTING_SPEC.md) → Find test type (unit/integration/e2e)

**...present to stakeholders**
→ [BACK_OFFICE_SUMMARY.md](./BACK_OFFICE_SUMMARY.md)

**...set up the database**
→ [MIGRATIONS.sql](./MIGRATIONS.sql)

**...test the API**
→ [postman_collection.json](./postman_collection.json)

---

## 📋 Pre-Deployment Checklist

Before deploying Back Office to production, verify:

- [ ] **Database:** All migrations run successfully ([MIGRATIONS.sql](./MIGRATIONS.sql))
- [ ] **Auth:** At least one super_admin user exists
- [ ] **Integrations:** Stripe webhook configured (optional but recommended)
- [ ] **Tests:** All tests pass ([TESTING_SPEC.md](./TESTING_SPEC.md))
- [ ] **Security:** RLS policies tested (no cross-org data leaks)
- [ ] **Audit:** Every admin action creates audit log entry
- [ ] **UI:** Empty states render correctly (no mock data)
- [ ] **Docs:** Team has read QUICK_START and RUNBOOK
- [ ] **Monitoring:** Alerts configured for critical metrics

---

## 🔑 Key Principles

All documentation follows these principles:

### 1. **No Mock Data**
- If data doesn't exist, show empty state
- Never generate fake/random data
- All metrics computed from real database queries

### 2. **Security First**
- Every admin action audited
- RLS prevents cross-org access
- JWT verification on every API call

### 3. **Production Ready**
- Real error handling, no silent failures
- Rollback on operation failure
- Helpful error messages (no technical jargon)

### 4. **Fully Documented**
- Every feature has docs + examples
- Every API endpoint has request/response samples
- Every incident has playbook

---

## 🏗️ Architecture Summary

```
┌──────────────────┐
│   Frontend       │  React + TypeScript + Tailwind
│   /admin route   │  SuperAdminGuard protection
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Edge Functions  │  Hono + Zod validation
│  /admin/* routes │  JWT verification + audit logging
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   PostgreSQL     │  RLS policies + audit_log
│   Supabase       │  Real data only (no mocks)
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  External APIs   │  Stripe, Resend, Streak
└──────────────────┘
```

---

## 📊 What Back Office Does

### Organizations Tab
Manage all customer orgs, change tiers, extend trials, impersonate for debugging

### Billing Tab
View MRR, failed payments, expiring trials, retry charges

### Analytics Tab
Platform-wide metrics: active orgs, issues opened, Guided Fix rates, response times

### Support Tab
Unified support queue across all channels, add notes, trigger emails

### System Tab
Feature flags, background job health, DB latency, webhook monitoring

### Compliance Tab
Audit log viewer, evidence export for SOC2/GDPR

---

## 🆘 Support & Troubleshooting

**First steps:**
1. Check [RUNBOOK_BACK_OFFICE.md](./RUNBOOK_BACK_OFFICE.md) for your issue
2. Check Supabase Dashboard → Logs for errors
3. Check browser console for client-side errors

**Common issues:**
- "Unauthorized" → Check super_admin role ([RUNBOOK](./RUNBOOK_BACK_OFFICE.md#problem-unauthorized-error-in-back-office))
- Empty billing → Stripe webhook not configured ([RUNBOOK](./RUNBOOK_BACK_OFFICE.md#problem-empty-billing-data))
- No analytics → Materialized view not refreshed ([RUNBOOK](./RUNBOOK_BACK_OFFICE.md#problem-analytics-showing-no-data-yet))

**Still stuck?**
- On-call engineer: See PagerDuty rotation
- Supabase support: support@supabase.com
- Stripe support: https://support.stripe.com/

---

## 🔄 Version History

### v1.0.0 (2024-01-15)
- Initial production release
- All 6 admin pages (Orgs, Billing, Analytics, Support, System, Compliance)
- 15+ admin API endpoints
- Full audit logging
- RLS tenant isolation
- Zero mock data
- Complete documentation

---

## 📞 Contact

**Engineering Team:** #platform-team Slack channel  
**On-Call:** See PagerDuty rotation  
**Product Owner:** [Your name]  
**Tech Lead:** [Your name]

---

## 📝 License & Security

**Security:** This documentation contains production system details. **Do not share publicly.**

**Internal use only.** Treat as confidential.

---

**Built with zero compromises. Production-ready from day one.** 🚀

**Start here:** [QUICK_START.md](./QUICK_START.md)
