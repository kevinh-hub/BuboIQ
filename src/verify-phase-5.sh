#!/bin/bash

# 🔍 BuboIQ Phase 5 Verification Script
# Quick health check for all Phase 5 components

set -e

echo "🔍 Verifying BuboIQ Phase 5 Deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Read .env for URLs
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Test 1: Function Health Endpoint
echo "1️⃣  Testing function health endpoint..."
HEALTH_URL="${VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/health"
HEALTH_RESPONSE=$(curl -s "$HEALTH_URL")

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}   ✅ Function health: OK${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}   ❌ Function health: FAILED${NC}"
    echo "   Response: $HEALTH_RESPONSE"
    ((FAIL_COUNT++))
fi
echo ""

# Test 2: Database Migration
echo "2️⃣  Checking database migration..."
DB_CHECK=$(supabase db remote status 2>&1)
if echo "$DB_CHECK" | grep -q "up to date"; then
    echo -e "${GREEN}   ✅ Database: Up to date${NC}"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}   ⚠️  Database: Needs migration${NC}"
    echo "   Run: supabase db push"
    ((WARN_COUNT++))
fi
echo ""

# Test 3: Demo Leads Table Exists
echo "3️⃣  Checking demo_leads table..."
# Note: This requires a SQL query, simplified check
echo -e "${YELLOW}   ⚠️  Manual check required${NC}"
echo "   Run in Supabase SQL Editor:"
echo "   SELECT COUNT(*) FROM demo_leads;"
((WARN_COUNT++))
echo ""

# Test 4: Supabase Secrets
echo "4️⃣  Checking Supabase secrets..."
SECRETS=$(supabase secrets list 2>&1)

if echo "$SECRETS" | grep -q "RESEND_API_KEY"; then
    echo -e "${GREEN}   ✅ RESEND_API_KEY: Set${NC}"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}   ⚠️  RESEND_API_KEY: Not set${NC}"
    ((WARN_COUNT++))
fi

if echo "$SECRETS" | grep -q "SALES_EMAIL"; then
    echo -e "${GREEN}   ✅ SALES_EMAIL: Set${NC}"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}   ⚠️  SALES_EMAIL: Not set${NC}"
    ((WARN_COUNT++))
fi

if echo "$SECRETS" | grep -q "FRONTEND_URL"; then
    echo -e "${GREEN}   ✅ FRONTEND_URL: Set${NC}"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}   ⚠️  FRONTEND_URL: Not set${NC}"
    ((WARN_COUNT++))
fi
echo ""

# Test 5: Frontend Build
echo "5️⃣  Checking frontend build..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo -e "${GREEN}   ✅ Build exists: dist/index.html${NC}"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}   ⚠️  No build found${NC}"
    echo "   Run: npm run build"
    ((WARN_COUNT++))
fi
echo ""

# Test 6: Frontend Environment
echo "6️⃣  Checking frontend environment..."
if [ -f ".env" ]; then
    if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo -e "${GREEN}   ✅ Environment variables: Set${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}   ❌ Environment variables: Incomplete${NC}"
        ((FAIL_COUNT++))
    fi
else
    echo -e "${RED}   ❌ .env file: Not found${NC}"
    ((FAIL_COUNT++))
fi
echo ""

# Test 7: Component Files
echo "7️⃣  Checking component files..."
COMPONENTS=(
    "components/demo/FullJourneyDemo.tsx"
    "components/admin/DemoLeadsPanel.tsx"
    "components/app/pages/DemoLeadsAdminPage.tsx"
    "supabase/functions/make-server/demo-leads.ts"
    "supabase/functions/make-server/notifications.ts"
    "supabase/functions/make-server/lead-export.ts"
)

MISSING=0
for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo -e "${GREEN}   ✅ $component${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}   ❌ $component: MISSING${NC}"
        ((FAIL_COUNT++))
        ((MISSING++))
    fi
done
echo ""

# Test 8: Test Lead Submission (Optional)
echo "8️⃣  Test lead submission (optional)..."
read -p "   Submit test lead? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    LEAD_URL="${VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/demo-leads"
    TEST_LEAD='{
      "name": "Test User",
      "email": "test@example.com",
      "company": "Test Company",
      "source": "verification_script"
    }'
    
    LEAD_RESPONSE=$(curl -s -X POST "$LEAD_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
        -d "$TEST_LEAD")
    
    if echo "$LEAD_RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}   ✅ Lead submission: SUCCESS${NC}"
        echo "   Response: $LEAD_RESPONSE"
        ((PASS_COUNT++))
    else
        echo -e "${RED}   ❌ Lead submission: FAILED${NC}"
        echo "   Response: $LEAD_RESPONSE"
        ((FAIL_COUNT++))
    fi
else
    echo "   Skipped"
fi
echo ""

# Summary
echo ""
echo "════════════════════════════════════════════════"
echo "📊 Verification Summary"
echo "════════════════════════════════════════════════"
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARN_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ] && [ $WARN_COUNT -eq 0 ]; then
    echo "🎉 All checks passed! Deployment is healthy."
    echo ""
    echo "✅ Ready for production!"
    exit 0
elif [ $FAIL_COUNT -eq 0 ]; then
    echo "⚠️  Some warnings, but deployment is functional."
    echo ""
    echo "   Review warnings above and address as needed."
    exit 0
else
    echo "❌ Some checks failed. Review errors above."
    echo ""
    echo "   Fix issues and run verification again."
    exit 1
fi
