# BuboIQ Super Admin Login - Functional Tests

**Automated tests for login functionality with REAL auth backend**

---

## Prerequisites

Before running tests, ensure:

1. **Super Admin User Exists** in database:
   ```sql
   -- Run in Supabase SQL Editor
   INSERT INTO users (email, role, name) VALUES
   ('admin@buboiq.dev', 'super_admin', 'Super Admin')
   ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
   ```

2. **Development Server Running**:
   ```bash
   npm run dev
   # Server should be at http://localhost:5173
   ```

3. **Environment Variables** (if needed):
   ```bash
   export SUPABASE_PROJECT_ID=your-project-id
   export BASE_URL=http://localhost:5173
   ```

4. **Playwright Installed**:
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

---

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test Suite
```bash
# Test A: Happy Path
npx playwright test super-admin-login.spec.ts -g "Happy Path"

# Test B: Non-Super-Admin
npx playwright test super-admin-login.spec.ts -g "Non-Super-Admin"

# Test C: Invalid Credentials
npx playwright test super-admin-login.spec.ts -g "Invalid Credentials"

# Test D: Button Interactivity
npx playwright test super-admin-login.spec.ts -g "Button Interactivity"

# Test E: Session Persistence
npx playwright test super-admin-login.spec.ts -g "Session Persistence"
```

### Run with UI Mode (Visual Debugging)
```bash
npx playwright test --ui
```

### Run in Headless Mode
```bash
npx playwright test --headless
```

### Generate HTML Report
```bash
npx playwright test
npx playwright show-report
```

---

## Test Coverage

### ✅ Test A: Happy Path (Super Admin)
**What it tests:**
- Navigate to login page
- Click "Login as Super Admin" button
- Verify button triggers auth handler
- Verify Supabase session created
- Verify user claims include `role = super_admin`
- Verify redirect to dashboard
- Verify protected API call succeeds

**Expected Result:** All assertions pass, user is logged in and sees dashboard

---

### ✅ Test B: Non-Super-Admin Access
**What it tests:**
- Login with non-super-admin user
- Verify route guard blocks admin UI
- Verify permission message shown
- Verify no admin data loaded
- Verify no API leakage

**Expected Result:** Regular user cannot access super admin features

---

### ✅ Test C: Invalid Credentials
**What it tests:**
- Submit invalid password
- Verify inline error message appears
- Verify no navigation occurs
- Verify no session created

**Expected Result:** Error shown, user remains on login page

---

### ✅ Test D: Button Interactivity
**What it tests:**
- Button enabled when form valid
- Button disabled during async auth
- Button re-enabled on error
- Loading state displayed

**Expected Result:** Button behaves correctly during auth lifecycle

---

### ✅ Test E: Session Persistence
**What it tests:**
- Login successfully
- Reload page
- Verify session persists
- Verify user remains in dashboard
- Verify no redirect to login

**Expected Result:** Session survives page refresh

---

## Test Output

### Passing Tests
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

✓ Test C: Invalid Credentials
  ✓ Error message displayed
  ✓ No session created
  ✓ Still on login page
  ✅ Test C PASSED

✓ Test E: Session Persistence
  ✓ Initial login successful
  ✓ Page reloaded
  ✓ Session persisted after reload
  ✓ Not redirected to login
  ✅ Test E PASSED
```

### Failing Tests (Example)
```
✗ Test A: Happy Path - Super Admin Login
  ✓ Navigated to login page
  ✓ Super Admin Quick Login button found
  ✗ Button clicked, waiting for auth response...
    Error: Timeout waiting for response from /auth/signin

Likely causes:
1. Edge function not deployed
2. Super admin user doesn't exist
3. Network issue
```

---

## Troubleshooting

### Issue: "Super Admin Quick Login button not found"
**Cause:** LoginPage component not rendering SuperAdminQuickLogin

**Fix:**
```typescript
// Verify LoginPage.tsx includes:
<SuperAdminQuickLogin 
  onLoginAttempt={onLoginSuccess}
  isLoading={loading}
/>
```

---

### Issue: "Auth API call failed with 401"
**Cause:** Super admin user doesn't exist in database

**Fix:**
```sql
-- Create super admin user
INSERT INTO users (email, password_hash, role, name)
VALUES (
  'admin@buboiq.dev',
  crypt('BuboIQ2024!Admin', gen_salt('bf')),
  'super_admin',
  'Super Admin'
);
```

---

### Issue: "Session not persisted after reload"
**Cause:** localStorage not being set properly

**Fix:**
```typescript
// Verify AuthContext.tsx stores user on login:
localStorage.setItem('bubo_access_token', response.access_token);
localStorage.setItem('bubo_user', JSON.stringify(userData));
```

---

### Issue: "Protected API call returns 401"
**Cause:** Access token not included in request

**Fix:**
```typescript
// Verify apiCall helper includes token:
headers['Authorization'] = `Bearer ${session.access_token}`;
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

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
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        env:
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
          BASE_URL: http://localhost:5173
        run: |
          npm run dev &
          npx playwright test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Success Criteria

**Tests PASS when:**
- ✅ Super admin can login via Quick Login button
- ✅ Super admin can login via manual form entry
- ✅ Session is created and stored in localStorage
- ✅ User object has `role: 'super_admin'`
- ✅ Dashboard is rendered after login
- ✅ Protected API calls succeed with valid token
- ✅ Session persists across page reloads
- ✅ Invalid credentials show error, no session created
- ✅ Button states (enabled/disabled/loading) correct

**Tests FAIL when:**
- ❌ Button click does not trigger auth handler
- ❌ Auth API returns error
- ❌ Session not stored in localStorage
- ❌ User role is not 'super_admin'
- ❌ No redirect to dashboard
- ❌ Protected API calls fail with 401
- ❌ Session lost after page reload
- ❌ Errors not displayed

---

## Manual Verification (Optional)

If you prefer to manually verify:

1. Open http://localhost:5173
2. Click "Sign In"
3. Find "Super Admin Quick Login" card
4. Click "Login as Super Admin" button
5. Open DevTools → Console
   - Should see: "Welcome back, Super Admin!"
6. Open DevTools → Application → Local Storage
   - Should see: `bubo_access_token` and `bubo_user`
7. Check `bubo_user` value:
   - Should have: `{ role: 'super_admin', email: 'admin@buboiq.dev', ... }`
8. Page should show dashboard/app interface (not login page)
9. Reload page (Cmd/Ctrl + R)
10. Should still be logged in (dashboard visible)

---

## Changelog

### What Was Fixed
1. **Button Functionality**: Already working - calls `onLoginSuccess` → `signIn` → `authApi.signIn`
2. **Auth Flow**: Verified complete flow from button → API → localStorage → AppRouter
3. **Session Persistence**: Verified useEffect in AuthContext loads saved session
4. **Error Handling**: Verified toast errors displayed on invalid credentials
5. **Protected Routes**: Verified AppRouter only renders when `user` exists

### What Was Added
1. **Automated Tests**: Comprehensive E2E tests covering all scenarios
2. **Test Configuration**: Playwright config for headless/UI mode testing
3. **Test Documentation**: Complete guide for running and troubleshooting tests
4. **CI/CD Example**: GitHub Actions workflow for automated testing

---

**All tests use REAL Supabase auth. No mocks. No fake sessions.**
