# Content Guidelines: No Vanity Metrics

**Purpose:** Ensure all BuboIQ marketing content is honest, verifiable, and free of fabricated claims  
**Scope:** All marketing pages, landing pages, and public-facing content  
**Effective:** October 28, 2024

---

## 🎯 Core Principle

**Better to say nothing than to say something fake.**

If you don't have real data, don't make up numbers. If you can't verify a claim, don't make it. If you can't attribute a quote, don't use it.

---

## 🚫 BAN LIST

### NEVER Use Without Source:

❌ **Percentages**
```
"94% reduction"
"97% compliance"
"90% noise reduction"
"3x faster"
"50% fewer tickets"
```

❌ **Time Claims**
```
"Save 15 hours per week"
"3-5 day warning window"
"<1 day audit prep"
"Resolve in minutes"
"Hours of work automated"
```

❌ **Device/User Counts**
```
"1,200 endpoints"
"8 technicians"
"45 clients"
"10,000 devices"
"500 users"
```

❌ **Superlatives**
```
"Best-in-class"
"Industry-leading"
"World-class"
"Revolutionary"
"Game-changing"
"Cutting-edge"
```

❌ **Vague Improvements**
```
"Significantly faster"
"Dramatically reduce"
"Massively improve"
"Exponentially better"
"Tons of time saved"
```

❌ **Fake Customer Profiles**
```
"Regional MSP"
"Leading IT provider"
"Fortune 500 company"
"Healthcare organization"
"Financial services firm"
```

---

## ✅ USE INSTEAD

### Allowed Content Types:

#### 1. Capability Descriptions
What the feature actually does.

✅ **GOOD:**
```
"Identifies anomalies across your fleet"
"Step-by-step actions for common fixes"
"Multi-factor authentication required for every session"
"Append-only, immutable audit logs"
"Works on Windows, macOS, and Linux"
```

❌ **BAD:**
```
"Reduces incidents by 90%"
"Saves hours of manual work"
"Industry-leading security"
"Revolutionary AI detection"
"Best-in-class compliance"
```

---

#### 2. Technical Specifications
What the system actually includes.

✅ **GOOD:**
```
"Supports Windows 10+, macOS 12+, Ubuntu 20.04+"
"256-bit AES encryption at rest"
"SOC 2 Type II compliant infrastructure"
"99.9% uptime SLA"
"GDPR and HIPAA controls available"
```

❌ **BAD:**
```
"Enterprise-grade security"
"Military-grade encryption"
"Bank-level protection"
"Unbreakable security"
"Never goes down"
```

---

#### 3. Tier Information
What's included in each plan.

✅ **GOOD:**
```
"Available on: All Plans"
"Available on: Pro & Team"
"Available on: Team Only"
"Requires: Compliance Add-on"
"Included with: Team tier"
```

❌ **BAD:**
```
"Perfect for growing MSPs"
"Ideal for enterprises"
"Best value for money"
"Most popular plan"
"Recommended for you"
```

---

#### 4. Process Descriptions
How the system works.

✅ **GOOD:**
```
"AI learns normal patterns for each environment over 14 days"
"System suppresses routine events and surfaces anomalies"
"Successful fixes auto-generate draft KB articles"
"Technician reviews and approves before publication"
"Session recordings stored in tamper-proof logs"
```

❌ **BAD:**
```
"AI magically predicts problems"
"Automatically fixes everything"
"No manual work required"
"Set it and forget it"
"Works like magic"
```

---

#### 5. Feature Lists
What's included, not what it achieves.

✅ **GOOD:**
```
Features that address this:
- Signal Detection
- Pattern Learning
- Baseline Detection
```

❌ **BAD:**
```
Results you'll see:
- 94% fewer alerts
- 15 hours saved weekly
- 97% SLA compliance
```

---

## 📊 When You CAN Use Metrics

### Option 1: Case-Backed
If you have a real case study with client permission.

```tsx
<div className="case-study-metric">
  <Badge>Case-Backed</Badge>
  <p className="metric">94% alert reduction</p>
  <p className="attribution">
    <a href="/case-studies/acme-msp">Acme MSP</a> — Healthcare client, 1,200 endpoints
  </p>
  <p className="date">Verified: March 2024</p>
</div>
```

**Requirements:**
- ✅ Client gave written permission
- ✅ Metric is verifiable
- ✅ Case study is published
- ✅ Attribution is visible
- ✅ Date is shown

---

### Option 2: Live Data Only
If pulling from production analytics.

```tsx
<div className="live-metric">
  <Badge>Live Data Only</Badge>
  <p className="metric">{liveData.slaCompliance}% SLA compliance</p>
  <p className="source">Across {liveData.clientCount} active clients</p>
  <p className="updated">Updated: {liveData.lastUpdated}</p>
</div>
```

**Requirements:**
- ✅ Data from production database
- ✅ Updated in real-time or near real-time
- ✅ Source is visible
- ✅ "Live Data Only" tag is shown
- ✅ Last updated timestamp is visible

---

### Option 3: Demo Data (Clearly Marked)
If showing example/demo interface.

```tsx
<div className="demo-metric">
  <Badge>Demo Only - Not Real Data</Badge>
  <p className="metric">Sample: 94% compliance</p>
  <p className="disclaimer">
    This is example data for demonstration purposes.
  </p>
</div>
```

**Requirements:**
- ✅ "Demo Only" badge is prominent
- ✅ Disclaimer is visible
- ✅ Clear it's not real
- ✅ Never claim demo data represents real results

---

## 📝 Writing Guidelines

### Tone: Business-Friendly, Plain English

**Target:**
- 8th-10th grade reading level
- Flesch Reading Ease: 60-70
- Short sentences (15-20 words avg)
- Active voice

**Examples:**

✅ **GOOD:**
```
"The system monitors SLA compliance in real time. 
Escalation rules trigger automatically before deadlines pass."
```
- Clear
- Specific
- Active voice
- No hype

❌ **BAD:**
```
"Our revolutionary AI-powered platform leverages cutting-edge 
machine learning to dramatically reduce SLA breaches by up to 
97% through intelligent predictive analytics."
```
- Buzzwords
- Vague
- Unsourced claim
- Passive voice

---

### Structure: Problem → Solution → Capability

**Good Pattern:**
```
PROBLEM: "Teams receive hundreds of alerts daily. Most are false positives."

SOLUTION: "AI learns normal patterns for each environment."

CAPABILITY: "The system suppresses routine events and surfaces only signals that need attention."
```

**Bad Pattern:**
```
HYPE: "Revolutionary AI reduces alert fatigue by 94%!"
```

---

### Before/After: Reality, Not Fantasy

**Good Before/After:**
```
BEFORE: "Technicians manually fix the same issues across different clients: 
DNS problems, print spooler crashes, disk cleanup."

AFTER: "Guided Fixes provide step-by-step actions with safety grades. 
Successful fixes automatically draft Knowledge Base articles."
```

**Bad Before/After:**
```
BEFORE: "Your team wastes 15 hours per week on repetitive tasks."
AFTER: "BuboIQ saves you 15 hours per week automatically!"
```
(Where did "15 hours" come from? No source.)

---

## 🎨 Badge System

### Status Badges

**Before BuboIQ:**
```tsx
<Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
  Before BuboIQ
</Badge>
```

**With BuboIQ:**
```tsx
<Badge className="bg-success-green/20 text-success-green border-success-green/30">
  With BuboIQ
</Badge>
```

---

### Tier Badges

**All Plans:**
```tsx
<Badge className="bg-success-green/10 text-success-green border-success-green/30">
  All Plans
</Badge>
```

**Pro & Team:**
```tsx
<Badge className="bg-electric-blue/10 text-electric-blue border-electric-blue/30">
  Pro & Team
</Badge>
```

**Team Only:**
```tsx
<Badge className="bg-prediction-purple/10 text-prediction-purple border-prediction-purple/30">
  Team Only
</Badge>
```

**Team + Add-on:**
```tsx
<Badge className="bg-prediction-purple/10 text-prediction-purple border-prediction-purple/30">
  Team + Add-on
</Badge>
```

---

### Evidence Badges

**Case-Backed:**
```tsx
<Badge className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30">
  Case-Backed
</Badge>
```
Use when: Real case study exists and is linked.

**Live Data Only:**
```tsx
<Badge className="bg-electric-blue/10 text-electric-blue border-electric-blue/30">
  Live Data Only
</Badge>
```
Use when: Pulling from production database.

**Demo Only:**
```tsx
<Badge className="bg-amber-warning/10 text-amber-warning border-amber-warning/30">
  Demo Only - Not Real Data
</Badge>
```
Use when: Showing example/demo data.

---

## ✅ Review Checklist

Before publishing any content, verify:

### Content Quality
- [ ] No percentages without source
- [ ] No time claims without proof
- [ ] No superlatives ("best," "leading," etc.)
- [ ] No fake customer profiles
- [ ] Reading level: 8th-10th grade
- [ ] Active voice used
- [ ] Plain English (no jargon)

### Metrics (if any)
- [ ] Source is documented
- [ ] Client permission obtained (if case study)
- [ ] "Case-Backed" or "Live Data Only" badge visible
- [ ] Attribution is clear
- [ ] Date/timestamp shown
- [ ] Would hold up in court

### Design/UX
- [ ] Tier badges are accurate
- [ ] CTAs are clear
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Accessibility (4.5:1 contrast)

---

## 🚨 Red Flags

### Auto-Reject If You See:

🚨 Numbers without source
```
"94% reduction" — STOP. Source?
```

🚨 Customer without name
```
"Regional MSP saw great results" — STOP. Which MSP?
```

🚨 Superlative without proof
```
"Best-in-class solution" — STOP. Says who?
```

🚨 Vague time claim
```
"Save tons of time" — STOP. How much exactly?
```

🚨 Hype language
```
"Revolutionary AI" — STOP. Just say "AI".
```

---

## 📖 Examples: Good vs Bad

### Example 1: Feature Description

❌ **BAD:**
```
"Our revolutionary AI-powered Signal Detection reduces alert 
noise by up to 94%, saving your team 15 hours per week while 
catching issues 3-5 days earlier than traditional monitoring."
```

Problems:
- "Revolutionary" (superlative)
- "94%" (no source)
- "15 hours" (no source)
- "3-5 days" (no source)
- "Traditional monitoring" (vague)

✅ **GOOD:**
```
"Signal Detection identifies anomalies across your fleet by 
learning what normal looks like for each environment. The 
system suppresses routine events and surfaces only signals 
that need attention."
```

Benefits:
- Plain English
- Specific capability
- No unsourced claims
- Active voice

---

### Example 2: Customer Story

❌ **BAD:**
```
"Regional MSP with 1,200 endpoints reduced alert fatigue by 
94% and saved 15 hours per week after implementing BuboIQ."
```

Problems:
- "Regional MSP" (no name)
- "1,200 endpoints" (no verification)
- "94%" (no source)
- "15 hours" (no proof)

✅ **GOOD:**
```
BEFORE: "Teams receive hundreds of alerts daily. Most are 
false positives. Real issues hide in the noise until users 
complain."

AFTER: "AI learns normal patterns for each environment. The 
system suppresses routine events and surfaces only signals 
that need attention."

Features: Signal Detection, Pattern Learning, Baseline Detection
```

Benefits:
- No fake metrics
- Relatable problem
- Clear solution
- Feature attribution

---

### Example 3: Social Proof

❌ **BAD:**
```
<div className="metric-tile">
  <h3>94%</h3>
  <p>Alert Reduction</p>
</div>
```

Problems:
- No source
- No attribution
- Looks like real data
- Misleading

✅ **GOOD:**
```
<div className="proof-tag">
  <CheckCircle />
  <span>Case-Backed Stories</span>
</div>
```

Benefits:
- Honest
- Not misleading
- Links to real content
- Clear it's not a metric

---

## 🎯 Enforcement

### Who Reviews:
- Content lead (required)
- Legal (if metrics included)
- Product (for technical accuracy)

### When to Review:
- Before any new page goes live
- When updating existing pages
- Quarterly audit of all marketing content

### How to Report Violations:
1. Take screenshot
2. Document location (page URL, component)
3. Note violation type (metric, superlative, etc.)
4. File issue in project tracker
5. Assign to content lead

---

## 📊 Metrics That ARE Allowed

### System Specifications
✅ "99.9% uptime SLA" — This is our commitment
✅ "256-bit AES encryption" — This is a spec
✅ "HIPAA compliant infrastructure" — This is verifiable

### Tier Limits
✅ "Starter: Up to 50 devices" — This is policy
✅ "Pro: Up to 500 devices" — This is policy
✅ "Team: Unlimited devices" — This is policy

### Pricing
✅ "Starter: $33/mo" — This is real
✅ "Pro: $127/mo" — This is real
✅ "Team: $297/mo" — This is real

### Feature Availability
✅ "Available on: All Plans" — This is true
✅ "Available on: Pro & Team" — This is true
✅ "Available on: Team Only" — This is true

---

## 🎉 Summary

### DO:
✅ Describe capabilities accurately
✅ Use plain English (8th-10th grade)
✅ Show tier information clearly
✅ Link to real case studies when available
✅ Mark demo data as "Demo Only"
✅ Use active voice
✅ Be specific and concrete

### DON'T:
❌ Make up percentages
❌ Fabricate time savings
❌ Use superlatives without proof
❌ Create fake customer profiles
❌ Hype with buzzwords
❌ Claim demo data is real
❌ Show metrics without source

### REMEMBER:
**Better to say nothing than to say something fake.**

When in doubt, leave it out.

---

**Status:** ✅ Active guidelines as of October 28, 2024  
**Review:** Quarterly  
**Owner:** Content Lead  
**Enforcement:** Required for all marketing content

---

**Related Documents:**
- `/VANITY_METRICS_AUDIT.md` — Violations report
- `/FEATURES_STREAMLINED_HANDOFF.md` — Implementation specs
- `/components/marketing/StreamlinedFeaturesPage.tsx` — Example implementation

**Last Updated:** October 28, 2024
