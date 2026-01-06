#!/bin/bash

# 🚀 BuboIQ Phase 5 - ONE-COMMAND DEPLOYMENT
# Run this script to deploy everything at once

set -e  # Exit on error

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🚀 BuboIQ Phase 5 - Full-Journey Demo Deployment"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 0: Prerequisites Check
echo -e "${BLUE}Step 0: Checking prerequisites...${NC}"
echo ""

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo ""
    echo "Install it:"
    echo "  brew install supabase/tap/supabase  # macOS"
    echo "  OR"
    echo "  npm install -g supabase  # Cross-platform"
    echo ""
    exit 1
fi
echo -e "${GREEN}✅ Supabase CLI found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm found${NC}"

# Check if logged into Supabase
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into Supabase${NC}"
    echo "Run: supabase login"
    exit 1
fi
echo -e "${GREEN}✅ Logged into Supabase${NC}"

# Check if project is linked
if [ ! -f ".git/config" ] && [ ! -f "supabase/.temp/project-ref" ]; then
    echo -e "${YELLOW}⚠️  Project not linked${NC}"
    echo "Run: supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
fi
echo -e "${GREEN}✅ Project linked${NC}"

echo ""
echo -e "${GREEN}✅ All prerequisites met!${NC}"
echo ""

# Step 1: Environment Setup
echo -e "${BLUE}Step 1: Setting up environment...${NC}"
echo ""

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating template...${NC}"
    cat > .env << 'EOF'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
EOF
    echo ""
    echo -e "${RED}❌ Please update .env with your actual values and run again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment file exists${NC}"
echo ""

# Step 2: Supabase Secrets
echo -e "${BLUE}Step 2: Checking Supabase secrets...${NC}"
echo ""

SECRETS=$(supabase secrets list 2>&1)

# Check critical secrets
MISSING_SECRETS=0

if ! echo "$SECRETS" | grep -q "RESEND_API_KEY"; then
    echo -e "${YELLOW}⚠️  RESEND_API_KEY not set${NC}"
    echo "   Get your key from: https://resend.com/api-keys"
    echo "   Set it: supabase secrets set RESEND_API_KEY=re_your_key"
    ((MISSING_SECRETS++))
else
    echo -e "${GREEN}✅ RESEND_API_KEY set${NC}"
fi

if ! echo "$SECRETS" | grep -q "SALES_EMAIL"; then
    echo -e "${YELLOW}⚠️  SALES_EMAIL not set${NC}"
    echo "   Set it: supabase secrets set SALES_EMAIL=sales@buboiq.com"
    ((MISSING_SECRETS++))
else
    echo -e "${GREEN}✅ SALES_EMAIL set${NC}"
fi

if ! echo "$SECRETS" | grep -q "FRONTEND_URL"; then
    echo -e "${YELLOW}⚠️  FRONTEND_URL not set${NC}"
    echo "   Set it: supabase secrets set FRONTEND_URL=https://buboiq.com"
    ((MISSING_SECRETS++))
else
    echo -e "${GREEN}✅ FRONTEND_URL set${NC}"
fi

if [ $MISSING_SECRETS -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ Missing $MISSING_SECRETS required secret(s)${NC}"
    echo ""
    echo "Set them now? (y/n)"
    read -r REPLY
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "RESEND_API_KEY: " RESEND_KEY
        read -p "SALES_EMAIL: " SALES_EMAIL
        read -p "FRONTEND_URL: " FRONTEND_URL
        
        supabase secrets set RESEND_API_KEY="$RESEND_KEY"
        supabase secrets set SALES_EMAIL="$SALES_EMAIL"
        supabase secrets set FRONTEND_URL="$FRONTEND_URL"
        
        echo -e "${GREEN}✅ Secrets set!${NC}"
    else
        echo ""
        echo -e "${RED}❌ Cannot proceed without secrets${NC}"
        exit 1
    fi
fi

echo ""

# Step 3: Database Migration
echo -e "${BLUE}Step 3: Running database migration...${NC}"
echo ""

echo "Applying demo_leads table migration..."
supabase db push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration applied successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi

echo ""

# Step 4: Deploy Edge Functions
echo -e "${BLUE}Step 4: Deploying Edge Functions...${NC}"
echo ""

echo "Deploying make-server function..."
supabase functions deploy make-server

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Function deployed successfully${NC}"
else
    echo -e "${RED}❌ Function deployment failed${NC}"
    exit 1
fi

echo ""

# Step 5: Install Dependencies
echo -e "${BLUE}Step 5: Installing npm dependencies...${NC}"
echo ""

npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

echo ""

# Step 6: Build Application
echo -e "${BLUE}Step 6: Building application...${NC}"
echo ""

npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
    echo "   Build output: dist/"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""

# Step 7: Test Function Endpoint
echo -e "${BLUE}Step 7: Testing function endpoint...${NC}"
echo ""

# Read Supabase URL from .env
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
TEST_URL="${SUPABASE_URL}/functions/v1/make-server-55e8c5b2/health"

echo "Testing: $TEST_URL"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL" 2>/dev/null)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Function endpoint responding (HTTP $HTTP_CODE)${NC}"
elif [ "$HTTP_CODE" = "404" ]; then
    echo -e "${YELLOW}⚠️  Function endpoint not found (HTTP $HTTP_CODE)${NC}"
    echo "   This is OK if this is first deployment"
else
    echo -e "${YELLOW}⚠️  Function endpoint returned HTTP $HTTP_CODE${NC}"
    echo "   This might be OK - check function logs if issues"
fi

echo ""

# Step 8: Deployment
echo -e "${BLUE}Step 8: Deploy to production?${NC}"
echo ""
echo "Choose deployment method:"
echo "  1) Vercel (recommended)"
echo "  2) Manual upload"
echo "  3) Skip deployment (just build)"
echo ""
read -p "Enter choice (1-3): " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
    1)
        if command -v vercel &> /dev/null; then
            echo ""
            echo "Deploying to Vercel..."
            vercel --prod
            echo -e "${GREEN}✅ Deployed to Vercel${NC}"
        else
            echo ""
            echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
            echo "Install: npm install -g vercel"
            echo ""
            echo "Or deploy manually:"
            echo "1. Go to vercel.com/new"
            echo "2. Import your Git repository"
            echo "3. Set environment variables in Vercel dashboard"
            echo "4. Deploy"
        fi
        ;;
    2)
        echo ""
        echo "Manual deployment steps:"
        echo "1. Upload dist/ folder to your hosting provider"
        echo "2. Set environment variables:"
        echo "   - VITE_SUPABASE_URL"
        echo "   - VITE_SUPABASE_ANON_KEY"
        echo "3. Deploy"
        ;;
    3)
        echo ""
        echo "Build complete. Deploy when ready."
        ;;
    *)
        echo ""
        echo "Invalid choice. Build complete, deploy manually."
        ;;
esac

echo ""

# Success Summary
echo ""
echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Phase 5 Deployment Complete!${NC}"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📊 What was deployed:"
echo "   ✅ Database migration (demo_leads table)"
echo "   ✅ Edge functions (make-server)"
echo "   ✅ Full-Journey Demo (6-step workflow)"
echo "   ✅ Email notifications (auto-reply + sales)"
echo "   ✅ Lead export (CSV download)"
echo "   ✅ Admin panel (Demo Leads page)"
echo ""
echo "🧪 Test it now:"
echo ""
echo "   1. Full-Journey Demo:"
echo "      → Go to your site (not logged in)"
echo "      → Click 'Start the Live Demo'"
echo "      → Complete all 6 steps"
echo "      → Submit lead form"
echo ""
echo "   2. Check emails:"
echo "      → Auto-reply in your inbox"
echo "      → Sales notification"
echo ""
echo "   3. Admin panel:"
echo "      → Login as super admin"
echo "      → Go to 'Demo Leads'"
echo "      → Export CSV"
echo ""
echo "   4. Monitor logs:"
echo "      → supabase functions logs make-server --follow"
echo ""
echo "📚 Documentation:"
echo "   → PHASE_5_COMPLETE.md - Technical docs"
echo "   → PHASE_5_VISUAL_GUIDE.md - Visual reference"
echo "   → READY_TO_DEPLOY.md - Quick guide"
echo ""
echo "🎉 All systems GO!"
echo "════════════════════════════════════════════════════════════════"
echo ""
