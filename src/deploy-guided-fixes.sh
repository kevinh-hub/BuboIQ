#!/bin/bash

# Guided Fixes Backend Deployment Script
# Deploys database schema and server functions for Guided Fixes

set -e

echo "🦉 BuboIQ Guided Fixes Backend Deployment"
echo "=========================================="
echo ""

# Check for Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if linked to project
if [ ! -f ".supabase/config.toml" ]; then
    echo "❌ Not linked to Supabase project"
    echo "   Run: supabase link --project-ref YOUR_PROJECT_ID"
    exit 1
fi

echo "✅ Linked to Supabase project"
echo ""

echo "📊 Step 1: Applying database migration..."
echo "   Migration: 20251028_guided_fixes.sql"
echo ""

# Apply migration
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Database migration applied successfully"
else
    echo "❌ Migration failed"
    exit 1
fi

echo ""
echo "🚀 Step 2: Deploying server functions..."
echo ""

# Deploy make-server function (includes guided-fixes routes)
supabase functions deploy make-server

if [ $? -eq 0 ]; then
    echo "✅ Server function deployed successfully"
else
    echo "❌ Function deployment failed"
    exit 1
fi

echo ""
echo "🎉 Guided Fixes Backend Deployment Complete!"
echo ""
echo "📝 What was deployed:"
echo "   ✅ 3 database tables (guided_fixes, guided_fix_executions, guided_fix_step_executions)"
echo "   ✅ Row Level Security policies"
echo "   ✅ 5 seeded global Guided Fixes"
echo "   ✅ REST API endpoints (/guided-fixes/*)"
echo "   ✅ WebSocket streaming support"
echo ""
echo "🧪 Test the deployment:"
echo "   1. List fixes:"
echo "      curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/guided-fixes \\"
echo "           -H 'Authorization: Bearer YOUR_ANON_KEY'"
echo ""
echo "   2. In the app, navigate to any page that uses Guided Fixes"
echo "   3. Check browser console for any errors"
echo ""
echo "📚 Documentation:"
echo "   - Backend: /GUIDED_FIXES_BACKEND_COMPLETE.md"
echo "   - Frontend: /components/guided-fixes/GUIDED_FIXES_HANDOFF.md"
echo "   - Overall: /GUIDED_FIXES_IMPLEMENTATION_COMPLETE.md"
echo ""
echo "🎯 Next steps:"
echo "   1. Test execution in the UI"
echo "   2. Verify WebSocket streaming works"
echo "   3. Check KB draft creation"
echo "   4. Replace mock execution with real Agent/Connect APIs"
echo ""
