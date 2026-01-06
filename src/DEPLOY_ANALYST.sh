#!/bin/bash

# BuboIQ Analyst v1 - Quick Deployment Script
# This script deploys the Analyst v1 system to production

set -e

echo "🚀 BuboIQ Analyst v1 - Production Deployment"
echo "=============================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Step 1: Apply database migration
echo "📊 Step 1: Applying database migration..."
supabase db push

echo "✅ Database migration applied"
echo ""

# Step 2: Deploy Edge Functions
echo "⚡ Step 2: Deploying Edge Functions..."

echo "   Deploying agent_runner..."
supabase functions deploy agent_runner

echo "   Deploying action_executor..."
supabase functions deploy action_executor

echo "   Deploying embed_kb..."
supabase functions deploy embed_kb

echo "✅ Edge Functions deployed"
echo ""

# Step 3: Set environment variables
echo "🔐 Step 3: Setting environment variables..."

# Check if OPENAI_API_KEY is already set
if supabase secrets list | grep -q "OPENAI_API_KEY"; then
    echo "✅ OPENAI_API_KEY already set"
else
    echo "⚠️  OPENAI_API_KEY not set"
    echo "   Please run: supabase secrets set OPENAI_API_KEY=sk-..."
    echo ""
fi

echo ""

# Step 4: Verify deployment
echo "🔍 Step 4: Verifying deployment..."

echo "   Checking functions..."
supabase functions list

echo ""
echo "   Checking secrets..."
supabase secrets list

echo ""

# Final instructions
echo "=============================================="
echo "✅ Deployment Complete!"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Set OpenAI API key (if not done):"
echo "   supabase secrets set OPENAI_API_KEY=sk-..."
echo ""
echo "2. Add Analyst Console to your app navigation:"
echo "   See: /components/app/pages/AnalystConsolePage.tsx"
echo ""
echo "3. Test the system:"
echo "   - Navigate to Analyst Console"
echo "   - Click 'Re-run reasoning now'"
echo "   - Wait 10-15 seconds"
echo "   - Refresh to see results"
echo ""
echo "📚 Documentation:"
echo "   - Full guide: /ANALYST_V1_DEPLOYMENT_GUIDE.md"
echo "   - Components: /components/analyst/README.md"
echo "   - Quick start: /ANALYST_QUICK_START.md"
echo ""
echo "🎉 Happy analyzing!"
