#!/bin/bash

# ============================================================================
# BuboIQ Super Admin User Creation Script
# ============================================================================
# Creates super admin user via Supabase Admin API
# Credentials: admin@buboiq.dev / BuboIQ2024!Admin
# ============================================================================

set -e

echo "🚀 BuboIQ Super Admin Creation Script"
echo "======================================"
echo ""

# Check for required environment variables
if [ -z "$SUPABASE_URL" ]; then
  echo "❌ Error: SUPABASE_URL environment variable not set"
  echo "   Please set: export SUPABASE_URL=https://your-project-id.supabase.co"
  exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set"
  echo "   Please set: export SUPABASE_SERVICE_ROLE_KEY=eyJxxx..."
  exit 1
fi

ADMIN_EMAIL="admin@buboiq.dev"
ADMIN_PASSWORD="BuboIQ2024!Admin"

echo "Creating super admin user..."
echo "Email: $ADMIN_EMAIL"
echo ""

# Step 1: Create user via Supabase Auth Admin API
echo "Step 1/3: Creating user in Supabase Auth..."

AUTH_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\",
    \"email_confirm\": true,
    \"user_metadata\": {
      \"role\": \"super_admin\"
    }
  }")

# Check if user was created successfully
if echo "$AUTH_RESPONSE" | grep -q '"id"'; then
  USER_ID=$(echo "$AUTH_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "✓ User created successfully"
  echo "  User ID: $USER_ID"
else
  # Check if user already exists
  if echo "$AUTH_RESPONSE" | grep -q "already exists"; then
    echo "⚠ User already exists, fetching existing user ID..."
    
    # Get user by email
    EXISTING_USER=$(curl -s -X GET "$SUPABASE_URL/auth/v1/admin/users?email=$ADMIN_EMAIL" \
      -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
      -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")
    
    USER_ID=$(echo "$EXISTING_USER" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "  User ID: $USER_ID"
    
    # Update password just in case
    echo "  Updating password..."
    curl -s -X PUT "$SUPABASE_URL/auth/v1/admin/users/$USER_ID" \
      -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
      -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"password\": \"$ADMIN_PASSWORD\"}" > /dev/null
    echo "  ✓ Password updated"
  else
    echo "❌ Error creating user:"
    echo "$AUTH_RESPONSE" | jq '.' 2>/dev/null || echo "$AUTH_RESPONSE"
    exit 1
  fi
fi

echo ""

# Step 2: Insert/update public.users table with super_admin role
echo "Step 2/3: Granting super_admin role in database..."

# Using REST API to upsert into public.users
USERS_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/rest/v1/users?on_conflict=id" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates,return=representation" \
  -d "{
    \"id\": \"$USER_ID\",
    \"email\": \"$ADMIN_EMAIL\",
    \"role\": \"super_admin\"
  }")

if echo "$USERS_RESPONSE" | grep -q "super_admin"; then
  echo "✓ Super admin role granted"
else
  # Check if already exists with role
  EXISTING_ROLE=$(curl -s -X GET "$SUPABASE_URL/rest/v1/users?id=eq.$USER_ID&select=role" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY")
  
  if echo "$EXISTING_ROLE" | grep -q "super_admin"; then
    echo "✓ Super admin role already set"
  else
    echo "⚠ Warning: Could not verify role assignment"
    echo "  You may need to manually run:"
    echo "  UPDATE public.users SET role = 'super_admin' WHERE id = '$USER_ID';"
  fi
fi

echo ""

# Step 3: Verify setup
echo "Step 3/3: Verifying setup..."

# Test auth login
echo "Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

if echo "$LOGIN_RESPONSE" | grep -q '"access_token"'; then
  echo "✓ Login test successful"
else
  echo "❌ Login test failed:"
  echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
  exit 1
fi

echo ""
echo "======================================"
echo "✅ Super Admin User Created Successfully!"
echo "======================================"
echo ""
echo "Credentials:"
echo "  Email:    $ADMIN_EMAIL"
echo "  Password: $ADMIN_PASSWORD"
echo "  Role:     super_admin"
echo "  User ID:  $USER_ID"
echo ""
echo "Next steps:"
echo "  1. Test login: Navigate to http://localhost:5173/ and click 'Sign In'"
echo "  2. Click 'Login as Super Admin' button"
echo "  3. Navigate to /admin to access Back Office"
echo "  4. Run tests: npm run test:e2e"
echo ""
echo "⚠️  IMPORTANT: For production, change this password to a strong, unique value!"
echo ""
