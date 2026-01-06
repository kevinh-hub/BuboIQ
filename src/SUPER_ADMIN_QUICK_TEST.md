# Super Admin Quick Test Guide

## 🚀 Quick Test (2 Minutes)

### Step 1: Login
```
URL: https://your-buboiq-url.com/
Click: "Login" or "Sign In"
Email: admin@buboiq.dev
Password: BuboIQ2024!Admin
Click: "Sign In" button
```

### Step 2: Verify Landing
```
✅ Should immediately see "Back Office" page
✅ Should see "Super Admin Console" header
✅ Should see tabs: Organizations, Billing, Analytics, Support, System, Compliance
✅ Should NOT see standard dashboard
✅ Should NOT see any loading or redirect flash
```

### Step 3: Check Sidebar
```
✅ Should see 4 navigation items ONLY:
   - Back Office (with OPS badge)
   - Super Admin Console (with SUPER badge)
   - Demo Leads (with LEADS badge)
   - Support System (with DEMO badge)
   
✅ Should NOT see:
   - Dashboard
   - Computers
   - Issues
   - Settings
   - Knowledge
```

### Step 4: Navigate Tabs
```
Click each tab and verify it loads:
✅ Organizations
✅ Billing
✅ Analytics
✅ Support
✅ System
✅ Compliance
```

### Step 5: Test Navigation
```
Click "Super Admin Console" in sidebar
✅ Should load without errors
✅ Should show master console

Click "Back Office" in sidebar
✅ Should return to Back Office
✅ Should remember last active tab
```

### Step 6: Test Logout/Re-login
```
Click "Sign Out"
✅ Should return to login page
✅ Should clear session

Login again with same credentials
✅ Should land on Back Office again
✅ Should work consistently
```

## 🐛 Troubleshooting

### Issue: Still seeing Dashboard after login
**Fix**: Clear browser cache and localStorage
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

### Issue: Navigation shows standard items
**Check**: Console logs for user role
```javascript
// Open browser console and check:
JSON.parse(localStorage.getItem('bubo_user'))?.role
// Should return: "super_admin"
```

### Issue: "Access Denied" on Back Office
**Check**: JWT claims
```javascript
// Check if role is properly set in token
// Backend should return role: "super_admin" in auth response
```

### Issue: Stuck in loading state
**Check**: Network tab for failed API calls
- Verify Supabase URL is correct
- Verify API endpoint is responding
- Check browser console for errors

## 📊 Console Logging

When testing, you should see these console logs:

```
AuthContext: Calling authApi.signIn for: admin@buboiq.dev
authApi.signIn: Starting sign in for: admin@buboiq.dev
authApi.signIn: API response received: { success: true, ... }
authApi.signIn: Access token stored in localStorage
authApi.signIn: Supabase session set successfully
AuthContext: authApi.signIn response: { success: true, hasUser: true, role: "super_admin" }
AuthContext: JWT claims: { org_id: null, role: "super_admin", tier: "pro" }
AuthContext: Setting user state with role: super_admin
AuthContext: User state set successfully
```

## ✅ Success Indicators

| Indicator | Expected Result |
|-----------|----------------|
| Toast Message | "Welcome back, Super Admin • Logged in as Super Admin" |
| Landing Page | Back Office (not Dashboard) |
| URL (if routing enabled) | `/back-office` or base URL |
| Sidebar Items | 4 Super Admin items only |
| Header | "Back Office - Super Admin Console" |
| Active Tab | "Organizations" (default) |
| System Status | Green dot "System Operational" |

## 🔐 Security Verification

```bash
# 1. Verify localStorage contains encrypted token
localStorage.getItem('bubo_access_token')
# Should start with: "eyJ..."

# 2. Verify user data is correct
JSON.parse(localStorage.getItem('bubo_user'))
# Should show: { role: "super_admin", org_id: null, ... }

# 3. Verify SuperAdminGuard is working
# Try navigating to /back-office without login
# Should redirect to login or show "Access Denied"

# 4. Verify standard users can't access
# Login as regular user (if available)
# Should not see Back Office in navigation
```

## 📱 Mobile Testing

```
1. Open on mobile device or resize browser to mobile width
2. Click hamburger menu (☰)
3. Verify sidebar opens with Super Admin navigation
4. Verify all tabs work on mobile
5. Verify logout works on mobile
```

## 🎯 Performance Check

```
✅ Login should complete in < 2 seconds
✅ Back Office should load in < 1 second
✅ Tab switching should be instant
✅ No flash of wrong content (FOUC)
✅ No unnecessary re-renders
```

## 🔄 Refresh Test

```
1. Login as Super Admin
2. Land on Back Office
3. Press F5 (refresh page)
4. Should:
   ✅ Stay logged in
   ✅ Stay on Back Office
   ✅ Maintain session
   ✅ Not redirect to login
```

## 🌐 Cross-Browser Test

Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)

All should behave identically.

## 🚨 Red Flags

Stop and investigate if you see:
- ❌ Flash of Dashboard before Back Office
- ❌ Multiple redirects or reload loops
- ❌ "Access Denied" for Super Admin
- ❌ Standard navigation mixed with Super Admin nav
- ❌ Console errors or warnings
- ❌ Failed API calls in Network tab
- ❌ Session lost on refresh

## 📞 Quick Fixes

### If login fails:
```bash
# Check Super Admin exists in database
# Run this query in Supabase SQL editor:
SELECT email, user_metadata 
FROM auth.users 
WHERE email = 'admin@buboiq.dev';
```

### If routing fails:
```javascript
// Force route to back-office
window.location.hash = '#back-office';
// OR if using actual routing:
window.location.pathname = '/back-office';
```

### If stuck in loop:
```javascript
// Clear everything and start fresh
localStorage.clear();
sessionStorage.clear();
location.href = '/';
```

## 📈 Metrics

Track these for quality assurance:
- Login success rate: 100%
- Average login time: < 2s
- Back Office load time: < 1s
- Zero reload loops: 100%
- Zero console errors: 100%

---

**Quick Pass Criteria**: Login → Back Office → 4 Nav Items → All Tabs Work → Logout/Login Works

**Status**: If all ✅ above, you're good to go! 🎉
