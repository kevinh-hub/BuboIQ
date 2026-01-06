#!/bin/bash
# 🚀 BuboIQ One-Command Production Deployment
# Run this single script to deploy everything

echo "🦉 BuboIQ Production Deployment Starting..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Setup Prerequisites
echo -e "${BLUE}📋 Step 1: Installing Prerequisites...${NC}"

if ! command_exists git; then
    echo -e "${RED}❌ Git not found. Please install Git first.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

# Install Supabase CLI if not present
if ! command_exists supabase; then
    echo -e "${YELLOW}📦 Installing Supabase CLI...${NC}"
    npm install -g supabase
fi

# Install Vercel CLI if not present
if ! command_exists vercel; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✅ Prerequisites ready${NC}"

# Step 2: Git Setup
echo -e "${BLUE}📂 Step 2: Setting up Git repository...${NC}"

if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "🚀 BuboIQ Production Launch - Enterprise SaaS Platform"
    git branch -M main
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${YELLOW}⚠️ Git repository already exists${NC}"
fi

# Step 3: GitHub Repository Creation Prompt
echo -e "${BLUE}📋 Step 3: GitHub Repository Setup${NC}"
echo -e "${YELLOW}Please create a GitHub repository:${NC}"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: buboiq"
echo "3. Click 'Create repository'"
echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ GitHub username required${NC}"
    exit 1
fi

# Add remote and push
git remote add origin https://github.com/$GITHUB_USERNAME/buboiq.git
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub. Please check your repository URL.${NC}"
    exit 1
fi

# Step 4: Database Schema Deployment
echo -e "${BLUE}🗄️ Step 4: Database Schema Deployment${NC}"
echo -e "${YELLOW}Opening Supabase SQL Editor...${NC}"
echo "URL: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg/sql/new"
echo ""
echo -e "${YELLOW}Copy the ENTIRE contents of DEPLOY_SCHEMA.sql and paste into the SQL Editor, then click 'Run'${NC}"
echo ""
read -p "Press ENTER after you've deployed the database schema..."

# Step 5: Vercel Deployment
echo -e "${BLUE}🚀 Step 5: Deploying to Vercel...${NC}"

# Login to Vercel
echo -e "${YELLOW}Logging into Vercel...${NC}"
vercel login

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod \
  -e SUPABASE_URL=https://xwcgpmqgqysxeovbrbxg.supabase.co \
  -e SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k \
  -e SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA4MzUyNSwiZXhwIjoyMDc0NjU5NTI1fQ.EQ6SclTPgf1FgZfUU7xk5hqzrRHpX3a2QFRqhu-2Zk8

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully deployed to Vercel${NC}"
    VERCEL_URL=$(vercel ls | grep buboiq | head -1 | awk '{print $2}')
    echo -e "${GREEN}🌐 Your app is live at: https://$VERCEL_URL${NC}"
else
    echo -e "${RED}❌ Vercel deployment failed${NC}"
    exit 1
fi

# Step 6: Edge Functions Deployment
echo -e "${BLUE}🔧 Step 6: Deploying Edge Functions...${NC}"

# Login to Supabase
echo -e "${YELLOW}Logging into Supabase...${NC}"
supabase login

# Deploy edge function
echo -e "${YELLOW}Deploying edge functions...${NC}"
supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Edge functions deployed${NC}"
else
    echo -e "${RED}❌ Edge function deployment failed${NC}"
    exit 1
fi

# Step 7: Test API
echo -e "${BLUE}🧪 Step 7: Testing API...${NC}"
API_RESPONSE=$(curl -s https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/init)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ API is responding${NC}"
else
    echo -e "${RED}❌ API test failed${NC}"
fi

# Step 8: Super Admin Setup Instructions
echo -e "${BLUE}👑 Step 8: Super Admin Setup${NC}"
echo -e "${YELLOW}Now complete the super admin setup:${NC}"
echo ""
echo "1. Visit your app: https://$VERCEL_URL"
echo "2. Sign up with:"
echo "   Email: admin@buboiq.dev"
echo "   Password: BuboIQ2024!Admin"
echo ""
echo "3. Then run this SQL in Supabase SQL Editor:"
echo "   SELECT id FROM auth.users WHERE email = 'admin@buboiq.dev';"
echo ""
echo "4. Copy the UUID and run the super admin creation SQL from CREATE_SUPER_ADMIN.sql"
echo ""

# Step 9: Production Summary
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo ""
echo -e "${GREEN}📋 Production Summary:${NC}"
echo -e "${GREEN}🌐 App URL: https://$VERCEL_URL${NC}"
echo -e "${GREEN}🔧 API URL: https://xwcgpmqgqysxeovbrbxg.supabase.co/functions/v1/make-server-55e8c5b2/${NC}"
echo -e "${GREEN}🗄️ Database: https://supabase.com/dashboard/project/xwcgpmqgqysxeovbrbxg${NC}"
echo ""
echo -e "${GREEN}👑 Super Admin Credentials:${NC}"
echo -e "${GREEN}📧 Email: admin@buboiq.dev${NC}"
echo -e "${GREEN}🔐 Password: BuboIQ2024!Admin${NC}"
echo ""
echo -e "${GREEN}🏆 Your BuboIQ platform is now LIVE!${NC}"
echo ""
echo -e "${YELLOW}⚠️ Remember to:${NC}"
echo "1. Complete super admin setup as shown above"
echo "2. Change super admin password after first login"
echo "3. Test all features work correctly"
echo ""
echo -e "${GREEN}🎉 Welcome to production! You've built something exceptional! 🚀${NC}"