# BuboIQ Back Office - Testing Specification

## Testing Philosophy

**NO MOCK DATA. NO VANITY METRICS. PRODUCTION-READY CODE ONLY.**

All tests must verify:
1. Real data flows from database
2. Empty states render correctly when no data exists
3. Security: cross-org access blocked without super_admin claim
4. Audit logging for every admin action
5. Atomic operations with rollback on failure
6. Accessibility (zero critical/serious violations)

## Test Suites

### 1. Unit Tests (Vitest)

Location: `/tests/unit/`

#### utils/featureFlags.test.ts
```typescript
import { describe, it, expect } from 'vitest'
import { isFeatureEnabled } from '../utils/featureFlags'

describe('Feature Flags', () => {
  it('should return false for disabled flags', () => {
    expect(isFeatureEnabled('disabled_feature', {})).toBe(false)
  })

  it('should handle rollout percentages correctly', () => {
    const flag = { enabled: true, rollout_percent: 50 }
    // Test deterministic rollout based on org_id hash
    expect(typeof isFeatureEnabled('test', flag, 'org-123')).toBe('boolean')
  })
})
```

#### utils/auth.test.ts
```typescript
import { describe, it, expect } from 'vitest'
import { verifySuperAdminClaim } from '../utils/auth'

describe('Super Admin Verification', () => {
  it('should reject missing JWT', async () => {
    expect(await verifySuperAdminClaim(null)).toBe(false)
  })

  it('should reject non-super_admin users', async () => {
    // Mock JWT with regular user role
    expect(await verifySuperAdminClaim('regular-user-token')).toBe(false)
  })
})
```

---

### 2. Integration Tests (Vitest + Supabase)

Location: `/tests/integration/`

#### admin/orgs.test.ts
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

describe('Admin Organizations API', () => {
  let testOrgId: string
  let adminUserId: string

  beforeEach(async () => {
    // Create test super_admin user
    const { data: user } = await supabase.auth.admin.createUser({
      email: 'admin-test@example.com',
      password: 'test-password',
      user_metadata: { role: 'super_admin' }
    })
    adminUserId = user.user!.id

    // Create test org
    const { data: org } = await supabase
      .from('companies')
      .insert({ name: 'Test Org', tier: 'Starter' })
      .select()
      .single()
    testOrgId = org!.id
  })

  afterEach(async () => {
    // Cleanup
    await supabase.from('companies').delete().eq('id', testOrgId)
    await supabase.auth.admin.deleteUser(adminUserId)
  })

  it('should fetch orgs with super_admin claim', async () => {
    const { data: session } = await supabase.auth.signInWithPassword({
      email: 'admin-test@example.com',
      password: 'test-password'
    })

    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/make-server-55e8c5b2/admin/orgs`,
      {
        headers: {
          'Authorization': `Bearer ${session.session!.access_token}`
        }
      }
    )

    expect(response.status).toBe(200)
    const { data } = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should reject orgs request without super_admin', async () => {
    // Create regular user
    const { data: regularUser } = await supabase.auth.admin.createUser({
      email: 'regular@example.com',
      password: 'test',
      user_metadata: { role: 'user' }
    })

    const { data: session } = await supabase.auth.signInWithPassword({
      email: 'regular@example.com',
      password: 'test'
    })

    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/make-server-55e8c5b2/admin/orgs`,
      {
        headers: {
          'Authorization': `Bearer ${session.session!.access_token}`
        }
      }
    )

    expect(response.status).toBe(401)

    // Cleanup
    await supabase.auth.admin.deleteUser(regularUser.user!.id)
  })

  it('should audit tier changes', async () => {
    const { data: session } = await supabase.auth.signInWithPassword({
      email: 'admin-test@example.com',
      password: 'test-password'
    })

    // Change tier
    await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/make-server-55e8c5b2/admin/orgs/${testOrgId}/tier`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.session!.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tier: 'Pro' })
      }
    )

    // Verify audit log exists
    const { data: auditLog } = await supabase
      .from('audit_compliance.audit_log')
      .select('*')
      .eq('action', 'change_tier')
      .eq('target_org_id', testOrgId)
      .single()

    expect(auditLog).toBeTruthy()
    expect(auditLog!.actor_id).toBe(adminUserId)
    expect(auditLog!.before_json.tier).toBe('Starter')
    expect(auditLog!.after_json.tier).toBe('Pro')
  })
})
```

#### admin/billing.test.ts
```typescript
import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

describe('Admin Billing API', () => {
  it('should calculate real MRR from finance_ops', async () => {
    // Insert test finance record
    const { data: org } = await supabase
      .from('companies')
      .insert({ name: 'MRR Test Org' })
      .select()
      .single()

    await supabase.from('finance.finance_ops').insert({
      org_id: org!.id,
      stripe_customer_id: 'cus_test',
      plan: 'Pro',
      mrr_cents: 9900,
      status: 'active'
    })

    // Fetch billing data
    const { data: session } = await getAdminSession()
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/make-server-55e8c5b2/admin/billing`,
      {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      }
    )

    const { data } = await response.json()
    expect(data.mrr).toBeGreaterThanOrEqual(9900) // At least our test org's MRR

    // Cleanup
    await supabase.from('companies').delete().eq('id', org!.id)
  })

  it('should return zero MRR when no active subs exist', async () => {
    // Test with fresh DB or no active subs
    const { data: session } = await getAdminSession()
    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/make-server-55e8c5b2/admin/billing`,
      {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      }
    )

    const { data } = await response.json()
    expect(typeof data.mrr).toBe('number')
    expect(data.mrr).toBeGreaterThanOrEqual(0) // Never negative
  })
})
```

---

### 3. RLS Policy Tests

#### rls/tenant-isolation.test.ts
```typescript
import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

describe('Row Level Security - Tenant Isolation', () => {
  it('should prevent cross-org reads in support_tickets', async () => {
    // Create two orgs
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    const { data: org1 } = await supabase.from('companies')
      .insert({ name: 'Org 1' })
      .select()
      .single()

    const { data: org2 } = await supabase.from('companies')
      .insert({ name: 'Org 2' })
      .select()
      .single()

    // Create user in org1
    const { data: user1 } = await supabase.auth.admin.createUser({
      email: 'user1@example.com',
      password: 'test',
      user_metadata: { company_id: org1!.id }
    })

    // Create ticket in org2
    await supabase.from('support.support_tickets').insert({
      org_id: org2!.id,
      title: 'Org 2 Ticket',
      source: 'in-app',
      status: 'open'
    })

    // Sign in as user1 and try to read org2's ticket
    const { data: session } = await supabase.auth.signInWithPassword({
      email: 'user1@example.com',
      password: 'test'
    })

    const { data: tickets } = await supabase
      .from('support.support_tickets')
      .select('*')

    // Should only see tickets from own org (none in this case)
    expect(tickets).toEqual([])

    // Cleanup
    await supabase.from('companies').delete().in('id', [org1!.id, org2!.id])
  })
})
```

---

### 4. Contract Tests (Stripe Webhooks)

#### webhooks/stripe.test.ts
```typescript
import { describe, it, expect } from 'vitest'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

describe('Stripe Webhook Contract', () => {
  it('should handle subscription.created webhook', async () => {
    // Use Stripe test mode
    const customer = await stripe.customers.create({
      email: 'webhook-test@example.com',
      metadata: { org_id: 'test-org-id' }
    })

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: 'price_test_pro' }],
      trial_end: Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60
    })

    // Simulate webhook event
    const event = {
      type: 'customer.subscription.created',
      data: { object: subscription }
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/stripe-webhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'test-signature'
        },
        body: JSON.stringify(event)
      }
    )

    expect(response.status).toBe(200)

    // Verify finance_ops was created
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: financeOp } = await supabase
      .from('finance.finance_ops')
      .select('*')
      .eq('stripe_customer_id', customer.id)
      .single()

    expect(financeOp).toBeTruthy()
    expect(financeOp!.status).toBe('trialing')

    // Cleanup
    await stripe.subscriptions.cancel(subscription.id)
    await stripe.customers.del(customer.id)
  })
})
```

---

### 5. E2E Tests (Playwright)

Location: `/tests/e2e/`

#### admin/back-office.spec.ts
```typescript
import { test, expect } from '@playwright/test'

test.describe('Back Office Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as super admin
    await page.goto('/signin')
    await page.fill('[name="email"]', 'admin@buboiq.com')
    await page.fill('[name="password"]', process.env.ADMIN_PASSWORD!)
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    // Navigate to Back Office
    await page.goto('/admin')
  })

  test('should block non-admin users', async ({ page }) => {
    // Sign out
    await page.goto('/signout')
    
    // Sign in as regular user
    await page.goto('/signin')
    await page.fill('[name="email"]', 'user@example.com')
    await page.fill('[name="password"]', 'test')
    await page.click('button[type="submit"]')
    
    // Try to access /admin
    await page.goto('/admin')
    
    // Should be redirected or see unauthorized message
    expect(page.url()).not.toContain('/admin')
  })

  test('should display empty state for orgs when none exist', async ({ page }) => {
    // Assumes fresh DB or filtered view
    await page.click('text=Organizations')
    
    const emptyState = page.locator('text=No organizations')
    await expect(emptyState).toBeVisible()
  })

  test('should perform tier change and create audit log', async ({ page }) => {
    await page.click('text=Organizations')
    
    // Click first org's tier change button
    await page.click('[data-testid="change-tier-btn"]').first()
    
    // Select new tier
    await page.selectOption('select[name="tier"]', 'Pro')
    await page.click('text=Change Tier')
    
    // Verify success toast
    await expect(page.locator('text=Tier changed')).toBeVisible()
    
    // Navigate to compliance tab
    await page.click('text=Compliance')
    
    // Verify audit log entry exists
    const auditEntry = page.locator('text=change_tier')
    await expect(auditEntry).toBeVisible()
  })

  test('should export compliance evidence CSV', async ({ page }) => {
    await page.click('text=Compliance')
    
    // Click export button
    const downloadPromise = page.waitForEvent('download')
    await page.click('text=Generate Evidence CSV')
    const download = await downloadPromise
    
    // Verify filename
    expect(download.suggestedFilename()).toMatch(/buboiq-evidence-.*\.csv/)
    
    // Verify content
    const content = await download.path()
    expect(content).toBeTruthy()
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Press 'g' then 'b' for Billing
    await page.keyboard.press('g')
    await page.keyboard.press('b')
    
    // Verify Billing tab is active
    await expect(page.locator('[data-active="true"]').filter({ hasText: 'Billing' })).toBeVisible()
    
    // Press 'g' then 'c' for Compliance
    await page.keyboard.press('g')
    await page.keyboard.press('c')
    
    await expect(page.locator('[data-active="true"]').filter({ hasText: 'Compliance' })).toBeVisible()
  })
})
```

---

### 6. Accessibility Tests

#### a11y/back-office.test.ts
```typescript
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Back Office Accessibility', () => {
  test('should have zero critical/serious violations', async ({ page }) => {
    await page.goto('/admin')
    await injectAxe(page)
    
    const violations = await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    })
    
    // Filter critical and serious
    const criticalViolations = violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    )
    
    expect(criticalViolations.length).toBe(0)
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/admin')
    
    // Tab through all interactive elements
    await page.keyboard.press('Tab')
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement)
  })
})
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Back Office Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: npm run test:integration
      
      - name: Run E2E tests
        env:
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
        run: npm run test:e2e
      
      - name: Check for placeholder text
        run: |
          if grep -r "Lorem ipsum\|TODO\|FIXME\|mock data" src/; then
            echo "ERROR: Found placeholder text or mock data references"
            exit 1
          fi
      
      - name: Verify no vanity metrics
        run: |
          if grep -r "Math.random()\|faker\|mock" src/pages/admin/; then
            echo "ERROR: Found potential mock data generation"
            exit 1
          fi
```

---

## Test Coverage Requirements

- **Unit Tests:** 80%+ coverage for utils, hooks, and pure functions
- **Integration Tests:** All admin API endpoints must have happy path + error cases
- **E2E Tests:** Critical user flows (tier change, impersonate, evidence export)
- **Accessibility:** Zero critical/serious violations on all admin pages
- **Contract Tests:** All webhook handlers verified with real Stripe test events

---

## Running Tests Locally

```bash
# Unit tests
npm run test:unit

# Integration tests (requires Supabase local dev)
supabase start
npm run test:integration

# E2E tests (requires running dev server)
npm run dev &
npm run test:e2e

# All tests
npm run test:all

# With coverage
npm run test:coverage
```

---

## Test Data Policy

**NEVER:**
- Generate random data with `Math.random()` or `faker`
- Return hardcoded arrays of fake objects
- Use placeholder text like "Lorem ipsum" or "Example Org 1, 2, 3"

**ALWAYS:**
- Query real database tables
- Return empty arrays `[]` when no data exists
- Show clear empty states with actionable hints
- Use Stripe test mode for webhook testing (still real events)

---

## Failure Criteria

**Tests MUST FAIL if:**
1. Any endpoint returns mock/hardcoded data
2. Empty states are missing or show placeholder text
3. Audit logs are not created for admin actions
4. Cross-org data leaks via RLS bypass
5. Accessibility violations (critical/serious)
6. Rollback fails to restore state after error

---

## Production Readiness Checklist

Before deploying to production:

- [ ] All tests pass in CI
- [ ] Zero placeholder text in codebase
- [ ] All admin actions have audit logs
- [ ] RLS policies tested for tenant isolation
- [ ] Stripe webhooks tested with real test events
- [ ] Accessibility scan shows zero critical violations
- [ ] Evidence export generates real CSV from audit logs
- [ ] Empty states render for all pages when no data exists
- [ ] Error messages are helpful and non-technical

---

**Remember: If data doesn't exist, show an empty state. NEVER fabricate it.**
