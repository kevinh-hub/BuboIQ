#!/bin/bash
# 🔧 BuboIQ Edge Functions Deployment

echo "🔧 Deploying BuboIQ Edge Functions..."

# Install Supabase CLI if not already installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Login to Supabase
echo "🔑 Login to Supabase (if not already logged in):"
echo "Run: supabase login"
echo ""

# Deploy the main server function
echo "🚀 Deploy edge function:"
echo "supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg"
echo ""

# Verify deployment
echo "✅ Test your API:"
echo "curl https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/init"
echo ""

echo "🎯 Your API will be available at:"
echo "https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/"

# Manual deployment commands
echo ""
echo "📝 Manual Commands to Run:"
echo "1. supabase login"
echo "2. supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg"
echo "3. Test: curl https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/init"