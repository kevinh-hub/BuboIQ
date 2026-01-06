#!/bin/bash
# 🦉 BuboIQ - SIMPLEST DEPLOYMENT METHOD
# All files already exist in Figma Make - just copy and deploy!

set -e

echo "🦉 BuboIQ Backend Deployment"
echo "=============================="
echo ""

# Step 1: Create directory structure
echo "📁 Creating directory structure..."
mkdir -p ~/BuboIQ-Deploy/supabase/functions
cd ~/BuboIQ-Deploy/supabase/functions

# Step 2: Copy all files from Figma Make
echo "📋 Copying all 17 backend files from Figma Make..."
cp -r /supabase/functions/make-server-55e8c5b2 ./

# Verify files were copied
FILE_COUNT=$(ls -1 make-server-55e8c5b2 | wc -l)
echo "✅ Copied $FILE_COUNT files"
echo ""

# List what was copied
echo "📄 Files in deployment package:"
ls -lh make-server-55e8c5b2/
echo ""

# Step 3: Deploy instructions
echo "=============================="
echo "🚀 READY TO DEPLOY!"
echo "=============================="
echo ""
echo "Run these commands to deploy:"
echo ""
echo "  cd ~/BuboIQ-Deploy"
echo "  supabase login"
echo "  supabase functions deploy make-server-55e8c5b2 \\"
echo "    --project-ref xwcgpmqgqysxeovbrbxg --no-verify-jwt"
echo ""
echo "=============================="
echo ""
echo "Or run this command to deploy NOW:"
echo ""
echo "  bash -c 'cd ~/BuboIQ-Deploy && supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg --no-verify-jwt'"
echo ""
