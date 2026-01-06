# BuboIQ Analyst v1 - Quick Reference Card

## 🚀 One-Command Deploy
```bash
chmod +x DEPLOY_ANALYST.sh && ./DEPLOY_ANALYST.sh
```

## 📦 Component Imports
```tsx
import {
  ConfidenceOrb,
  TierGuardBanner,
  ReasoningTraceCard,
  ActionItem,
  KillSwitchBanner,
  InlineDiff
} from '@/components/analyst/production';
```

## 🎨 Color Classes
```tsx
bg-bg-950       // #050607 (darkest)
bg-bg-900       // #0A0B0D (dark)
bg-bg-850       // #0E1014 (medium)

text-text-100   // #EAEFF5 (brightest)
text-text-300   // #C7D0DA (bright)
text-text-400   // #AAB4C0 (medium)
text-text-600   // #7A8694 (dim)

text-accent     // #00FF85 (neon green)
text-info       // #3EA0FF (blue)
text-warn       // #F6C14A (yellow)
text-danger     // #FF6B6B (red)
text-success    // #55D187 (green)
```

## 🔧 Utility Classes
```tsx
panel           // Glass panel with blur + border
focus-ring      // Accessible focus outline
```

## 📊 Database Tables
```sql
agent_traces     -- AI reasoning history
action_queue     -- Pending/approved actions
tier_policies    -- Org-level policies
kb_articles      -- Knowledge base
kb_embeddings    -- Vector embeddings
issues           -- Support tickets
signals          -- Device telemetry
device_jobs      -- Connect device actions
```

## ⚡ Edge Functions
```
agent_runner      -- AI reasoning engine
action_executor   -- Action execution
embed_kb          -- KB embeddings
```

## 🔐 Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
OPENAI_API_KEY=sk-... (secrets only)
```

## 📱 API Routes (Create These)
```
/api/agent/run          → agent_runner function
/api/actions/approve    → action_executor (approve)
/api/actions/reject     → action_executor (reject)
/api/policy/get         → tier_policies table
```

## 🧪 Test SQL
```sql
-- Create test issue
INSERT INTO issues (org_id, title, description, priority)
VALUES ('your-org-uuid', 'Test issue', 'Description', 'high');

-- Run agent
SELECT * FROM agent_traces ORDER BY created_at DESC LIMIT 5;

-- Check actions
SELECT * FROM action_queue WHERE status = 'queued';
```

## 📚 Docs
- Full deployment: `/ANALYST_V1_DEPLOYMENT_GUIDE.md`
- Integration summary: `/ANALYST_INTEGRATION_SUMMARY.md`
- Component guide: `/components/analyst/README.md`
- Quick start: `/ANALYST_QUICK_START.md`

## ✅ Pre-Flight Checklist
- [ ] Run `./DEPLOY_ANALYST.sh`
- [ ] Set `OPENAI_API_KEY` secret
- [ ] Create 4 API routes
- [ ] Add to AppRouter
- [ ] Add navigation item
- [ ] Test with sample data

## 🎯 Common Commands
```bash
# Deploy functions
supabase functions deploy agent_runner
supabase functions deploy action_executor
supabase functions deploy embed_kb

# Set secrets
supabase secrets set OPENAI_API_KEY=sk-...

# View logs
supabase functions logs agent_runner

# Apply migration
supabase db push

# List functions
supabase functions list

# Check secrets
supabase secrets list
```

---
**Ready to deploy? Run `./DEPLOY_ANALYST.sh`** 🚀
