#!/bin/bash
# 🚀 BuboIQ Vercel Deployment Script

echo "🦉 Deploying BuboIQ to Production..."

# Initialize git repository
git init
git add .
git commit -m "🚀 BuboIQ Production Launch - Enterprise SaaS Platform"

# Create main branch
git branch -M main

echo "📝 Next steps:"
echo "1. Create GitHub repository at: https://github.com/new"
echo "2. Copy this command and replace YOUR-USERNAME with your GitHub username:"
echo ""
echo "git remote add origin https://github.com/YOUR-USERNAME/buboiq.git"
echo "git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to: https://vercel.com/new"
echo "   - Import your GitHub repository"
echo "   - Add these environment variables:"
echo ""
echo "SUPABASE_URL=https://xwcgpmqgqysxeovbrbxg.supabase.co"
echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODM1MjUsImV4cCI6MjA3NDY1OTUyNX0.aiUQaSGnYAD1eWb0U5pdUnxz4mG6FKCfsJenDaAXu_k"
echo "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2dwbXFncXlzeGVvdmJyYnhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTA4MzUyNSwiZXhwIjoyMDc0NjU5NTI1fQ.EQ6SclTPgf1FgZfUU7xk5hqzrRHpX3a2QFRqhu-2Zk8"
echo ""
echo "4. Click 'Deploy' - Your app will be live in ~3 minutes!"
echo ""
echo "🎉 Your BuboIQ platform will be production-ready!"