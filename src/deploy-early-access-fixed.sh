#!/bin/bash

# ============================================================================
# BuboIQ Early Access Deployment (FIXED VERSION)
# ============================================================================
# Deploys the Early Access system integrated into make-server
# ============================================================================

set -e  # Exit on error

echo "🎟️  BuboIQ Early Access Deployment (Fixed)"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Step 1: Deploying make-server function (includes Early Access)...${NC}"

# Deploy make-server function (includes Early Access routes)
echo "Note: Deploying make-server only (server function is deprecated)"
supabase functions deploy make-server || {
    echo -e "${RED}❌ Deployment failed. Check error above.${NC}"
    exit 1
}

echo -e "${GREEN}✓${NC} make-server deployed successfully"
echo ""

echo -e "${YELLOW}📊 Step 2: Applying Early Access database migration...${NC}"

# Push migration
supabase db push || {
    echo -e "${RED}❌ Migration failed. Check error above.${NC}"
    exit 1
}

echo -e "${GREEN}✓${NC} Database migration applied"
echo ""

echo -e "${YELLOW}🔐 Step 3: Checking secrets...${NC}"

# Check for RESEND_API_KEY
supabase secrets list | grep -q "RESEND_API_KEY" && {
    echo -e "${GREEN}✓${NC} RESEND_API_KEY is set"
} || {
    echo -e "${YELLOW}⚠️  RESEND_API_KEY not found${NC}"
    echo ""
    echo "Set it with:"
    echo "  supabase secrets set RESEND_API_KEY=your_resend_api_key"
    echo ""
    echo "Get your API key from: https://resend.com"
    echo ""
}

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Early Access Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "📍 API Routes Available:"
echo "   /make-server-55e8c5b2/early-access/admin/stats"
echo "   /make-server-55e8c5b2/early-access/admin/invites"
echo "   /make-server-55e8c5b2/early-access/admin/create"
echo "   /make-server-55e8c5b2/early-access/validate/:token"
echo "   /make-server-55e8c5b2/early-access/redeem"
echo ""
echo "🎯 Next Steps:"
echo "   1. Create super admin (if not already):"
echo "      UPDATE users SET role = 'super_admin' WHERE email = 'your@email.com';"
echo ""
echo "   2. Access admin dashboard at: /early-access-admin"
echo ""
echo "   3. Create your first invite!"
echo ""
echo "📚 Documentation:"
echo "   - Full guide: EARLY_ACCESS_SYSTEM_COMPLETE.md"
echo "   - Quick start: EARLY_ACCESS_QUICK_START.md"
echo "   - Fix details: EARLY_ACCESS_DEPLOYMENT_FIX.md"
echo ""
echo "Questions? Email help@buboiq.com"
echo ""
