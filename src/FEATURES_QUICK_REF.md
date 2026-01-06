# Features Page: Quick Reference Card

**Version:** Streamlined v2  
**Status:** ✅ Live  
**File:** `/components/marketing/StreamlinedFeaturesPage.tsx`

---

## 🚀 Quick Start

```tsx
import { FeaturesPage } from './components/marketing/FeaturesPage';

// Use streamlined version (default)
<FeaturesPage onNavigate={nav} onTryItNow={demo} />

// Or explicitly
<FeaturesPage 
  onNavigate={nav} 
  onTryItNow={demo} 
  version="streamlined"  // No vanity metrics
/>
```

---

## 📐 Page Structure

```
┌─────────────────────────────────────┐
│ HERO                                │
│ - Headline + CTA                    │
│ - 3 tags (no metrics)               │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│ STORIES (Tabbed)                    │
│ [Alerts] [Fixes] [Compliance] [SLA] │
│ One card visible at a time          │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│ FEATURES (Tabbed)                   │
│ 6 tabs × 3 features each            │
│ One category visible at a time      │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│ PLATFORM TRIO                       │
│ [Agent] [Connect] [Cloud]           │
│ 3 cards, always visible             │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│ FINAL CTA                           │
│ - Primary + Secondary               │
│ - Help email                        │
└─────────────────────────────────────┘
```

---

## 🎯 Key Rules

### NEVER:
❌ Add metrics without source  
❌ Use percentages (94%, 97%, etc.)  
❌ Claim time savings (15hrs, etc.)  
❌ Use superlatives (best, leading)  
❌ Create fake customer profiles  

### ALWAYS:
✅ Use plain English (8th-10th grade)  
✅ Describe capabilities accurately  
✅ Show tier badges  
✅ Link to real case studies  
✅ Mark demo data as "Demo Only"  

---

## 🏷️ Tier Badges

```tsx
// All Plans
<Badge className="bg-success-green/10 text-success-green border-success-green/30">
  All Plans
</Badge>

// Pro & Team
<Badge className="bg-electric-blue/10 text-electric-blue border-electric-blue/30">
  Pro & Team
</Badge>

// Team Only
<Badge className="bg-prediction-purple/10 text-prediction-purple border-prediction-purple/30">
  Team Only
</Badge>
```

---

## 🔗 Anchor IDs

### Feature Anchors:
```html
#signal-detection
#cross-client-intelligence
#predictive-alerts
#guided-fixes
#auto-draft-kb
#smart-ticketing
#zero-trust-connect
#session-recording
#zero-trust-policies
#audit-trails
#compliance-exports
#device-posture
#multi-tenant
#sla-tracking
#device-management
#self-learning-kb
#reviewer-console
#smart-search
```

### Section Anchors:
```html
#features
```

---

## 📊 Social Proof Tags (No Metrics)

```tsx
// Hero social proof strip
<div className="flex items-center gap-2">
  <CheckCircle className="w-4 h-4 text-iq-neon-green" />
  <span>Case-Backed Stories</span>
</div>

<div className="flex items-center gap-2">
  <Activity className="w-4 h-4 text-electric-blue" />
  <span>Live SLA Dashboard</span>
</div>

<div className="flex items-center gap-2">
  <FileCheck className="w-4 h-4 text-prediction-purple" />
  <span>Audit-Ready Exports</span>
</div>
```

---

## 📝 Content Pattern

### Good Feature Description:
```tsx
{
  id: 'signal-detection',
  name: 'Signal Detection',
  description: 'Identifies anomalies across your fleet by learning what normal looks like for each environment.',
  tier: 'All Plans',
  icon: <Eye className="w-5 h-5" />
}
```

### Good Before/After:
```tsx
{
  before: "Teams receive hundreds of alerts daily. Most are false positives.",
  after: "AI learns normal patterns. The system surfaces only signals that need attention.",
  features: ['Signal Detection', 'Pattern Learning']
}
```

---

## 🔄 State Management

```typescript
// Story tabs
const [activeStory, setActiveStory] = useState<string>('alerts');

// Feature tabs
const [activeFeature, setActiveFeature] = useState<string>('intelligence');

// Navigation
onClick={() => {
  setActiveFeature('intelligence');
  document.querySelector('#signal-detection')?.scrollIntoView({ behavior: 'smooth' });
}}
```

---

## ✅ Pre-Publish Checklist

Before deploying changes:

**Content:**
- [ ] No percentages without source
- [ ] No time claims without proof
- [ ] No superlatives
- [ ] No fake profiles
- [ ] Reading level: 8th-10th grade

**Functional:**
- [ ] All tabs work
- [ ] Anchors scroll correctly
- [ ] CTAs navigate properly
- [ ] Mobile responsive

**Design:**
- [ ] Tier badges correct
- [ ] Colors consistent
- [ ] Spacing proper
- [ ] Contrast 4.5:1+

---

## 🚨 Common Mistakes

### ❌ DON'T:
```tsx
// Fake metric
<div className="metric">94%</div>

// Unsourced claim
<p>Save 15 hours per week</p>

// Vague customer
<p>"Regional MSP saw great results"</p>

// Hype
<p>Revolutionary AI-powered solution</p>
```

### ✅ DO:
```tsx
// Descriptive tag
<Badge>Case-Backed Stories</Badge>

// Honest capability
<p>Identifies anomalies across your fleet</p>

// Real example (with permission)
<a href="/case-studies/acme">Acme MSP Case Study</a>

// Plain language
<p>AI learns normal patterns for each environment</p>
```

---

## 📚 Documentation

**Full Docs:**
- `/FEATURES_STREAMLINED_HANDOFF.md` — Implementation guide
- `/VANITY_METRICS_AUDIT.md` — Violations removed
- `/CONTENT_GUIDELINES_NO_VANITY.md` — Writing rules

**Component:**
- `/components/marketing/StreamlinedFeaturesPage.tsx`

---

## 🎯 Quick Metrics Check

**Run these grep commands to verify no vanity metrics:**

```bash
# Should return 0 results
grep -i "94%" components/marketing/StreamlinedFeaturesPage.tsx
grep -i "97%" components/marketing/StreamlinedFeaturesPage.tsx
grep -i "15hr" components/marketing/StreamlinedFeaturesPage.tsx
grep -i "save.*time" components/marketing/StreamlinedFeaturesPage.tsx
grep -i "reduce.*by" components/marketing/StreamlinedFeaturesPage.tsx
```

If any return results: **FIX IMMEDIATELY.**

---

## 🚀 Deploy Command

```bash
# 1. Verify locally
npm run dev
# Navigate to /features
# Check: No metrics visible

# 2. Build
npm run build

# 3. Deploy
# (Your deployment process here)
```

---

## 📊 Success Metrics (Real Ones)

**Track these AFTER deployment:**
- Time on page
- Tab interaction rate
- Scroll depth
- CTA click-through
- Bounce rate

**DO NOT track or display:**
- Made-up percentages
- Fake time savings
- Unsourced claims

---

## 🎉 Bottom Line

**This page:**
- ✅ Has zero vanity metrics
- ✅ Uses tabbed navigation
- ✅ Shows one surface at a time
- ✅ Speaks plain English
- ✅ Links to real evidence

**Result:** Honest, fast, trustworthy.

---

**Status:** ✅ Production-ready  
**Last Updated:** October 28, 2024  
**Owner:** Engineering + Content
