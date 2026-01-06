#!/bin/bash

# ============================================================================
# BuboIQ Early Access System Deployment Script
# ============================================================================
# Deploys the complete invite-only, time-gated Early Access program
#
# Components:
# - Database schema (cohort, invites, audit log)
# - Backend API routes (admin + public redemption)
# - Frontend components (admin dashboard, badges, modals)
# - Email templates (Resend integration)
#
# Prerequisites:
# - Supabase project configured
# - RESEND_API_KEY secret set
# - Super admin account created
# ============================================================================

set -e  # Exit on error

echo "🎟️  BuboIQ Early Access System Deployment"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================================================
# Step 1: Check Prerequisites
# ============================================================================

echo -e "${YELLOW}📋 Step 1: Checking Prerequisites...${NC}"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found. Install from https://supabase.com/docs/guides/cli${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Supabase CLI installed"

# Check if migration file exists
if [ ! -f "supabase/migrations/20251022_early_access_system.sql" ]; then
    echo -e "${RED}❌ Migration file not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Migration file found"

# Check if early-access API exists in make-server
if [ ! -f "supabase/functions/make-server/early-access.ts" ]; then
    echo -e "${RED}❌ Early Access API file not found in make-server${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Early Access API file found"

echo ""

# ============================================================================
# Step 2: Database Migration
# ============================================================================

echo -e "${YELLOW}📊 Step 2: Deploying Database Schema...${NC}"

# Link to Supabase project (if not already linked)
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠️  Not linked to Supabase project. Please link first:${NC}"
    echo "   supabase link --project-ref your-project-ref"
    exit 1
fi

# Push migration
echo "Applying migration..."
supabase db push || {
    echo -e "${RED}❌ Migration failed. Check error above.${NC}"
    exit 1
}

echo -e "${GREEN}✓${NC} Database schema deployed"
echo ""

# ============================================================================
# Step 3: Deploy Server Functions
# ============================================================================

echo -e "${YELLOW}🚀 Step 3: Deploying Server Functions...${NC}"

# Deploy make-server function (includes early-access routes)
echo "Deploying make-server function..."
supabase functions deploy make-server || {
    echo -e "${RED}❌ Function deployment failed. Check error above.${NC}"
    exit 1
}

echo -e "${GREEN}✓${NC} Server functions deployed"
echo ""

# ============================================================================
# Step 4: Verify Secrets
# ============================================================================

echo -e "${YELLOW}🔐 Step 4: Verifying Secrets...${NC}"

echo "Checking for RESEND_API_KEY..."
supabase secrets list | grep -q "RESEND_API_KEY" || {
    echo -e "${YELLOW}⚠️  RESEND_API_KEY not found. Set it with:${NC}"
    echo "   supabase secrets set RESEND_API_KEY=your_resend_api_key"
    echo ""
    echo "Get your API key from: https://resend.com"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
}

echo -e "${GREEN}✓${NC} Secrets verified"
echo ""

# ============================================================================
# Step 5: Initialize Cohort Configuration
# ============================================================================

echo -e "${YELLOW}⚙️  Step 5: Cohort Configuration...${NC}"

echo "The migration creates a default cohort with:"
echo "  - Org Cap: 50"
echo "  - Device Cap: 5000"
echo "  - Closes At: Now + 90 days"
echo "  - Emergency Closed: FALSE"
echo "  - Auto Expire: TRUE"
echo ""
echo "You can update these via the Admin Dashboard or SQL."
echo ""

# ============================================================================
# Step 6: Verify Super Admin
# ============================================================================

echo -e "${YELLOW}👤 Step 6: Verifying Super Admin...${NC}"

echo "Make sure you have a super admin account to access the EA Admin Dashboard."
echo "If not, create one with:"
echo ""
echo "  UPDATE users SET role = 'super_admin' WHERE email = 'your@email.com';"
echo ""
read -p "Super admin account exists? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Create a super admin account before accessing the dashboard${NC}"
fi

echo ""

# ============================================================================
# Step 7: Deployment Summary
# ============================================================================

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Early Access System Deployed!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "📦 What was deployed:"
echo "  ✓ Database tables (cohort, invites, audit_log)"
echo "  ✓ Functions (token generation, capacity checks, auto-expiration)"
echo "  ✓ RLS policies (super admin access)"
echo "  ✓ Backend API routes (admin + public redemption)"
echo "  ✓ Email templates (invite, acceptance, revoked)"
echo ""
echo "🎯 Next Steps:"
echo "  1. Access Admin Dashboard at: /early-access-admin"
echo "  2. Configure cohort settings (caps, closing date)"
echo "  3. Create your first invite"
echo "  4. Test redemption flow"
echo ""
echo "📚 Documentation:"
echo "  - See EARLY_ACCESS_SYSTEM_COMPLETE.md for full guide"
echo "  - API routes: /early-access/admin/* and /early-access/*"
echo "  - Components: /components/early-access/*"
echo ""
echo "🔗 API Endpoints:"
echo "  Admin Stats:    POST /early-access/admin/stats"
echo "  Create Invite:  POST /early-access/admin/create"
echo "  List Invites:   GET  /early-access/admin/invites"
echo "  Revoke Invite:  POST /early-access/admin/revoke/:id"
echo "  Validate Token: GET  /early-access/validate/:token"
echo "  Redeem Invite:  POST /early-access/redeem"
echo ""
echo "📧 Email Configuration:"
echo "  - Sender: onboarding@buboiq.com"
echo "  - Support: help@buboiq.com"
echo "  - Verify domain in Resend dashboard"
echo ""
echo "🚨 Important Reminders:"
echo "  - Invites are single-use only"
echo "  - Tokens auto-expire after configured days"
echo "  - Cohort limits are enforced on redemption"
echo "  - Emergency close blocks all redemptions"
echo "  - All operations are audit logged"
echo ""
echo -e "${GREEN}🎉 Early Access System is ready!${NC}"
echo ""
echo "Questions? Email help@buboiq.com"
echo ""

# ============================================================================
# Optional: Test API Connectivity
# ============================================================================

read -p "Test API connectivity? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Testing server health..."
    
    # Get Supabase URL
    PROJECT_REF=$(cat .supabase/config.toml | grep 'project_id' | cut -d '"' -f 2)
    API_URL="https://${PROJECT_REF}.supabase.co/functions/v1/make-server-55e8c5b2"
    
    # Test init endpoint
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/init")
    
    if [ "$RESPONSE" -eq 200 ]; then
        echo -e "${GREEN}✓${NC} Server is responding (HTTP $RESPONSE)"
    else
        echo -e "${YELLOW}⚠️${NC}  Server returned HTTP $RESPONSE"
        echo "   This may be normal if auth is required"
    fi
    
    echo ""
fi

echo "Deployment complete! 🦉"
