// Super Admin Creation Utility for BuboIQ
import { supabase } from './supabase/client';

interface CreateSuperAdminResult {
  success: boolean;
  message: string;
  userId?: string;
  tempPassword?: string;
}

/**
 * Creates a new super admin user
 * This should only be used for initial setup or emergency admin creation
 */
export async function createSuperAdmin(
  email: string,
  name: string,
  temporaryPassword?: string
): Promise<CreateSuperAdminResult> {
  try {
    // Generate a temporary password if not provided
    const tempPassword = temporaryPassword || generateTemporaryPassword();
    
    // Step 1: Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: {
          name,
          role: 'super_admin'
        }
      }
    });

    if (authError) {
      return {
        success: false,
        message: `Failed to create auth user: ${authError.message}`
      };
    }

    if (!authData.user) {
      return {
        success: false,
        message: 'User creation failed - no user data returned'
      };
    }

    // Step 2: Create the user profile with super_admin role
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: 'super_admin',
        org_id: null, // Super admins don't belong to any organization
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      return {
        success: false,
        message: `Failed to create user profile: ${profileError.message}`
      };
    }

    // Step 3: Log the super admin creation in audit log
    const { error: auditError } = await supabase
      .from('super_admin_audit_log')
      .insert({
        super_admin_id: authData.user.id,
        action: 'create_super_admin',
        target_org_id: null,
        details: {
          created_email: email,
          created_name: name,
          created_by: 'system_initialization'
        }
      });

    if (auditError) {
      console.warn('Failed to log super admin creation:', auditError);
      // Don't fail the entire operation for audit log issues
    }

    return {
      success: true,
      message: 'Super admin created successfully',
      userId: authData.user.id,
      tempPassword
    };

  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Updates an existing user to become a super admin
 */
export async function promoteToSuperAdmin(
  userId: string,
  promotedByAdminId?: string
): Promise<CreateSuperAdminResult> {
  try {
    // Update the user role to super_admin and clear org_id
    const { error: updateError } = await supabase
      .from('users')
      .update({
        role: 'super_admin',
        org_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      return {
        success: false,
        message: `Failed to promote user: ${updateError.message}`
      };
    }

    // Log the promotion in audit log
    if (promotedByAdminId) {
      const { error: auditError } = await supabase
        .from('super_admin_audit_log')
        .insert({
          super_admin_id: promotedByAdminId,
          action: 'promote_to_super_admin',
          target_org_id: null,
          details: {
            promoted_user_id: userId
          }
        });

      if (auditError) {
        console.warn('Failed to log super admin promotion:', auditError);
      }
    }

    return {
      success: true,
      message: 'User successfully promoted to super admin',
      userId
    };

  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Generates a secure temporary password
 */
function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  const length = 16;
  let password = '';
  
  // Ensure we have at least one of each type
  password += chars.charAt(Math.floor(Math.random() * 26)); // Uppercase
  password += chars.charAt(26 + Math.floor(Math.random() * 26)); // Lowercase  
  password += chars.charAt(52 + Math.floor(Math.random() * 7)); // Number
  password += chars.charAt(59 + Math.floor(Math.random() * 8)); // Special
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Initializes the first super admin for the system
 * Only works if no super admins exist
 */
export async function initializeFirstSuperAdmin(
  email: string,
  name: string,
  password: string
): Promise<CreateSuperAdminResult> {
  try {
    // Check if any super admins already exist
    const { data: existingSuperAdmins, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'super_admin')
      .limit(1);

    if (checkError) {
      return {
        success: false,
        message: `Failed to check existing super admins: ${checkError.message}`
      };
    }

    if (existingSuperAdmins && existingSuperAdmins.length > 0) {
      return {
        success: false,
        message: 'Super admin already exists. Use the promote function instead.'
      };
    }

    // Create the first super admin
    return await createSuperAdmin(email, name, password);

  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Emergency super admin creation script
 * For console/debugging use only
 */
export const emergencyCreateSuperAdmin = async () => {
  const email = prompt('Enter super admin email:');
  const name = prompt('Enter super admin name:');
  
  if (!email || !name) {
    console.error('Email and name are required');
    return;
  }

  console.log('Creating super admin...');
  const result = await createSuperAdmin(email, name);
  
  if (result.success) {
    console.log('✅ Super admin created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🔑 Temporary Password: ${result.tempPassword}`);
    console.log('⚠️  Please change the password immediately after first login');
    console.log(`🆔 User ID: ${result.userId}`);
  } else {
    console.error('❌ Failed to create super admin:', result.message);
  }
  
  return result;
};

// Make it available globally for emergency use
if (typeof window !== 'undefined') {
  (window as any).emergencyCreateSuperAdmin = emergencyCreateSuperAdmin;
}