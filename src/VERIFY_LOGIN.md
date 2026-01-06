# Super Admin Login - Quick Verification Guide

## Test on Production (buboiq.com)

### Step 1: Open Browser Console
1. Go to https://buboiq.com/login
2. Press F12 (or Cmd+Option+I on Mac)
3. Click on "Console" tab

### Step 2: Click Login Button
1. Click the **"Login as Super Admin"** button
2. Watch the console output

### Expected Console Logs (Success):

```
App.tsx: handleLoginSuccess called for: admin@buboiq.dev
=== AuthContext.signIn: START ===
AuthContext.signIn: Email: admin@buboiq.dev
AuthContext.signIn: Calling authApi.signIn...
authApi.signIn: Starting sign in for: admin@buboiq.dev

[Authentication happens...]

AuthContext.signIn: Response received: { success: true, hasUser: true, role: 'super_admin', hasAccessToken: true }
AuthContext: Setting user state with role: super_admin
AuthContext: User state set successfully

=== App.tsx: User state changed ===
User: { email: 'admin@buboiq.dev', role: 'super_admin', ... }
User role: super_admin

App.tsx: User is authenticated, rendering AppRouter for role: super_admin

AppRouter: Initializing with user role: super_admin
AppRouter: Initial route set to: back-office

=== BackOfficePage: Component mounted ===
```

### Expected UI Result:
- ✅ Login page disappears
- ✅ Back Office appears with sidebar
- ✅ Sidebar shows: Back Office, Super Admin Console, Demo Leads, Support System
- ✅ Main content shows tabs: Orgs, Billing, Analytics, Support, System, Compliance
- ✅ Toast message: "Welcome back, [Name]!"

---

## Step 3: Test Session Persistence

1. Press F5 or Cmd+R to refresh the page
2. You should:
   - ✅ Stay logged in (no redirect to login page)
   - ✅ Still see Back Office
   - ✅ No authentication errors in console

---

## Step 4: Test Navigation

1. Click "Super Admin Console" in sidebar
   - ✅ Should navigate to dashboard view
   - ✅ No errors

2. Click "Back Office" in sidebar  
   - ✅ Should return to Back Office
   - ✅ All tabs still work

3. Click between tabs (Orgs, Billing, Analytics, etc.)
   - ✅ All tabs should load without errors

---

## If Login Fails

### Debug Steps:

1. **Check Console for Errors**
   - Look for red error messages
   - Note which step failed

2. **Check Network Tab**
   - Open Network tab in DevTools
   - Filter by "fetch/xhr"
   - Look for failed requests to `/auth/signin`
   - Check response status and body

3. **Check LocalStorage**
   Run in console:
   ```javascript
   console.log('Token:', localStorage.getItem('bubo_access_token'));
   console.log('User:', localStorage.getItem('bubo_user'));
   ```
   - If token exists but UI doesn't update → state management issue
   - If no token → authentication failed

4. **Force Clear and Retry**
   Run in console:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
   Then try logging in again.

---

## Common Issues & Fixes

### Issue 1: "Login button does nothing"
**Symptom**: Click button, nothing happens, no console logs

**Check**:
- Is JavaScript enabled?
- Any errors in console before clicking?
- Try clicking the manual login form instead

**Fix**: Refresh page and try again

---

### Issue 2: "Stuck on login page"
**Symptom**: Click button, see toast "Welcome back", but stay on login page

**Check Console for**:
```
AuthContext: User state set successfully
```

**If you see this**: User state is set but App isn't re-rendering

**Fix**: This shouldn't happen with the new code, but if it does:
```javascript
// Force reload
window.location.href = '/';
```

---

### Issue 3: "401 Unauthorized error"
**Symptom**: Console shows "Failed with 401" or "Invalid credentials"

**Possible Causes**:
1. Super admin user doesn't exist in database
2. Password is wrong
3. Edge function isn't deployed

**Check**:
```javascript
// Test direct Supabase auth (fallback should work)
// This will be attempted automatically
```

**Fix**: Verify super admin credentials in Supabase dashboard

---

### Issue 4: "Network error / CORS error"
**Symptom**: Console shows network error or CORS policy error

**Possible Causes**:
1. Edge function not deployed
2. CORS headers misconfigured
3. Network issue

**Fix**: Fallback auth should still work. If not, check:
- Supabase project is running
- Edge function is deployed
- Environment variables are set

---

## Manual Verification Checklist

Use this checklist after clicking "Login as Super Admin":

- [ ] Button shows loading state ("Logging in...")
- [ ] Console logs start appearing
- [ ] No red error messages in console
- [ ] Toast notification appears: "Welcome back, [Name]!"
- [ ] Login page disappears
- [ ] Back Office loads with sidebar
- [ ] Can see 4 sidebar items (Back Office, Super Admin Console, Demo Leads, Support System)
- [ ] Can see 6 tabs (Orgs, Billing, Analytics, Support, System, Compliance)
- [ ] Orgs tab shows organization list
- [ ] Refresh (F5) keeps you logged in
- [ ] No errors after refresh
- [ ] Can navigate between sidebar items
- [ ] Can navigate between tabs
- [ ] "Sign Out" button works

**If all checkboxes pass**: ✅ **LOGIN IS WORKING CORRECTLY**

**If any fail**: See "If Login Fails" section above

---

## Browser Console Test Commands

### Test 1: Check Authentication State
```javascript
console.log('Access Token:', localStorage.getItem('bubo_access_token') ? 'EXISTS' : 'MISSING');
console.log('User Data:', localStorage.getItem('bubo_user') ? JSON.parse(localStorage.getItem('bubo_user')) : 'MISSING');
```

### Test 2: Verify Super Admin Role
```javascript
const user = JSON.parse(localStorage.getItem('bubo_user') || '{}');
console.log('Role:', user.role);
console.log('Is Super Admin:', user.role === 'super_admin' ? '✅ YES' : '❌ NO');
```

### Test 3: Force Logout
```javascript
localStorage.clear();
window.location.href = '/login';
```

### Test 4: Check Environment
```javascript
console.log('Window location:', window.location.href);
console.log('User in page:', document.body.innerText.includes('Back Office') ? 'LOGGED IN' : 'NOT LOGGED IN');
```

---

## Success Criteria

The Super Admin login is considered **WORKING** if:

1. ✅ Clicking "Login as Super Admin" button triggers authentication
2. ✅ Console logs show complete auth flow without errors  
3. ✅ User is redirected from login page to Back Office
4. ✅ Back Office loads with correct navigation and tabs
5. ✅ Session persists across page refresh
6. ✅ Can navigate between all sections without errors
7. ✅ Sign out clears session and returns to home page

---

**Need Help?**

If login still doesn't work after following this guide:

1. Copy full console output
2. Check Network tab for failed requests
3. Note exactly which step fails (button click, auth call, UI update, etc.)
4. This will help diagnose the specific issue
