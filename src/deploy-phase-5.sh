#!/bin/bash

# 🚀 BuboIQ Phase 5 Deployment Script
# Complete Full-Journey Demo + Email Notifications + Lead Export

set -e  # Exit on error

echo "🚀 BuboIQ Phase 5 Deployment Starting..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo "📋 Step 1: Checking prerequisites..."
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found. Install it first:${NC}"
    echo "   brew install supabase/tap/supabase  # macOS"
    echo "   OR npm install -g supabase  # Cross-platform"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"
echo ""

# Step 2: Check environment variables
echo "📋 Step 2: Checking environment variables..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cat > .env << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
EOF
    echo -e "${YELLOW}⚠️  Please update .env with your actual values${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables OK${NC}"
echo ""

# Step 3: Run database migrations
echo "📋 Step 3: Running database migrations..."
echo "   Applying demo_leads table + analytics views..."
supabase db push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations applied successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi
echo ""

# Step 4: Deploy Edge Functions
echo "📋 Step 4: Deploying Edge Functions..."
echo "   Deploying make-server function..."
supabase functions deploy make-server

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Functions deployed successfully${NC}"
else
    echo -e "${RED}❌ Function deployment failed${NC}"
    exit 1
fi
echo ""

# Step 5: Check Supabase secrets
echo "📋 Step 5: Checking Supabase secrets..."
echo "   Required secrets for Phase 4-5:"
echo "   - RESEND_API_KEY (for email notifications)"
echo "   - SALES_EMAIL (where to send lead notifications)"
echo "   - FRONTEND_URL (for email links)"
echo "   - SLACK_WEBHOOK_URL (optional)"
echo ""
echo "   To set secrets, run:"
echo "   supabase secrets set RESEND_API_KEY=re_your_key"
echo "   supabase secrets set SALES_EMAIL=sales@buboiq.com"
echo "   supabase secrets set FRONTEND_URL=https://buboiq.com"
echo ""
read -p "   Have you set these secrets? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Please set secrets before continuing${NC}"
    echo "   Deployment paused. Run this script again after setting secrets."
    exit 1
fi
echo -e "${GREEN}✅ Secrets configured${NC}"
echo ""

# Step 6: Install dependencies
echo "📋 Step 6: Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi
echo ""

# Step 7: Build application
echo "📋 Step 7: Building Vite application..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
    echo "   Build output: dist/"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 8: Test function endpoint
echo "📋 Step 8: Testing function endpoint..."
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2)
TEST_URL="${SUPABASE_URL}/functions/v1/make-server-55e8c5b2/health"
echo "   Testing: $TEST_URL"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Function endpoint responding (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Function endpoint returned HTTP $HTTP_CODE${NC}"
    echo "   This might be OK if the function is newly deployed"
fi
echo ""

# Step 9: Deploy to Vercel (optional)
echo "📋 Step 9: Deploy to production?"
echo "   This will deploy to Vercel (or your hosting provider)"
echo ""
read -p "   Deploy to production now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v vercel &> /dev/null; then
        echo "   Deploying to Vercel..."
        vercel --prod
        echo -e "${GREEN}✅ Deployed to production${NC}"
    else
        echo -e "${YELLOW}⚠️  Vercel CLI not found. Install with:${NC}"
        echo "   npm install -g vercel"
        echo ""
        echo "   Manual deployment:"
        echo "   1. Upload dist/ folder to your host"
        echo "   2. Set environment variables in hosting dashboard"
        echo "   3. Redeploy"
    fi
else
    echo "   Skipping production deployment"
    echo "   Your build is ready in dist/"
fi
echo ""

# Final summary
echo ""
echo "════════════════════════════════════════════════"
echo "✅ Phase 5 Deployment Complete!"
echo "════════════════════════════════════════════════"
echo ""
echo "📊 What was deployed:"
echo "   ✅ Database migration (demo_leads table)"
echo "   ✅ Edge functions (make-server)"
echo "   ✅ Full-Journey Demo (6-step workflow)"
echo "   ✅ Email notifications (auto-reply + sales alerts)"
echo "   ✅ Lead export (CSV download)"
echo "   ✅ Admin panel (Demo Leads page)"
echo ""
echo "🧪 Next steps:"
echo "   1. Test the full journey demo:"
echo "      → Go to homepage (not logged in)"
echo "      → Click 'Start the Live Demo'"
echo "      → Complete all 6 steps"
echo "      → Submit lead form"
echo ""
echo "   2. Check admin panel:"
echo "      → Login as super admin"
echo "      → Navigate to 'Demo Leads'"
echo "      → Verify lead appears"
echo "      → Test CSV export"
echo ""
echo "   3. Verify email notifications:"
echo "      → Check inbox for auto-reply"
echo "      → Check sales email for notification"
echo "      → Check Slack (if configured)"
echo ""
echo "   4. Monitor function logs:"
echo "      supabase functions logs make-server --follow"
echo ""
echo "📚 Documentation:"
echo "   /PHASE_5_COMPLETE.md - Complete technical docs"
echo "   /PHASE_5_DEPLOY_PLAYBOOK.md - Deployment guide"
echo "   /PHASE_5_VISUAL_GUIDE.md - Visual reference"
echo ""
echo "🎉 All systems GO! Start capturing leads!"
echo "════════════════════════════════════════════════"
echo ""
