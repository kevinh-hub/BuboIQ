/**
 * Super Admin Login Test Script
 * 
 * This script tests the complete Super Admin login flow including:
 * - Authentication via edge function or fallback
 * - User state management
 * - Session persistence
 * - Back Office access
 * 
 * Run this in the browser console on buboiq.com to verify login works.
 */

const testSuperAdminLogin = async () => {
  console.log('🧪 Starting Super Admin Login Test...\n');
  
  // Test 1: Check environment
  console.log('📋 Test 1: Environment Check');
  const hasLocalStorage = typeof localStorage !== 'undefined';
  console.log(`  ✓ localStorage available: ${hasLocalStorage}`);
  
  // Test 2: Clear previous session
  console.log('\n📋 Test 2: Clearing Previous Session');
  localStorage.removeItem('bubo_access_token');
  localStorage.removeItem('bubo_user');
  console.log('  ✓ Cleared access token');
  console.log('  ✓ Cleared user data');
  
  // Test 3: Credentials check
  console.log('\n📋 Test 3: Credentials');
  const SUPER_ADMIN_EMAIL = 'admin@buboiq.dev';
  const SUPER_ADMIN_PASSWORD = 'BuboIQ2024!Admin';
  console.log(`  ✓ Email: ${SUPER_ADMIN_EMAIL}`);
  console.log(`  ✓ Password: ${'*'.repeat(SUPER_ADMIN_PASSWORD.length)}`);
  
  // Test 4: Simulate login (you'll need to actually click the button)
  console.log('\n📋 Test 4: Login Simulation');
  console.log('  ⏳ Please click "Login as Super Admin" button now...');
  console.log('  📍 Expected console output:');
  console.log('     → App.tsx: handleLoginSuccess called for: admin@buboiq.dev');
  console.log('     → === AuthContext.signIn: START ===');
  console.log('     → AuthContext.signIn: Response received: { success: true, ... }');
  console.log('     → AuthContext: User state set successfully');
  console.log('     → === App.tsx: User state changed ===');
  console.log('     → App.tsx: User is authenticated, rendering AppRouter');
  console.log('     → AppRouter: Initial route set to: back-office');
  console.log('     → === BackOfficePage: Component mounted ===');
  
  // Test 5: Wait for user to log in, then verify
  console.log('\n📋 Test 5: Post-Login Verification (run after clicking login)');
  console.log('  Run this command after logging in: testSuperAdminLogin.verify()');
};

// Verification function to run AFTER clicking login
testSuperAdminLogin.verify = () => {
  console.log('\n🔍 Verifying Super Admin Login...\n');
  
  // Check 1: Access Token
  console.log('📋 Check 1: Access Token');
  const token = localStorage.getItem('bubo_access_token');
  if (token) {
    console.log('  ✅ Access token exists');
    console.log(`  📝 Token length: ${token.length} chars`);
  } else {
    console.log('  ❌ No access token found!');
    console.log('  💡 Login may have failed');
  }
  
  // Check 2: User Data
  console.log('\n📋 Check 2: User Data');
  const userStr = localStorage.getItem('bubo_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('  ✅ User data exists');
      console.log(`  📝 Email: ${user.email}`);
      console.log(`  📝 Name: ${user.name}`);
      console.log(`  📝 Role: ${user.role}`);
      console.log(`  📝 Tier: ${user.tier}`);
      console.log(`  📝 Org ID: ${user.org_id}`);
      
      if (user.role === 'super_admin') {
        console.log('  ✅ Role is super_admin - CORRECT!');
      } else {
        console.log(`  ❌ Role is ${user.role} - SHOULD BE super_admin!`);
      }
    } catch (e) {
      console.log('  ❌ User data is invalid JSON');
    }
  } else {
    console.log('  ❌ No user data found!');
  }
  
  // Check 3: Current URL
  console.log('\n📋 Check 3: Current State');
  console.log(`  📍 Current URL: ${window.location.href}`);
  console.log(`  📍 Current Path: ${window.location.pathname}`);
  
  // Check 4: Expected Elements
  console.log('\n📋 Check 4: UI Elements');
  const hasBackOffice = document.body.innerText.includes('Back Office');
  const hasSuperAdminConsole = document.body.innerText.includes('Super Admin Console');
  const hasOrgsTab = document.body.innerText.includes('Orgs') || document.body.innerText.includes('Organizations');
  
  if (hasBackOffice) {
    console.log('  ✅ "Back Office" found in page');
  } else {
    console.log('  ⚠️  "Back Office" not found - may still be on login page');
  }
  
  if (hasSuperAdminConsole) {
    console.log('  ✅ "Super Admin Console" found in page');
  }
  
  if (hasOrgsTab) {
    console.log('  ✅ Organizations/Orgs tab found in page');
  }
  
  // Final Summary
  console.log('\n' + '='.repeat(50));
  if (token && userStr && hasBackOffice) {
    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('   You are logged in as Super Admin');
    console.log('   Back Office is accessible');
  } else if (token && userStr && !hasBackOffice) {
    console.log('⚠️  LOGIN PARTIALLY SUCCESSFUL');
    console.log('   User is authenticated but UI may not have updated');
    console.log('   Try refreshing the page');
  } else {
    console.log('❌ LOGIN FAILED');
    console.log('   Check console logs for errors');
    console.log('   Verify credentials are correct');
    console.log('   Check network tab for API errors');
  }
  console.log('='.repeat(50) + '\n');
};

// Auto-run initial test
testSuperAdminLogin();

// Export for browser console
if (typeof window !== 'undefined') {
  (window as any).testSuperAdminLogin = testSuperAdminLogin;
}

export { testSuperAdminLogin };
