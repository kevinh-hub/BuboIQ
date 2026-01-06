# 🎯 Live Demo System - Quick Reference Card

## ⚡ 30-Second Overview

**What**: Interactive demo → Lead capture → Admin dashboard  
**Where**: HomePage → "Start the Live Demo" button  
**Tech**: React + Supabase + PostgreSQL  
**Status**: ✅ Production Ready

---

## 📁 Key Files

| File | Purpose | Location |
|------|---------|----------|
| `DemoOrchestrator.tsx` | Main controller | `/components/demo/` |
| `LiveDemoConsole.tsx` | Demo interface | `/components/demo/` |
| `LeadCaptureModal.tsx` | Conversion form | `/components/demo/` |
| `DemoLeadsPanel.tsx` | Admin dashboard | `/components/admin/` |
| `demo-leads.ts` | Backend API | `/supabase/functions/make-server/` |
| `20251023_demo_leads.sql` | Database schema | `/supabase/migrations/` |

---

## 🔄 User Flow (10 Steps)

1. **Land** → HomePage
2. **Click** → "Start the Live Demo"
3. **Read** → Demo Launcher (sandbox info)
4. **Click** → "Start Demo"
5. **Wait** → 1.5s loading
6. **Explore** → Console (traces, actions, jobs)
7. **Approve** → Action button
8. **Fill** → Lead form (name, email, company)
9. **Submit** → Backend saves + scores
10. **View** → Admin sees lead

---

## 🎯 Lead Scoring (Quick)

**Formula**: Base (50) + Actions (10 ea) + Time (5/min) + Features (5 ea) = 50-100

**Examples**:
- **Hot (85+)**: 3 actions + 4 min + 3 features = 95
- **Warm (60-79)**: 1 action + 2 min + 2 features = 75
- **Cold (<60)**: 0 actions + 0 min + 0 features = 50

---

## 🔌 API Endpoints

### POST /demo-leads
**Purpose**: Capture lead (public)  
**Body**: `{ name, email, company, source, demo_engagement }`  
**Response**: `{ success, lead_id }`

### GET /demo-leads
**Purpose**: List leads (admin only)  
**Query**: `?status=new&quality=hot&limit=100`  
**Response**: `{ leads[], stats{} }`

### PATCH /demo-leads/:id
**Purpose**: Update status (admin only)  
**Body**: `{ status: 'contacted', notes: '...' }`  
**Response**: `{ success, lead }`

---

## 🗄️ Database

### Table: demo_leads

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | TEXT | Required |
| email | TEXT | Required, validated |
| company | TEXT | Required |
| status | TEXT | new/contacted/qualified/converted |
| lead_quality | TEXT | hot/warm/cold |
| lead_score | INT | 0-100 |
| demo_engagement | JSONB | Actions, time, features |
| created_at | TIMESTAMP | Auto |

---

## 🎨 Components

### Imported from Analyst Library
- `ConfidenceOrb` - Score visualization
- `ActionItem` - Approve/reject buttons
- `ReasoningTraceCard` - AI output display
- `KillSwitchBanner` - Observe-only warning

### Custom for Demo
- `DemoOrchestrator` - Flow controller
- `DemoLauncher` - Interstitial
- `LiveDemoConsole` - Main interface
- `LeadCaptureModal` - Conversion form
- `DemoLeadsPanel` - Admin dashboard

---

## 📊 Analytics Events

| Event | When | Properties |
|-------|------|-----------|
| `live_demo_started` | Click CTA | source, user_tier |
| `demo_started` | Start demo | demo_type, source |
| `demo_action_approved` | Approve action | action_type, confidence |
| `lead_captured` | Submit form | lead_source, company |
| `demo_closed` | Exit demo | lead_captured |

---

## ⚙️ Environment Variables

```env
# Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🚀 Deploy (3 Commands)

```bash
# 1. Database
supabase db push

# 2. Backend
supabase functions deploy make-server

# 3. Frontend
vercel --prod
```

---

## ✅ Test Checklist (5 Min)

- [ ] Click "Start the Live Demo"
- [ ] Demo Launcher opens
- [ ] Click "Start Demo"
- [ ] Console loads with data
- [ ] Click "Approve" on action
- [ ] Toast shows "Ticket updated"
- [ ] Lead modal appears (1.5s)
- [ ] Fill form and submit
- [ ] Success screen shows
- [ ] Admin panel shows lead

---

## 🐛 Quick Debug

### Issue: Demo won't open
**Fix**: Check `showLiveDemo` state in `App.tsx`

### Issue: No leads in admin
**Fix**: Verify user.role === 'super_admin'

### Issue: API errors
**Fix**: Check Supabase logs, verify env vars

### Issue: Form won't submit
**Fix**: Check browser console, network tab

---

## 📈 Success Metrics

| Metric | Week 1 | Month 1 |
|--------|--------|---------|
| Demo starts | 100+ | 500+ |
| Completions | 40+ | 300+ |
| Lead captures | 15+ | 75+ |
| Hot leads | 5+ | 20+ |

---

## 🔗 Documentation

| Doc | What | When |
|-----|------|------|
| `DEMO_HANDOFF.md` | Technical details | Development |
| `PHASE_3_COMPLETE.md` | Backend guide | Deployment |
| `INTEGRATION_GUIDE.md` | Setup steps | Setup |
| `QUICK_START.md` | Quick start | First time |
| `VERIFY_INTEGRATION.md` | Testing | QA |

---

## 💡 Tips

### For Sales
- Hot leads = respond within 24h
- Warm leads = follow up within 48h
- Cold leads = nurture campaign

### For Marketing
- Primary CTA: "Start the Live Demo"
- Test hero copy variations
- Monitor GA4 funnel

### For Engineering
- Check Supabase logs daily
- Monitor API response times
- Update lead scoring based on data

---

## 🎯 Quick Links

- **Admin Dashboard**: `/admin/demo-leads`
- **Backend Logs**: Supabase Dashboard → Functions → make-server
- **Database**: Supabase Dashboard → Table Editor → demo_leads
- **Analytics**: Google Analytics → Events → demo_*

---

**Status**: ✅ Production Ready  
**Risk**: Low  
**Maintenance**: Minimal  
**ROI**: High  

🚀 **Ready to convert visitors into customers!**
