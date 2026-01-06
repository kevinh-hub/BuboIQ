# 🔗 Phase 3 Integration Guide

## Quick Setup (5 Minutes)

### Step 1: Run Database Migration

```bash
# Navigate to your Supabase project directory
cd supabase

# Apply the migration
supabase db push

# Or manually run the SQL
psql YOUR_DATABASE_URL -f migrations/20251023_demo_leads.sql
```

**Verify:**
```sql
-- Check table exists
SELECT COUNT(*) FROM demo_leads;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'demo_leads';
```

---

### Step 2: Deploy Backend Function

```bash
# Deploy the updated make-server
supabase functions deploy make-server

# Or deploy all functions
supabase functions deploy
```

**Verify:**
```bash
# Test endpoint (should return empty array)
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server-55e8c5b2/demo-leads \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN"
```

---

### Step 3: Add Demo Leads to Admin Navigation

**Option A: Add to SuperAdminMasterConsole**

File: `/components/admin/SuperAdminMasterConsole.tsx`

```tsx
import { DemoLeadsPanel } from './DemoLeadsPanel';

// In the tabs array, add:
{
  id: 'demo-leads',
  label: 'Demo Leads',
  icon: <Users className="w-4 h-4" />,
  component: <DemoLeadsPanel />
}
```

**Option B: Add as Standalone Admin Page**

File: `/components/app/pages/DemoLeadsPage.tsx`

```tsx
import React from 'react';
import { DemoLeadsPanel } from '../../admin/DemoLeadsPanel';

export function DemoLeadsPage() {
  return (
    <div className="p-6">
      <DemoLeadsPanel />
    </div>
  );
}
```

Then add route in `AppRouter.tsx`:
```tsx
{user.role === 'super_admin' && (
  <Route path="/admin/demo-leads" element={<DemoLeadsPage />} />
)}
```

---

### Step 4: Update LiveDemoConsole to Track Engagement

File: `/components/demo/LiveDemoConsole.tsx`

Add state to track engagement:
```tsx
const [demoStartTime] = useState(Date.now());
const [actionsApproved, setActionsApproved] = useState(0);
const [featuresExplored, setFeaturesExplored] = useState<Set<string>>(new Set());

// Track tab changes
const handleTabChange = (tab: string) => {
  setCurrentView(tab);
  setFeaturesExplored(prev => new Set(prev).add(tab));
};

// Track approvals
const handleApprove = (actionId: string, actionType: string) => {
  // ... existing code ...
  setActionsApproved(prev => prev + 1);
  
  // Calculate engagement
  const timeInDemo = Math.floor((Date.now() - demoStartTime) / 1000);
  const engagement = {
    actions_approved: actionsApproved + 1,
    time_in_demo: timeInDemo,
    features_explored: Array.from(featuresExplored)
  };
  
  // Pass to conversion
  onConversion(engagement);
};
```

Update props:
```tsx
interface LiveDemoConsoleProps {
  onClose: () => void;
  onConversion: (engagement: DemoEngagement) => void; // ← Updated
}
```

---

### Step 5: Update DemoOrchestrator to Pass Engagement

File: `/components/demo/DemoOrchestrator.tsx`

```tsx
const [demoEngagement, setDemoEngagement] = useState<DemoEngagement | null>(null);

const handleConversion = (engagement: DemoEngagement) => {
  setDemoEngagement(engagement);
  if (!leadSubmitted) {
    setShowLeadCapture(true);
  }
};

// Pass to modal
<LeadCaptureModal
  isOpen={showLeadCapture}
  onClose={() => setShowLeadCapture(false)}
  onSubmit={handleLeadSubmit}
  demoEngagement={demoEngagement} // ← Added
/>
```

---

### Step 6: Test End-to-End

1. **Start Demo**
   - Click "Start the Live Demo" on HomePage
   - Verify launcher opens

2. **Complete Actions**
   - Click "Start Demo"
   - Wait for console to load
   - Click "Approve" on an action
   - Verify toast appears

3. **Submit Lead**
   - Wait for lead modal (1.5s delay)
   - Fill form: Name, Email, Company
   - Click "Get Your Pilot Started"
   - Verify success screen shows
   - Check browser console for success/errors

4. **Check Admin Dashboard**
   - Navigate to Admin → Demo Leads
   - Verify new lead appears
   - Check lead score and quality
   - Check engagement data
   - Update status dropdown

---

## Environment Variables

Ensure these are set:

```env
# Frontend (.env)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend (Supabase dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Verification Checklist

### Database
- [ ] `demo_leads` table exists
- [ ] RLS policies are active
- [ ] Indexes created
- [ ] `demo_leads_analytics` view works
- [ ] `get_demo_lead_funnel()` function works

### Backend
- [ ] make-server deployed
- [ ] `/demo-leads` POST endpoint works (public)
- [ ] `/demo-leads` GET endpoint works (admin only)
- [ ] `/demo-leads/:id` PATCH endpoint works (admin only)
- [ ] Lead scoring calculates correctly
- [ ] Duplicate prevention works

### Frontend
- [ ] LeadCaptureModal submits to backend
- [ ] Success/error states work
- [ ] Engagement data is tracked
- [ ] DemoLeadsPanel loads leads
- [ ] Filters work
- [ ] Status updates work
- [ ] Stats cards calculate correctly

---

## Common Issues

### Issue: "Failed to fetch leads"
**Solution:**
```typescript
// Check auth token is being sent
const token = localStorage.getItem('supabase.auth.token');
console.log('Token:', token);

// Verify endpoint URL
console.log('API URL:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/demo-leads`);
```

### Issue: "Unauthorized" when accessing admin panel
**Solution:**
```sql
-- Verify user is super admin
SELECT id, email, role FROM users WHERE email = 'your@email.com';

-- Update if needed
UPDATE users SET role = 'super_admin' WHERE email = 'your@email.com';
```

### Issue: Lead not appearing in admin panel
**Solution:**
```sql
-- Check if lead was created
SELECT * FROM demo_leads ORDER BY created_at DESC LIMIT 5;

-- Check RLS policies
SET ROLE authenticated;
SELECT * FROM demo_leads;
```

---

## Performance Optimization

### Database Indexes
Already created in migration:
```sql
CREATE INDEX idx_demo_leads_email ON demo_leads(email);
CREATE INDEX idx_demo_leads_status ON demo_leads(status);
CREATE INDEX idx_demo_leads_quality ON demo_leads(lead_quality);
CREATE INDEX idx_demo_leads_created ON demo_leads(created_at DESC);
CREATE INDEX idx_demo_leads_score ON demo_leads(lead_score DESC);
```

### API Caching
Consider adding:
```typescript
// In DemoLeadsPanel.tsx
const [cache, setCache] = useState<{ data: any, timestamp: number } | null>(null);

const fetchLeads = async () => {
  // Use cache if < 30s old
  if (cache && Date.now() - cache.timestamp < 30000) {
    setLeads(cache.data.leads);
    setStats(cache.data.stats);
    return;
  }
  
  // Otherwise fetch fresh
  // ... existing fetch logic ...
  setCache({ data, timestamp: Date.now() });
};
```

---

## Security Best Practices

### 1. Rate Limiting
Add to backend:
```typescript
// In demo-leads.ts
const rateLimiter = new Map<string, number>();

app.post('/demo-leads', async (c) => {
  const ip = c.req.header('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  // Allow 5 submissions per IP per hour
  const lastSubmission = rateLimiter.get(ip) || 0;
  if (now - lastSubmission < 3600000 / 5) {
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }
  
  rateLimiter.set(ip, now);
  // ... rest of handler ...
});
```

### 2. Email Verification
Optional: Add email verification:
```typescript
// Send verification email
const { error } = await supabase.auth.signInWithOtp({
  email: lead.email,
  options: {
    data: { lead_id: lead.id }
  }
});

// Mark as verified when they click link
await supabase
  .from('demo_leads')
  .update({ email_verified: true })
  .eq('id', lead_id);
```

### 3. Honeypot Field
Add to form:
```tsx
<input 
  type="text" 
  name="website" 
  className="hidden" 
  tabIndex={-1} 
  autoComplete="off"
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
/>

// Reject if filled
if (honeypot) {
  return c.json({ error: 'Invalid submission' }, 400);
}
```

---

## Monitoring & Alerts

### CloudWatch/Logs
Monitor these metrics:
- Lead capture rate (should be >80%)
- API errors (should be <1%)
- Duplicate rate (should be <5%)
- Average lead score (track trends)

### Slack Notifications
Add webhook for hot leads:
```typescript
// In demo-leads.ts after lead creation
if (lead_quality === 'hot') {
  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🔥 Hot Lead: ${name} from ${company} - Score: ${lead_score}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Hot Lead Captured!*\n*Name:* ${name}\n*Company:* ${company}\n*Email:* ${email}\n*Score:* ${lead_score}`
          }
        }
      ]
    })
  });
}
```

---

## ✅ Integration Complete When...

- [ ] Database migration applied successfully
- [ ] Backend endpoints return expected responses
- [ ] Admin panel shows in navigation
- [ ] Demo captures and submits leads
- [ ] Leads appear in admin dashboard
- [ ] Status updates work
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Security policies active

---

**Status**: ✅ Ready to Integrate

Follow this guide step-by-step and you'll have a fully functional lead capture system in ~5 minutes!
