#!/bin/bash
# 🚀 BuboIQ Backend Local Deployment Script
# This script will deploy your Supabase Edge Function from your local machine

set -e

echo "🦉 BuboIQ Backend Deployment"
echo "=============================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "🔑 Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "📝 You need to login to Supabase"
    echo "Run: supabase login"
    echo ""
    echo "After logging in, run this script again."
    exit 1
fi

echo "✅ Logged in to Supabase"
echo ""

# Project configuration
PROJECT_REF="xwcgpmqgqysxeovbrbxg"
FUNCTION_NAME="make-server-55e8c5b2"

echo "📦 Deploying function: $FUNCTION_NAME"
echo "🎯 Target project: $PROJECT_REF"
echo ""

# Deploy the function
echo "🚀 Deploying to Supabase..."
supabase functions deploy $FUNCTION_NAME --project-ref $PROJECT_REF --no-verify-jwt

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🧪 Testing the deployment..."
echo ""

# Test the health endpoint
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k"

echo "Testing health endpoint..."
curl -s -H "Authorization: Bearer $ANON_KEY" \
  https://$PROJECT_REF.supabase.co/functions/v1/$FUNCTION_NAME/health | jq .

echo ""
echo "Testing login endpoint..."
curl -s -X POST \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"kevinh@buboiq.com","password":"TestAccount123!"}' \
  https://$PROJECT_REF.supabase.co/functions/v1/$FUNCTION_NAME/auth/signin | jq .

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "🔗 Your API is now live at:"
echo "   https://$PROJECT_REF.supabase.co/functions/v1/$FUNCTION_NAME/"
echo ""
echo "📝 Next steps:"
echo "   1. Test the Super Admin login in your browser"
echo "   2. Go to: https://your-buboiq-app.com/super-admin"
echo "   3. Login with: kevinh@buboiq.com / TestAccount123!"
