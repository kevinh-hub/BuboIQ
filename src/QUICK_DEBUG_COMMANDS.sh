#!/bin/bash
# BuboIQ Backend Deployment Debugging Script
# Run these commands to debug the "Failed to fetch" issue

echo "🔍 BUBOIQ BACKEND DEBUGGING"
echo "=============================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_REF="xwcgpmqgqysxeovbrbxg"
BASE_URL="https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2"

echo "📋 Step 1: Check if Supabase CLI is installed"
echo "----------------------------------------------"
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✅ Supabase CLI is installed${NC}"
    supabase --version
else
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo "Install with: npm install -g supabase"
    exit 1
fi
echo ""

echo "📋 Step 2: List deployed functions"
echo "----------------------------------------------"
supabase functions list --project-ref $PROJECT_REF
echo ""

echo "📋 Step 3: Check environment variables/secrets"
echo "----------------------------------------------"
echo "Checking which secrets are set..."
supabase secrets list --project-ref $PROJECT_REF
echo ""
echo "⚠️  Required secrets:"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_SERVICE_ROLE_KEY"
echo ""

echo "📋 Step 4: Test health endpoint with curl"
echo "----------------------------------------------"
echo "Testing: ${BASE_URL}/health"
HTTP_CODE=$(curl -s -o /tmp/health_response.json -w "%{http_code}" ${BASE_URL}/health)
echo "HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
    cat /tmp/health_response.json | python3 -m json.tool 2>/dev/null || cat /tmp/health_response.json
elif [ "$HTTP_CODE" == "404" ]; then
    echo -e "${RED}❌ 404 Not Found - Function not deployed${NC}"
    echo "Fix: supabase functions deploy make-server-55e8c5b2 --project-ref $PROJECT_REF"
elif [ "$HTTP_CODE" == "500" ]; then
    echo -e "${RED}❌ 500 Internal Server Error - Function is crashing${NC}"
    echo "Response:"
    cat /tmp/health_response.json
    echo ""
    echo "Check logs with:"
    echo "supabase functions logs make-server-55e8c5b2 --project-ref $PROJECT_REF"
else
    echo -e "${YELLOW}⚠️  Unexpected status code: $HTTP_CODE${NC}"
    cat /tmp/health_response.json
fi
echo ""

echo "📋 Step 5: Test login endpoint"
echo "----------------------------------------------"
echo "Testing: ${BASE_URL}/auth/signin"
curl -X POST ${BASE_URL}/auth/signin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k" \
  -d '{"email":"kevinh@buboiq.com","password":"TestAccount123!"}' \
  | python3 -m json.tool 2>/dev/null || echo "(could not format JSON)"
echo ""

echo "📋 Step 6: Check recent function logs"
echo "----------------------------------------------"
echo "Last 20 log entries:"
supabase functions logs make-server-55e8c5b2 --project-ref $PROJECT_REF | tail -20
echo ""

echo "=============================="
echo "🎯 SUMMARY"
echo "=============================="
echo ""
echo "If health check PASSED (200):"
echo "  ✅ Backend is deployed and running"
echo "  → Try logging in via browser again"
echo "  → Clear browser cache and localStorage"
echo ""
echo "If health check FAILED (404):"
echo "  ❌ Function not deployed"
echo "  → Run: supabase functions deploy make-server-55e8c5b2 --project-ref $PROJECT_REF"
echo ""
echo "If health check FAILED (500):"
echo "  ❌ Function is crashing"
echo "  → Check logs above for error details"
echo "  → Likely missing environment variables"
echo "  → Set with: supabase secrets set SUPABASE_URL=... --project-ref $PROJECT_REF"
echo ""
echo "🔗 Useful links:"
echo "  Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"
echo "  Functions: https://supabase.com/dashboard/project/$PROJECT_REF/functions"
echo "  Logs: https://supabase.com/dashboard/project/$PROJECT_REF/logs/edge-functions"
echo "  API Keys: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo ""
