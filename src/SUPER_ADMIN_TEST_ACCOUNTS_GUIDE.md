# Super Admin Test Accounts & Organizations Guide

## Overview
As a Super Admin, you can now create test organizations and user accounts directly within BuboIQ to test features across different tiers, roles, and organizational contexts.

## Access

### Who Can Use This Feature?
- **Super Admin only** (currently: kevinh@buboiq.com)
- The feature is automatically enabled for users with the `super_admin` database role

### How to Access
1. Log in as a Super Admin user
2. Navigate to **Settings** from the sidebar
3. Look for the **Super Admin** section in the settings sidebar
4. Click on **Test Organizations**

## Features

### 1. Create Organizations

Create test organizations with customizable properties:

**Organization Properties:**
- **Name**: Company/organization name (e.g., "Acme Corp")
- **Domain**: Optional email domain (e.g., "acme.com")
- **Tier**: Choose from Starter, Pro, Team, or Enterprise
- **Status**: Active or Inactive

**Tier Limits (auto-configured):**
- **Starter**: 5 users, 25 devices
- **Pro**: 10 users, 100 devices
- **Team**: 50 users, 500 devices
- **Enterprise**: Unlimited users and devices

**Steps:**
1. Click "Create Organization" button
2. Fill in organization details
3. Select tier and status
4. Click "Create Organization"

### 2. Create Users Within Organizations

Add test user accounts to any organization:

**User Properties:**
- **Email**: User's email address (must be unique)
- **Name**: Optional display name
- **Role**: Owner, Admin, Agent, or Viewer
- **Tier**: Can override organization's default tier
- **Password**: Custom password (default: "Welcome123!")

**Steps:**
1. Find the organization card
2. Click "Add User" button
3. Fill in user details
4. Click "Create User"
5. **Important**: Copy the displayed credentials immediately (they won't be shown again)

**Default Password:**
If you don't specify a password, the default is `Welcome123!`

### 3. View Organization Users

See all users within an organization:

**Steps:**
1. Find the organization card
2. Click "View Users" button
3. Browse the list of users with their roles and tiers
4. Optionally add more users from this view

### 4. Search Organizations

Quickly find organizations:
- Search by organization name
- Search by domain
- Real-time filtering as you type

## Use Cases

### Testing Different Tiers
1. Create organizations with different tiers (Starter, Pro, Team, Enterprise)
2. Create users within each organization
3. Log in as those users to test tier-specific features

### Testing Role Permissions
1. Create multiple users in the same organization with different roles
2. Log in as each user to test role-based access control
3. Verify that Owner, Admin, Agent, and Viewer roles work correctly

### Testing Multi-Organization Scenarios
1. Create multiple organizations
2. Create users in each organization
3. Test organization isolation and data segregation

### Testing Onboarding Flows
1. Create a fresh organization
2. Create a new user account
3. Log in as that user to test the onboarding experience

## API Endpoints (For Reference)

All endpoints require Super Admin authentication.

### Organizations
- `GET /super-admin/organizations` - List all organizations
- `POST /super-admin/organizations/create` - Create new organization
- `GET /super-admin/organizations/:id/users` - Get users in organization
- `POST /super-admin/organizations/:id/toggle-status` - Toggle org status

### Users
- `POST /super-admin/organizations/:orgId/users/create` - Create user in org
- `GET /super-admin/users` - List all users
- `POST /super-admin/users/:id/role` - Update user role

## Backend Implementation

### Authentication
- Super Admin verification checks:
  - Email matches `kevinh@buboiq.com`, OR
  - `user_metadata.role === 'super_admin'`, OR
  - `app_metadata.role === 'super_admin'`

### Data Storage
- Organizations stored in KV store with key pattern: `org:{orgId}`
- Users stored in KV store with key pattern: `user:{userId}`
- Organization-user relationships stored in: `org_users:{orgId}`
- Email lookup stored in: `user_email:{email}`

### User Creation Flow
1. Validate Super Admin access
2. Check if organization exists
3. Check if user email is already registered
4. Create Supabase Auth user with `admin.createUser()`
5. Auto-confirm email (no verification needed for test accounts)
6. Store user profile in KV store
7. Link user to organization
8. Return user details with password

## Security Notes

- ✅ Super Admin access is required for all operations
- ✅ Authentication tokens are validated on every request
- ✅ Email uniqueness is enforced
- ✅ Passwords are hashed by Supabase Auth
- ⚠️ Credentials are shown only once after user creation
- ⚠️ Default password is "Welcome123!" if not specified

## Tips & Best Practices

### Naming Conventions
Use clear, descriptive names for test organizations:
- ✅ "Test - Acme Corp (Starter)"
- ✅ "Demo - Healthcare Inc (Enterprise)"
- ✅ "QA - TechStart (Pro)"

### Email Addresses
Use a pattern that makes test accounts easy to identify:
- ✅ `test-owner@acme-test.com`
- ✅ `demo-admin@healthcare-demo.com`
- ✅ `qa-user@techstart-qa.com`

### Password Management
- Document test account credentials in a secure location
- Use the default password for quick testing
- Set custom passwords for long-term test accounts

### Cleanup
- Mark unused organizations as "Inactive" instead of deleting them
- Keep a registry of test organizations and their purposes
- Periodically review and clean up old test data

## Quick Start Example

**Scenario**: Test the Pro tier features

1. **Create Organization**
   - Name: "Test - Tech Solutions"
   - Domain: "techsolutions-test.com"
   - Tier: Pro
   - Status: Active

2. **Create Owner User**
   - Email: `owner@techsolutions-test.com`
   - Name: "Test Owner"
   - Role: Owner
   - Password: (use default)
   
3. **Create Agent User**
   - Email: `agent@techsolutions-test.com`
   - Name: "Test Agent"
   - Role: Agent
   - Password: (use default)

4. **Test Features**
   - Log in as owner@techsolutions-test.com (password: Welcome123!)
   - Verify Pro tier features are accessible
   - Log in as agent@techsolutions-test.com (password: Welcome123!)
   - Verify Agent role has correct permissions

## Troubleshooting

### "Unauthorized" Error
- Verify you're logged in as kevinh@buboiq.com
- Check that your session hasn't expired
- Try logging out and logging back in

### "User already exists" Error
- The email address is already registered
- Try a different email address
- Check if the user was created in a different organization

### "Organization not found" Error
- The organization may have been deleted
- Verify the organization ID is correct
- Create a new organization if needed

### Can't See "Test Organizations" Tab
- Verify you're logged in as a Super Admin
- Check that `user.db_role === 'super_admin'`
- Contact system administrator if the issue persists

## Future Enhancements

Potential features for future versions:
- Bulk user creation from CSV
- Organization cloning/templates
- User impersonation for testing
- Activity logs for Super Admin actions
- Organization deletion with cascade
- User role switching without re-login
- Test data reset functionality

## Support

For issues or questions about Super Admin features:
- Check the troubleshooting section above
- Review the backend logs for error details
- Contact the development team

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Super Admin Email**: kevinh@buboiq.com
