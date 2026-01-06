#!/bin/bash

# 🧪 Phase 5 - 5-Minute Smoke Test
# Automated verification of critical paths

set -e

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🧪 BuboIQ Phase 5 - Smoke Test"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Read environment
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Get URLs from environment or prompt
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  VITE_SUPABASE_URL not set in .env${NC}"
    read -p "Enter Supabase URL: " VITE_SUPABASE_URL
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${YELLOW}⚠️  VITE_SUPABASE_ANON_KEY not set in .env${NC}"
    read -p "Enter Supabase Anon Key: " VITE_SUPABASE_ANON_KEY
fi

# Determine frontend URL
read -p "Enter frontend URL (default: http://localhost:5173): " FRONTEND_URL
FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}

echo ""
echo -e "${BLUE}Testing against:${NC}"
echo "  Frontend: $FRONTEND_URL"
echo "  Supabase: $VITE_SUPABASE_URL"
echo ""

# Test 1: Health Endpoint
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Testing Health Endpoint"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HEALTH_URL="${VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/health"
echo "   URL: $HEALTH_URL"

HEALTH_RESPONSE=$(curl -s "$HEALTH_URL")
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$HEALTH_STATUS" = "ok" ]; then
    echo -e "${GREEN}   ✅ Health check PASSED${NC}"
    echo "   Response: $HEALTH_RESPONSE"
    ((PASS_COUNT++))
else
    echo -e "${RED}   ❌ Health check FAILED${NC}"
    echo "   Response: $HEALTH_RESPONSE"
    ((FAIL_COUNT++))
fi
echo ""

# Test 2: Demo Start API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Testing Demo Start API (Ephemeral Org)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Note: This endpoint may not exist yet - that's OK
DEMO_URL="${FRONTEND_URL}/api/demo/start"
echo "   URL: $DEMO_URL"

DEMO_RESPONSE=$(curl -s -X POST "$DEMO_URL" -H "Content-Type: application/json" || echo '{"error":"not_found"}')

if echo "$DEMO_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}   ✅ Demo start API PASSED${NC}"
    echo "   Response: $DEMO_RESPONSE"
    ((PASS_COUNT++))
else
    echo -e "${YELLOW}   ⚠️  Demo start API not implemented yet${NC}"
    echo "   This is OK - demo works without ephemeral orgs"
    echo "   Response: $DEMO_RESPONSE"
    ((WARN_COUNT++))
fi
echo ""

# Test 3: Lead Submission
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Testing Lead Submission (Email Path)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LEAD_URL="${VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/demo-leads"
echo "   URL: $LEAD_URL"

# Generate unique email for test
TEST_EMAIL="smoke-test-$(date +%s)@buboiq.com"

LEAD_PAYLOAD=$(cat <<EOF
{
  "name": "Smoke Test User",
  "email": "$TEST_EMAIL",
  "company": "BuboIQ Smoke Test",
  "source": "automated_smoke_test"
}
EOF
)

LEAD_RESPONSE=$(curl -s -X POST "$LEAD_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
    -d "$LEAD_PAYLOAD")

if echo "$LEAD_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}   ✅ Lead submission PASSED${NC}"
    echo "   Response: $LEAD_RESPONSE"
    echo ""
    echo "   📧 Check emails:"
    echo "   - Auto-reply sent to: $TEST_EMAIL"
    echo "   - Sales notification sent"
    ((PASS_COUNT++))
else
    echo -e "${RED}   ❌ Lead submission FAILED${NC}"
    echo "   Response: $LEAD_RESPONSE"
    ((FAIL_COUNT++))
fi
echo ""

# Test 4: Frontend Accessibility
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Testing Frontend Accessibility"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "   URL: $FRONTEND_URL"

FRONTEND_RESPONSE=$(curl -s "$FRONTEND_URL")

if echo "$FRONTEND_RESPONSE" | grep -q "BuboIQ"; then
    echo -e "${GREEN}   ✅ Frontend accessible${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}   ❌ Frontend not accessible${NC}"
    ((FAIL_COUNT++))
fi
echo ""

# Test 5: Database Connection (via function)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Testing Database Connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Parse health response for database status
DB_STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"database":"[^"]*"' | cut -d'"' -f4)

if [ "$DB_STATUS" = "ok" ]; then
    echo -e "${GREEN}   ✅ Database connection OK${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}   ❌ Database connection FAILED${NC}"
    echo "   Status: $DB_STATUS"
    ((FAIL_COUNT++))
fi
echo ""

# Test 6: Email Configuration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Testing Email Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Parse health response for email status
EMAIL_STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)

if [ "$EMAIL_STATUS" = "ok" ]; then
    echo -e "${GREEN}   ✅ Email configured (RESEND_API_KEY set)${NC}"
    ((PASS_COUNT++))
elif [ "$EMAIL_STATUS" = "warning" ]; then
    echo -e "${YELLOW}   ⚠️  Email not configured (RESEND_API_KEY missing)${NC}"
    echo "   Set with: supabase secrets set RESEND_API_KEY=re_your_key"
    ((WARN_COUNT++))
else
    echo -e "${RED}   ❌ Email configuration FAILED${NC}"
    ((FAIL_COUNT++))
fi
echo ""

# Summary
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 Smoke Test Summary"
echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARN_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ] && [ $WARN_COUNT -eq 0 ]; then
    echo "🎉 All tests passed! System is healthy."
    echo ""
    echo "✅ Ready for production traffic!"
    exit 0
elif [ $FAIL_COUNT -eq 0 ]; then
    echo "⚠️  Some warnings, but core functionality works."
    echo ""
    echo "   Review warnings above and address as needed."
    echo "   System is functional but not optimal."
    exit 0
else
    echo "❌ Some tests failed. Review errors above."
    echo ""
    echo "   Fix issues before going live."
    echo ""
    echo "🔍 Diagnostic commands:"
    echo "   supabase functions logs make-server --tail"
    echo "   supabase db remote status"
    echo "   curl $HEALTH_URL"
    exit 1
fi
