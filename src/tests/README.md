# BuboIQ Super Admin Login Tests

## Quick Start

```bash
# 1. Install Playwright
npm install -D @playwright/test
npx playwright install

# 2. Start dev server (in separate terminal)
npm run dev

# 3. Run tests
npm run test:login
```

## Test Commands

```bash
# Run all login tests
npm run test:login

# Run with visual UI
npm run test:login:ui

# Run with debugger
npm run test:e2e:debug

# View HTML report
npm run test:report
```

## Manual Script Runner

```bash
# Make script executable
chmod +x tests/run-login-tests.sh

# Run all tests
./tests/run-login-tests.sh all

# Run specific test
./tests/run-login-tests.sh happy      # Test A: Happy Path
./tests/run-login-tests.sh invalid    # Test C: Invalid Credentials
./tests/run-login-tests.sh persist    # Test E: Session Persistence

# Run in UI mode
./tests/run-login-tests.sh ui

# Run with debugger
./tests/run-login-tests.sh debug
```

## Prerequisites

### 1. Super Admin User Must Exist

Run in Supabase SQL Editor:
```sql
INSERT INTO users (email, role, name) VALUES
('admin@buboiq.dev', 'super_admin', 'Super Admin')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
```

### 2. Development Server Running

```bash
npm run dev
# Server should be at http://localhost:5173
```

## Test Coverage

| Test | Description | Status |
|------|-------------|--------|
| A | Happy Path - Super Admin Login | ✅ |
| A2 | Manual Form Entry | ✅ |
| B | Non-Super-Admin Blocked | ✅ |
| C | Invalid Credentials Error | ✅ |
| D | Button Interactivity | ✅ |
| D2 | Form Validation | ✅ |
| E | Session Persistence | ✅ |
| F | Network Error Handling | ✅ |

## Expected Output (Passing Tests)

```
✓ Test A: Happy Path - Super Admin Login
  ✓ Navigated to login page
  ✓ Super Admin Quick Login button found
  ✓ Button clicked, waiting for auth response...
  ✓ Auth API call completed: { success: true }
  ✓ Session stored in localStorage
  ✓ User claims verified: { email: 'admin@buboiq.dev', role: 'super_admin' }
  ✓ Redirected to: http://localhost:5173/
  ✓ No longer on login page
  ✓ Protected API call succeeded
  ✅ Test A (Happy Path) PASSED

Running 8 tests using 1 worker

  8 passed (12.3s)

To open last HTML report run:
  npx playwright show-report
```

## Troubleshooting

### Error: "Super Admin Quick Login button not found"

**Solution:** Verify LoginPage component includes SuperAdminQuickLogin
```typescript
// In /components/marketing/LoginPage.tsx
<SuperAdminQuickLogin 
  onLoginAttempt={onLoginSuccess}
  isLoading={loading}
/>
```

### Error: "Auth API call failed with 401"

**Solution:** Super admin user doesn't exist. Run SQL above.

### Error: "Timeout waiting for response"

**Solutions:**
1. Check dev server is running: `curl http://localhost:5173`
2. Check edge functions deployed: `supabase functions deploy make-server`
3. Check Supabase project is accessible

### Error: "Session not persisted after reload"

**Solution:** Check localStorage is being set:
```typescript
// Should be in AuthContext.tsx
localStorage.setItem('bubo_access_token', response.access_token);
localStorage.setItem('bubo_user', JSON.stringify(userData));
```

## Documentation

- **Full Test Spec:** `/tests/e2e/super-admin-login.spec.ts`
- **Test Guide:** `/tests/RUN_TESTS.md`
- **Changelog:** `/SUPER_ADMIN_LOGIN_CHANGELOG.md`
- **Playwright Config:** `/playwright.config.ts`

## CI/CD Example

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run dev &
      - run: npm run test:login
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Success Criteria

✅ **Tests PASS when:**
- Super admin can login via Quick Login button
- Session created and stored in localStorage
- User has `role: 'super_admin'`
- Dashboard renders after login
- Protected API calls succeed
- Session persists across reloads
- Invalid credentials show error
- Button states correct (enabled/disabled/loading)

❌ **Tests FAIL when:**
- Button click doesn't trigger handler
- Auth API returns error
- Session not stored
- User role not 'super_admin'
- No redirect to dashboard
- Protected API fails with 401
- Session lost after reload
- Errors not displayed

## Note

**All tests use REAL Supabase auth backend. No mocks. No fake sessions.**
