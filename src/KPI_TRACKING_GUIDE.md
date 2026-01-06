# 📊 KPI Tracking Guide - Phase 5 Full-Journey Demo

## Real-Time Monitoring (First 30 Minutes)

### Google Analytics Events

All events are automatically tracked via the existing GA integration in App.tsx:

```javascript
// Demo Started
gtag('event', 'full_journey_demo_started', {
  source: 'homepage',          // or 'features', 'how-it-works', etc.
  user_tier: 'anonymous'
});

// Step Completed (fires for each step)
gtag('event', 'demo_step_completed', {
  step: 1,                     // 1-6
  step_name: 'ticket_inception',
  time_on_step: 3000,          // milliseconds
  auto_advanced: true
});

// Action Approved (Step 3)
gtag('event', 'demo_action_approved', {
  action_type: 'update_ticket',
  step: 3
});

// KB Article Viewed (Step 5)
gtag('event', 'kb_article_viewed', {
  step: 5,
  duration: 6000,              // 6 seconds (longest step)
  article_copied: false
});

// Lead Captured (Step 6 → form submission)
gtag('event', 'lead_captured', {
  source: 'full_journey_demo',
  steps_completed: 6,
  time_in_demo: 45,            // seconds
  company: 'Acme Corp'
});
```

---

## Funnel Metrics Dashboard

### Expected Funnel (Day 1 Baseline)

```
100 visitors land on homepage
  ↓
15 click "Start the Live Demo" (15% CTR)
  ↓
12 reach Step 3 (80% of starters)
  ↓
10 reach Step 5 - KB shown (67% of starters)
  ↓
2 submit lead form (13% of starters)
```

### Target Completion Rates

| Metric | Target | Red Flag (Act!) |
|--------|--------|-----------------|
| Demo started → Step 3 | >70% | <50% |
| Demo started → Step 5 (KB shown) | >55% | <30% |
| Demo started → Lead submitted | 5-15% | <2% |
| Lead quality (HOT ≥80 score) | >40% | <20% |
| Email delivery rate | >95% | <85% |

---

## Google Analytics Setup

### 1. View Events in Real-Time

```
Google Analytics Dashboard
→ Reports
→ Realtime
→ Events

Look for:
- full_journey_demo_started
- demo_step_completed
- lead_captured
```

### 2. Create Custom Funnel Report

```
GA4 Dashboard
→ Explore
→ Funnel Exploration
→ Add steps:
  1. full_journey_demo_started
  2. demo_step_completed (step = 3)
  3. demo_step_completed (step = 5)
  4. lead_captured
```

### 3. Set Up Conversion Events

Mark these as key conversions in GA4:

```
GA4 Admin
→ Events
→ Mark as conversion:
  - full_journey_demo_started
  - lead_captured
```

---

## Database Queries (Real-Time Lead Metrics)

### Check Recent Leads

```sql
-- View last 10 leads with scores
SELECT 
  email,
  company,
  score,
  quality,
  source,
  created_at,
  engagement->>'steps_completed' as steps_completed,
  engagement->>'time_in_demo' as time_in_demo
FROM demo_leads
ORDER BY created_at DESC
LIMIT 10;
```

### Lead Quality Distribution

```sql
-- Count leads by quality tier
SELECT 
  quality,
  COUNT(*) as count,
  ROUND(AVG(score), 2) as avg_score
FROM demo_leads
GROUP BY quality
ORDER BY 
  CASE quality
    WHEN 'hot' THEN 1
    WHEN 'warm' THEN 2
    WHEN 'cold' THEN 3
  END;
```

### Lead Capture Rate by Source

```sql
-- Compare lead sources
SELECT 
  source,
  COUNT(*) as leads,
  ROUND(AVG(score), 2) as avg_score,
  ROUND(AVG((engagement->>'steps_completed')::int), 2) as avg_steps
FROM demo_leads
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY source
ORDER BY leads DESC;
```

### Time Series (Leads per Hour)

```sql
-- Leads captured by hour
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as leads,
  COUNT(CASE WHEN quality = 'hot' THEN 1 END) as hot_leads,
  ROUND(AVG(score), 2) as avg_score
FROM demo_leads
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```

---

## Email Performance (Resend Dashboard)

### 1. Check Delivery Rates

```
Resend Dashboard
→ https://resend.com/emails
→ Filter: Last 24 hours

Metrics:
- Total sent
- Delivered (should be >95%)
- Opened (target: 40-50% for auto-reply)
- Bounced (should be <2%)
- Failed (should be 0)
```

### 2. Track Click-Through

```
Email with links:
- Auto-reply: Calendar booking link
- Sales notification: Lead details link

Track CTR in Resend:
- Auto-reply CTR: 10-20% (calendar bookings)
- Sales notification CTR: 70-80% (team checks leads)
```

---

## Function Logs Monitoring

### Tail Logs (Real-Time)

```bash
# Watch live activity
supabase functions logs make-server --follow

# Expected output:
# ✅ Demo lead captured: john@acme.com
# ✅ Lead score calculated: 88 (HOT)
# ✅ Email sent successfully: msg_abc123
# ✅ Slack notification sent successfully
```

### Filter for Specific Events

```bash
# Only show lead captures
supabase functions logs make-server | grep "Demo lead captured"

# Only show errors
supabase functions logs make-server | grep "ERROR"

# Only show email events
supabase functions logs make-server | grep "Email sent"
```

### Error Rate Tracking

```bash
# Count errors in last 100 logs
supabase functions logs make-server --tail 100 | grep -c "ERROR"

# If >10 errors in 100 logs: RED FLAG - investigate
# If 5-10 errors: YELLOW FLAG - monitor
# If <5 errors: GREEN - normal operation
```

---

## Manual Smoke Tests (Every 2 Hours)

### Quick Health Check

```bash
# 1. Health endpoint
curl https://buboiq.com/api/health

# Expected: {"status":"ok"...}

# 2. Test lead submission
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/demo-leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"name":"Health Check","email":"healthcheck@buboiq.com","company":"Internal"}'

# Expected: {"success":true...}
```

### Full Demo Walk-Through

```
Every 2 hours, manually:
1. Go to homepage
2. Click "Start the Live Demo"
3. Let demo auto-advance through all 6 steps
4. Submit test lead form
5. Check email received
6. Verify lead in admin panel

Time: ~2 minutes
```

---

## Alert Thresholds

### Critical (Page Immediately)

```
❌ Health endpoint returns 500 for >2 minutes
❌ Lead submission fails >5 times in a row
❌ Email delivery rate <80% for >1 hour
❌ Demo completion rate <30% for >1 hour
```

### Warning (Check Within 30 Minutes)

```
⚠️  Health endpoint slow (>2s response)
⚠️  Lead capture rate <5% for >2 hours
⚠️  Email delivery rate 80-90%
⚠️  Demo completion rate 30-50%
```

### Info (Check End of Day)

```
ℹ️  Lead quality distribution changes >20%
ℹ️  Average time in demo changes >30%
ℹ️  Source mix shifts significantly
```

---

## Recommended Dashboard Setup

### Option 1: Google Sheets (Free)

Create a Google Sheet that pulls GA4 data via API:

```
Columns:
- Hour
- Demo Starts
- Step 3 Reached
- Step 5 Reached (KB shown)
- Leads Captured
- Conversion Rate (%)
- Avg Time in Demo (sec)
```

Update frequency: Every 15 minutes

### Option 2: Grafana + Postgres (Advanced)

```sql
-- Create view for Grafana
CREATE OR REPLACE VIEW demo_metrics AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as leads,
  AVG(score) as avg_score,
  AVG((engagement->>'steps_completed')::int) as avg_steps,
  AVG((engagement->>'time_in_demo')::int) as avg_time,
  COUNT(CASE WHEN quality = 'hot' THEN 1 END) as hot_leads
FROM demo_leads
GROUP BY hour;
```

Connect Grafana to Supabase Postgres and visualize.

---

## Daily Summary Report

### Automated Email (End of Day)

Send to team at 6 PM daily:

```
Subject: BuboIQ Demo Performance - [Date]

📊 Daily Summary:
- Demo starts: 45
- Completion rate: 67% (30 reached Step 6)
- Leads captured: 7
- Lead quality: 4 hot, 2 warm, 1 cold

📈 Trends:
- +15% demo starts vs yesterday
- +22% lead capture rate
- KB article copy rate: 40% (12/30)

⚠️  Alerts:
- None

✅ System Health:
- Uptime: 100%
- Avg response time: 1.2s
- Email delivery: 98%
```

---

## Weekly Review Metrics

Every Monday, review:

### Quantitative

```
1. Total demo starts (week over week)
2. Conversion funnel (demo → lead)
3. Lead quality distribution
4. Email engagement (open/click rates)
5. Average time in demo
6. KB article copy rate (Step 5)
```

### Qualitative

```
1. Common drop-off points (which step loses people)
2. Lead feedback (from sales calls)
3. Technical issues (function errors, slow loads)
4. Feature requests (from lead notes)
```

### Action Items

```
Based on data:
- Adjust auto-advance timing if drop-off high
- Optimize Step 5 (KB article) if low engagement
- Fix technical issues if error rate >2%
- A/B test variations if conversion <10%
```

---

## KPI Targets (30-Day Roadmap)

### Week 1: Baseline
```
- Measure everything
- Set realistic targets
- Identify issues
```

### Week 2: Optimization
```
- Fix drop-off points
- Improve email copy
- Adjust demo timing
- Target: 10% conversion
```

### Week 3: Scaling
```
- Drive more traffic
- Test new sources
- Expand to verticals
- Target: 15% conversion
```

### Week 4: Advanced
```
- A/B testing
- Personalization
- Multi-scenario demos
- Target: 20% conversion
```

---

## Exported Metrics (CSV)

### Daily Export for Team

```sql
-- Export last 24 hours for analysis
COPY (
  SELECT 
    email,
    company,
    score,
    quality,
    source,
    created_at,
    engagement
  FROM demo_leads
  WHERE created_at > NOW() - INTERVAL '24 hours'
  ORDER BY created_at DESC
) TO '/tmp/leads_daily.csv' WITH CSV HEADER;
```

Or use the admin panel "Export CSV" button (already implemented).

---

## Success Criteria (Go/No-Go for Scaling)

### Green Light (Scale Up Marketing)

```
✅ Demo completion rate >60% for 7 days
✅ Lead capture rate >10% for 7 days
✅ Email delivery rate >95% consistently
✅ No P0 incidents for 7 days
✅ Hot lead rate >35%
```

### Yellow Light (Optimize First)

```
⚠️  Demo completion rate 40-60%
⚠️  Lead capture rate 5-10%
⚠️  Email delivery rate 90-95%
⚠️  1-2 P1 incidents per week
```

### Red Light (Fix Before Scaling)

```
❌ Demo completion rate <40%
❌ Lead capture rate <5%
❌ Email delivery rate <90%
❌ Multiple P0 incidents
❌ Cold lead rate >50%
```

---

Last updated: October 22, 2025  
Phase: 5 - Full-Journey Demo Experience  
Monitoring: Real-time + Daily + Weekly cadence
