#!/bin/bash

# 🚀 BuboIQ Local Development Starter
# Run this script to start developing locally

set -e

echo "🦉 BuboIQ Local Development Setup"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

echo ""
echo "📋 Pre-flight Checklist:"
echo "========================"

# Check Supabase CLI
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✓ Supabase CLI installed${NC}"
else
    echo -e "${YELLOW}⚠ Supabase CLI not found${NC}"
    echo "  Install: npm install -g supabase"
    echo "  Or use Supabase Dashboard manually"
fi

echo ""
echo "🔧 Next Steps:"
echo "============="
echo ""
echo "1️⃣  Deploy database schema (if not done):"
echo "    ${YELLOW}supabase db push${NC}"
echo ""
echo "2️⃣  Deploy Edge Functions (if not done):"
echo "    ${YELLOW}supabase functions deploy make-server${NC}"
echo ""
echo "3️⃣  Create super admin account:"
echo "    a) Open http://localhost:5173 (after step 4)"
echo "    b) Sign up with: admin@buboiq.dev / BuboIQ2024!Admin"
echo "    c) Run SQL in Supabase Dashboard:"
echo "       ${YELLOW}UPDATE users SET role = 'super_admin' WHERE email = 'admin@buboiq.dev';${NC}"
echo ""
echo "4️⃣  Start dev server:"
echo "    ${YELLOW}npm run dev${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Quick Start (if already setup):"
echo ""
echo -e "${GREEN}npm run dev${NC}"
echo ""
echo "Then open: ${GREEN}http://localhost:5173${NC}"
echo "Login with: ${GREEN}admin@buboiq.dev / BuboIQ2024!Admin${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ask if user wants to start now
read -p "Start dev server now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting dev server..."
    echo ""
    npm run dev
else
    echo ""
    echo "Run ${GREEN}npm run dev${NC} when ready!"
    echo ""
fi
