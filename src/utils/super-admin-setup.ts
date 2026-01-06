// Super Admin Quick Setup Script for BuboIQ
// This script can be run in the browser console for initial setup

import { createSuperAdmin, initializeFirstSuperAdmin } from './create-super-admin';

/**
 * Quick setup function that can be called from browser console
 * Usage: await quickSetupSuperAdmin('admin@yourcompany.com', 'Your Name', 'YourStrongPassword123!')
 */
export const quickSetupSuperAdmin = async (
  email: string, 
  name: string, 
  password: string
) => {
  console.log('🚀 BuboIQ Super Admin Setup Started...');
  console.log('📧 Email:', email);
  console.log('👤 Name:', name);
  console.log('🔐 Password:', '*'.repeat(password.length));
  
  try {
    const result = await initializeFirstSuperAdmin(email, name, password);
    
    if (result.success) {
      console.log('✅ Super Admin created successfully!');
      console.log('🎉 You can now log in with:');
      console.log(`   📧 Email: ${email}`);
      console.log(`   🔑 Password: ${password}`);
      console.log('⚠️  Please change your password after first login in the Security tab');
      console.log('🚪 Please refresh the page and log in');
      
      // Show success message in UI if toast is available
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.success('Super Admin Created', {
          description: 'Please refresh and log in with your credentials'
        });
      }
    } else {
      console.error('❌ Failed to create super admin:', result.message);
      
      // Show error message in UI if toast is available  
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast.error('Setup Failed', {
          description: result.message
        });
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    
    if (typeof window !== 'undefined' && (window as any).toast) {
      (window as any).toast.error('Setup Error', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Interactive setup function that prompts for credentials
 */
export const interactiveSetupSuperAdmin = async () => {
  if (typeof window === 'undefined') {
    console.error('This function can only be run in a browser environment');
    return;
  }
  
  const email = prompt('Enter super admin email:');
  const name = prompt('Enter super admin name:');
  const password = prompt('Enter super admin password (min 8 characters):');
  
  if (!email || !name || !password) {
    console.error('❌ All fields are required');
    return;
  }
  
  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters');
    return;
  }
  
  return await quickSetupSuperAdmin(email, name, password);
};

// Make functions available globally for console use
if (typeof window !== 'undefined') {
  (window as any).quickSetupSuperAdmin = quickSetupSuperAdmin;
  (window as any).interactiveSetupSuperAdmin = interactiveSetupSuperAdmin;
  
  // Show setup instructions in console
  console.log(`
🦉 BuboIQ Super Admin Setup Available!

To create your first super admin, run one of these commands in the console:

1. Interactive setup (prompts for input):
   await interactiveSetupSuperAdmin()

2. Direct setup (provide credentials):
   await quickSetupSuperAdmin('admin@yourcompany.com', 'Your Name', 'YourPassword123!')

3. Or use the emergency function:
   await emergencyCreateSuperAdmin()

Make sure to:
✅ Use a strong password (8+ characters, mixed case, numbers, symbols)
✅ Use a real email address you have access to
✅ Change the password after first login in the Security tab
  `);
}