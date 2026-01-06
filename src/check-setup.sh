#!/bin/bash

# 🔍 BuboIQ Setup Status Checker
# Verifies what's deployed and what needs setup

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔍 BuboIQ Setup Status Check"
echo "============================"
echo ""

# 1. Check Node.js
echo -n "📦 Node.js: "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Installed ($NODE_VERSION)${NC}"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "   Install from: https://nodejs.org"
fi

# 2. Check npm
echo -n "📦 npm: "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ Installed ($NPM_VERSION)${NC}"
else
    echo -e "${RED}✗ Not found${NC}"
fi

# 3. Check node_modules
echo -n "📦 Dependencies: "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Not installed${NC}"
    echo "   Run: npm install"
fi

# 4. Check Supabase CLI
echo -n "🔧 Supabase CLI: "
if command -v supabase &> /dev/null; then
    SUPABASE_VERSION=$(supabase --version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ Installed ($SUPABASE_VERSION)${NC}"
else
    echo -e "${YELLOW}⚠ Not found${NC}"
    echo "   Install: npm install -g supabase"
    echo "   Or use Supabase Dashboard manually"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 5. Check Supabase Configuration
echo "🔐 Supabase Configuration:"
echo ""
if [ -f "utils/supabase/info.tsx" ]; then
    PROJECT_ID=$(grep "projectId" utils/supabase/info.tsx | cut -d'"' -f2)
    echo -e "   Project ID: ${GREEN}$PROJECT_ID${NC}"
    echo -e "   Config File: ${GREEN}✓ Found${NC}"
    echo ""
    echo "   🌐 Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_ID"
else
    echo -e "   ${RED}✗ Configuration not found${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 6. Super Admin Credentials
echo "🔑 Super Admin Credentials:"
echo ""
echo "   Email:    admin@buboiq.dev"
echo "   Password: BuboIQ2024!Admin"
echo ""
echo "   ⚠️  Change password after first login!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 7. What needs to be done
echo "📋 Setup Checklist:"
echo ""

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo -e "   ${YELLOW}☐${NC} Install dependencies: ${BLUE}npm install${NC}"
else
    echo -e "   ${GREEN}✓${NC} Dependencies installed"
fi

# Prompt about database
echo -e "   ${YELLOW}?${NC} Database schema deployed? ${BLUE}supabase db push${NC}"
echo "      (Check in Supabase Dashboard if tables exist)"

# Prompt about functions
echo -e "   ${YELLOW}?${NC} Edge Functions deployed? ${BLUE}supabase functions deploy make-server${NC}"
echo "      (Check in Supabase Dashboard under Functions)"

# Prompt about super admin
echo -e "   ${YELLOW}?${NC} Super Admin created?"
echo "      a) Sign up with credentials above"
echo "      b) Run SQL: UPDATE users SET role = 'super_admin' WHERE email = 'admin@buboiq.dev';"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 8. Quick commands
echo "🚀 Quick Commands:"
echo ""
echo "   Start dev server:"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo "   Deploy database:"
echo -e "   ${GREEN}supabase db push${NC}"
echo ""
echo "   Deploy functions:"
echo -e "   ${GREEN}supabase functions deploy make-server${NC}"
echo ""
echo "   Build for production:"
echo -e "   ${GREEN}npm run build${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 9. Documentation
echo "📚 Documentation:"
echo ""
echo "   • /LOCAL_DEVELOPMENT_QUICKSTART.md - Full setup guide"
echo "   • /SUPER_ADMIN_CREDENTIALS.md - Credential details"
echo "   • /SUPER_ADMIN_QUICK_CARD.md - Quick reference"
echo "   • /EARLY_ACCESS_QUICK_START.md - Early Access setup"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
echo "🎯 Summary:"
echo ""
if [ -d "node_modules" ]; then
    echo -e "   ${GREEN}✓ Ready to run locally!${NC}"
    echo ""
    echo "   Just run: ${GREEN}npm run dev${NC}"
    echo "   Then open: http://localhost:5173"
else
    echo -e "   ${YELLOW}⚠ Run 'npm install' first${NC}"
fi
echo ""
