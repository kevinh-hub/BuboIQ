#!/bin/bash

# 🚀 SHIP IT - One-Command Surgical Deployment
# Phase 5: Full-Journey Demo Experience

set -e

echo ""
echo "████████████████████████████████████████████████████████████████"
echo "🚀 BuboIQ Phase 5 - SHIP IT"
echo "████████████████████████████████████████████████████████████████"
echo ""
echo "Surgical deployment with pre-flight checks, deployment, and"
echo "automated verification. This is the real deal."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Track deployment time
START_TIME=$(date +%s)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Step 0: Go/No-Go Checklist (2 minutes)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STEP 0: Go/No-Go Checklist (2 minutes)                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

GO_NOGO_PASS=true

# Check 1: Supabase Secrets
echo "1️⃣  Checking Supabase secrets..."
SECRETS=$(supabase secrets list 2>&1)

if echo "$SECRETS" | grep -q "RESEND_API_KEY"; then
    echo -e "${GREEN}   ✅ RESEND_API_KEY set${NC}"
else
    echo -e "${RED}   ❌ RESEND_API_KEY missing${NC}"
    GO_NOGO_PASS=false
fi

if echo "$SECRETS" | grep -q "SALES_EMAIL"; then
    echo -e "${GREEN}   ✅ SALES_EMAIL set${NC}"
else
    echo -e "${RED}   ❌ SALES_EMAIL missing${NC}"
    GO_NOGO_PASS=false
fi

if echo "$SECRETS" | grep -q "FRONTEND_URL"; then
    echo -e "${GREEN}   ✅ FRONTEND_URL set${NC}"
else
    echo -e "${RED}   ❌ FRONTEND_URL missing${NC}"
    GO_NOGO_PASS=false
fi

echo ""

# Check 2: Environment File
echo "2️⃣  Checking .env file..."
if [ -f .env ]; then
    if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo -e "${GREEN}   ✅ .env file configured${NC}"
    else
        echo -e "${RED}   ❌ .env file incomplete${NC}"
        GO_NOGO_PASS=false
    fi
else
    echo -e "${RED}   ❌ .env file missing${NC}"
    GO_NOGO_PASS=false
fi

echo ""

# Check 3: Prerequisites
echo "3️⃣  Checking prerequisites..."
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}   ✅ Supabase CLI installed${NC}"
else
    echo -e "${RED}   ❌ Supabase CLI not found${NC}"
    GO_NOGO_PASS=false
fi

if command -v npm &> /dev/null; then
    echo -e "${GREEN}   ✅ npm installed${NC}"
else
    echo -e "${RED}   ❌ npm not found${NC}"
    GO_NOGO_PASS=false
fi

echo ""

# Go/No-Go Decision
if [ "$GO_NOGO_PASS" = true ]; then
    echo -e "${GREEN}✅ Go/No-Go: GO FOR LAUNCH${NC}"
    echo ""
else
    echo -e "${RED}❌ Go/No-Go: NO-GO${NC}"
    echo ""
    echo "Fix issues above before deploying."
    echo "See GO_LIVE_CHECKLIST.md for details."
    exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Step 1: Deploy Backend
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STEP 1: Deploy Backend (3 minutes)                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "📦 Running database migration..."
supabase db push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration successful${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi

echo ""

echo "⚙️  Deploying Edge Functions..."
supabase functions deploy make-server

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Functions deployed${NC}"
else
    echo -e "${RED}❌ Function deployment failed${NC}"
    exit 1
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Step 2: Build & Deploy Frontend
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STEP 2: Build & Deploy Frontend (3 minutes)              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

echo ""

echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
    echo "   Output: dist/"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""

echo "🚀 Deploying to production..."
if command -v vercel &> /dev/null; then
    vercel --prod
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Deployed to Vercel${NC}"
    else
        echo -e "${RED}❌ Vercel deployment failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
    echo "   Manual deployment:"
    echo "   1. Upload dist/ to your hosting provider"
    echo "   2. Set environment variables"
    echo "   3. Deploy"
    echo ""
    read -p "   Deployed manually? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment not confirmed${NC}"
        exit 1
    fi
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Step 3: Immediate Verification (3 commands)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STEP 3: Immediate Verification (1 minute)                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Read environment for URLs
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

VERIFY_PASS=true

# Test 1: Health Endpoint
echo "1️⃣  Testing health endpoint..."
HEALTH_URL="${VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/health"
HEALTH_RESPONSE=$(curl -s "$HEALTH_URL")

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}   ✅ Health check PASSED${NC}"
    echo "   $HEALTH_RESPONSE"
else
    echo -e "${RED}   ❌ Health check FAILED${NC}"
    echo "   $HEALTH_RESPONSE"
    VERIFY_PASS=false
fi

echo ""

# Test 2: Lead Submission
echo "2️⃣  Testing lead submission..."
LEAD_URL="${VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/demo-leads"
TEST_EMAIL="deploy-test-$(date +%s)@buboiq.com"

LEAD_RESPONSE=$(curl -s -X POST "$LEAD_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
    -d "{\"name\":\"Deploy Test\",\"email\":\"$TEST_EMAIL\",\"company\":\"BuboIQ\",\"source\":\"ship_it_test\"}")

if echo "$LEAD_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}   ✅ Lead submission PASSED${NC}"
    echo "   $LEAD_RESPONSE"
else
    echo -e "${RED}   ❌ Lead submission FAILED${NC}"
    echo "   $LEAD_RESPONSE"
    VERIFY_PASS=false
fi

echo ""

# Test 3: Frontend Accessibility
echo "3️⃣  Testing frontend accessibility..."
read -p "   Enter production URL (or press Enter to skip): " FRONTEND_URL

if [ ! -z "$FRONTEND_URL" ]; then
    FRONTEND_RESPONSE=$(curl -s "$FRONTEND_URL")
    if echo "$FRONTEND_RESPONSE" | grep -q "BuboIQ"; then
        echo -e "${GREEN}   ✅ Frontend accessible${NC}"
    else
        echo -e "${RED}   ❌ Frontend not accessible${NC}"
        VERIFY_PASS=false
    fi
else
    echo -e "${YELLOW}   ⚠️  Skipped (no URL provided)${NC}"
fi

echo ""

# Verification Decision
if [ "$VERIFY_PASS" = true ]; then
    echo -e "${GREEN}✅ Immediate verification: PASSED${NC}"
    echo ""
else
    echo -e "${RED}❌ Immediate verification: FAILED${NC}"
    echo ""
    echo "Check errors above and:"
    echo "  supabase functions logs make-server --tail"
    exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Step 4: Smoke Test (Optional but Recommended)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  STEP 4: Smoke Test (Optional)                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

read -p "Run automated smoke test? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f smoke-test.sh ]; then
        chmod +x smoke-test.sh
        ./smoke-test.sh
    else
        echo -e "${YELLOW}⚠️  smoke-test.sh not found${NC}"
        echo "   Skipping automated smoke test"
    fi
else
    echo "   Skipped"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Deployment Complete
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "⏱️  Deployment time: ${MINUTES}m ${SECONDS}s"
echo ""
echo "📊 What was deployed:"
echo "   ✅ Database migration (demo_leads table)"
echo "   ✅ Edge Functions (make-server with health endpoint)"
echo "   ✅ Frontend build (production optimized)"
echo "   ✅ Full-Journey Demo (6-step workflow)"
echo "   ✅ Email notifications (auto-reply + sales)"
echo "   ✅ Lead management (admin panel + CSV export)"
echo ""
echo "🧪 Next steps (5-Minute Smoke Test):"
echo ""
echo "   Manual verification:"
echo "   1. Go to ${FRONTEND_URL:-your production URL}"
echo "   2. Click 'Start the Live Demo'"
echo "   3. Walk through all 6 steps"
echo "   4. Submit lead form"
echo "   5. Check email inbox"
echo "   6. Verify lead in admin panel"
echo ""
echo "📈 Monitoring:"
echo "   → Function logs: supabase functions logs make-server --follow"
echo "   → Google Analytics: Check real-time events"
echo "   → Email delivery: https://resend.com/emails"
echo "   → Admin panel: Login → Demo Leads"
echo ""
echo "📚 Documentation:"
echo "   → GO_LIVE_CHECKLIST.md - Full go-live procedures"
echo "   → KPI_TRACKING_GUIDE.md - Monitoring guide"
echo "   → PHASE_5_COMPLETE.md - Technical reference"
echo ""
echo "🔄 Rollback (if needed):"
echo "   → vercel rollback"
echo "   → git checkout <previous-commit> && ./SHIP_IT.sh"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}🎉 CONGRATULATIONS! BuboIQ Phase 5 is LIVE!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Time to first lead: ~15 minutes 🚀"
echo ""
