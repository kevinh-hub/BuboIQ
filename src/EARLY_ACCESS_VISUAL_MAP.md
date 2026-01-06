# 🎟️ Early Access System — Visual Architecture Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BUBOIQ EARLY ACCESS SYSTEM                       │
│                  Invite-Only, Time-Gated Program                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          DATABASE LAYER                             │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
    │ early_access_    │      │ early_access_    │      │ early_access_    │
    │ cohort           │      │ invites          │      │ audit_log        │
    ├──────────────────┤      ├──────────────────┤      ├──────────────────┤
    │ org_cap          │◄────┤│ id               │      │ invite_id  ────┐ │
    │ device_cap       │      │ token (unique)   │      │ action         │ │
    │ closes_at        │      │ email            │      │ actor_user_id  │ │
    │ emergency_closed │      │ plan_name        │      │ details (JSON) │ │
    │ auto_expire      │      │ devices_included │      │ created_at     │ │
    └──────────────────┘      │ overage_rate     │      └────────────────┼─┘
                              │ expires_at       │                       │
                              │ status           │                       │
                              │ redeemed_by      │                       │
                              └──────────────────┘                       │
                                                                         │
    ┌──────────────────────────────────────────────────────────────────┘
    │
    └───► RLS Policies: Super Admin Only
          Functions: generate_token(), check_capacity(), expire_invites()
          Triggers: Auto-update timestamps

┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND API LAYER                          │
└─────────────────────────────────────────────────────────────────────┘

    /make-server-55e8c5b2/early-access/*

    ┌───────────────────────────────────────────────────────────────┐
    │                      ADMIN ROUTES                             │
    │                  (Super Admin Only)                           │
    ├───────────────────────────────────────────────────────────────┤
    │  GET  /admin/stats         → Cohort stats & metrics          │
    │  GET  /admin/invites       → List all invites                │
    │  POST /admin/create        → Create new invite               │
    │  POST /admin/revoke/:id    → Revoke invite                   │
    │  PUT  /admin/cohort        → Update cohort settings          │
    └───────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                      PUBLIC ROUTES                            │
    │                  (Token-based access)                         │
    ├───────────────────────────────────────────────────────────────┤
    │  GET  /validate/:token     → Validate invite token           │
    │  POST /redeem              → Redeem invite (auth required)   │
    └───────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌───────────────────────────────────────────────────────────────┐
    │                      EMAIL SERVICE                            │
    │                  (Resend Integration)                         │
    ├───────────────────────────────────────────────────────────────┤
    │  sendInviteEmail()         → Invite notification             │
    │  sendAcceptanceEmail()     → Welcome email                   │
    │  sendRevokedEmail()        → Revocation notice               │
    └───────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                               │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────────┐
    │                    ADMIN COMPONENTS ✅                       │
    ├──────────────────────────────────────────────────────────────┤
    │  AdminDashboard.tsx                                          │
    │  ├─ Stats Cards (invites, orgs, devices)                    │
    │  ├─ Cohort Controls (caps, emergency close)                 │
    │  ├─ Invites Table (search, filter, actions)                 │
    │  └─ CreateInviteModal.tsx                                    │
    │     ├─ Invite Form                                           │
    │     ├─ Email Toggle                                          │
    │     └─ Success State (copy link)                             │
    └──────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                  PUBLIC COMPONENTS ⚠️                        │
    ├──────────────────────────────────────────────────────────────┤
    │  InviteRedemption.tsx          (TEMPLATE PROVIDED)           │
    │  ├─ Token Validation UI                                      │
    │  ├─ Unauthenticated State (sign in/up)                       │
    │  ├─ Authenticated State (terms + activate)                   │
    │  └─ Error States (expired, revoked, used)                    │
    │                                                               │
    │  EAOnboarding.tsx              (TODO)                        │
    │  ├─ EA-PRO Badge Header                                      │
    │  ├─ Trial Countdown (14 days)                                │
    │  ├─ Device Limit Card                                        │
    │  └─ Support Panel (help@buboiq.com)                          │
    │                                                               │
    │  EABillingState.tsx            (TODO)                        │
    │  ├─ "Billing Launches Soon" Banner                           │
    │  ├─ Read-only Plan Card                                      │
    │  └─ Observe-only Mode (trial expired)                        │
    │                                                               │
    │  InviteDetailDrawer.tsx        (TODO)                        │
    │  ├─ Full Invite Metadata                                     │
    │  ├─ Redemption Timeline                                      │
    │  └─ Actions (copy, revoke, resend)                           │
    └──────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                   UI COMPONENTS ✅                           │
    ├──────────────────────────────────────────────────────────────┤
    │  EABadges.tsx                                                │
    │  ├─ EABadge (EA-PRO, FOUNDERS RATE, etc.)                   │
    │  ├─ StatusPill (valid, expired, revoked)                     │
    │  ├─ PlanCardBadge (plan details card)                        │
    │  └─ CountdownBadge (time remaining)                          │
    └──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         USER FLOWS                                  │
└─────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │                    ADMIN FLOW                               │
    └─────────────────────────────────────────────────────────────┘

    1. Super Admin
       │
       ▼
    2. Navigate to /early-access-admin
       │
       ▼
    3. View Dashboard
       ├─ Stats: Invites, Orgs, Devices, Caps
       ├─ Cohort: Configure limits, closing date
       └─ Invites: Table with search/filter
       │
       ▼
    4. Click "Create Invite"
       │
       ▼
    5. Fill Form
       ├─ Email (optional for open invite)
       ├─ Days Valid (default 10)
       ├─ Notes (internal)
       └─ Send Email Toggle
       │
       ▼
    6. Generate Invite
       ├─ System creates unique token
       ├─ Email sent if configured
       └─ Admin copies link
       │
       ▼
    7. Share with Recipient
       └─ Via email or copy/paste link

    ┌─────────────────────────────────────────────────────────────┐
    │                  REDEMPTION FLOW                            │
    └─────────────────────────────────────────────────────────────┘

    1. Recipient
       │
       ▼
    2. Receives Email or Link
       └─ https://app.com/invite/ea?token=ABC123
       │
       ▼
    3. Clicks Link → /invite/ea
       │
       ▼
    4. System Validates Token
       ├─ ✓ Exists
       ├─ ✓ Not expired
       ├─ ✓ Not used
       ├─ ✓ Not revoked
       ├─ ✓ Cohort open
       └─ ✓ Under capacity
       │
       ├─ If Invalid ──────► Error State
       │                     └─ Show error, contact support
       │
       ├─ If Not Auth ─────► Sign In/Up Prompt
       │                     └─ Return after auth
       │
       └─ If Auth ─────────► Redemption Page
                             │
                             ▼
    5. Show Invite Details
       ├─ Plan: EA-Pro, $99/mo, 100 devices
       ├─ Trial: 14 days, no card
       ├─ Expires: {date}
       └─ Terms checkbox
       │
       ▼
    6. User Activates
       ├─ Checks terms
       ├─ Enters org name
       └─ Clicks "Activate Early Access"
       │
       ▼
    7. System Creates
       ├─ Organization
       │  ├─ is_early_access = true
       │  ├─ ea_founders_rate = 99.00
       │  ├─ tier = 'pro'
       │  ├─ device_limit = 100
       │  └─ trial_ends_at = now + 14 days
       ├─ Updates invite status → 'redeemed'
       └─ Sends acceptance email
       │
       ▼
    8. Redirect to EA Onboarding
       └─ Show trial countdown, device limits, support

    ┌─────────────────────────────────────────────────────────────┐
    │                   COHORT MANAGEMENT                         │
    └─────────────────────────────────────────────────────────────┘

    Capacity Checking (on redemption):

    ┌──────────────────────────────────┐
    │  check_cohort_capacity()         │
    ├──────────────────────────────────┤
    │  Current Orgs < Org Cap?         │──No──► ❌ Block
    │  Current Devices < Device Cap?   │──No──► ❌ Block
    │  Before closes_at?               │──No──► ❌ Block
    │  !emergency_closed?              │──No──► ❌ Block
    │                                  │
    │  All checks pass?                │──Yes─► ✅ Allow
    └──────────────────────────────────┘

    Emergency Close Flow:

    Admin toggles "Emergency Close"
       │
       ▼
    emergency_closed = TRUE
       │
       ▼
    All redemptions BLOCKED
       │
       └─ Existing invites remain but cannot be used
          Re-open cohort to resume

┌─────────────────────────────────────────────────────────────────────┐
│                      EMAIL FLOW                                     │
└─────────────────────────────────────────────────────────────────────┘

    Invite Email
    ┌───────────────────────────────────────┐
    │ From: onboarding@buboiq.com           │
    │ To: recipient@example.com             │
    │ Subject: Your BuboIQ EA Invite        │
    ├───────────────────────────────────────┤
    │ • Welcome message                     │
    │ • Plan details (EA-Pro, $99/mo)       │
    │ • Expires on {date}                   │
    │ • [Activate Invite] CTA button        │
    │ • Fallback link                       │
    │ • help@buboiq.com support             │
    └───────────────────────────────────────┘
               │
               ▼ (clicks link)
    ┌───────────────────────────────────────┐
    │ Redemption Page                       │
    │ (/invite/ea?token=ABC123)             │
    └───────────────────────────────────────┘
               │
               ▼ (activates)
    ┌───────────────────────────────────────┐
    │ Acceptance Email                      │
    ├───────────────────────────────────────┤
    │ From: onboarding@buboiq.com           │
    │ To: recipient@example.com             │
    │ Subject: Welcome to BuboIQ EA         │
    ├───────────────────────────────────────┤
    │ • Congratulations                     │
    │ • Founders rate confirmation          │
    │ • 14-day trial info                   │
    │ • Next steps                          │
    │ • help@buboiq.com support             │
    └───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      STATUS STATES                                  │
└─────────────────────────────────────────────────────────────────────┘

    Invite Status Lifecycle:

    UNUSED ──────────┬──────────► REDEEMED (successful activation)
       │             │
       │             ├──────────► EXPIRED (past expires_at)
       │             │
       │             └──────────► REVOKED (admin action)
       │
       └─ Auto-expire after expires_at (if auto_expire = TRUE)

    Status Badges:
    • UNUSED       → Gray pill
    • REDEEMED     → Green pill with checkmark
    • EXPIRED      → Red pill with X
    • REVOKED      → Dark red pill with ⊘
    • VALID        → Neon green with ✓
    • EXPIRING     → Orange pulsing with ⚠

┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT MAP                                   │
└─────────────────────────────────────────────────────────────────────┘

    Step 1: Database
    ┌────────────────────────────────────┐
    │ Run migration:                     │
    │ 20251022_early_access_system.sql   │
    │                                    │
    │ Creates:                           │
    │ • Tables (cohort, invites, audit)  │
    │ • Functions (generate, check)      │
    │ • RLS policies                     │
    │ • Triggers                         │
    └────────────────────────────────────┘
                  │
                  ▼
    Step 2: Backend
    ┌────────────────────────────────────┐
    │ Deploy server function:            │
    │ supabase functions deploy server   │
    │                                    │
    │ Includes:                          │
    │ • early-access.ts routes           │
    │ • Email templates                  │
    │ • Audit logging                    │
    └────────────────────────────────────┘
                  │
                  ▼
    Step 3: Secrets
    ┌────────────────────────────────────┐
    │ Set environment variables:         │
    │ • RESEND_API_KEY                   │
    │ • SUPABASE_URL (auto)              │
    │ • SUPABASE_SERVICE_ROLE_KEY (auto) │
    └────────────────────────────────────┘
                  │
                  ▼
    Step 4: Admin
    ┌────────────────────────────────────┐
    │ Create super admin:                │
    │ UPDATE users                       │
    │ SET role = 'super_admin'           │
    │ WHERE email = '...'                │
    └────────────────────────────────────┘
                  │
                  ▼
    Step 5: Frontend
    ┌────────────────────────────────────┐
    │ Add routes to App.tsx:             │
    │ • /early-access-admin              │
    │ • /invite/ea                       │
    │ • /ea-onboarding                   │
    └────────────────────────────────────┘
                  │
                  ▼
    Step 6: Test
    ┌────────────────────────────────────┐
    │ Run full flow:                     │
    │ 1. Create invite                   │
    │ 2. Validate token                  │
    │ 3. Redeem invite                   │
    │ 4. Verify org created              │
    │ 5. Check emails sent               │
    └────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      SUCCESS METRICS                                │
└─────────────────────────────────────────────────────────────────────┘

    KPIs to Monitor:

    ┌─────────────────────────────────────┐
    │ Invite Conversion                   │
    │ Redeemed / Created                  │
    │ Target: >60%                        │
    │ ████████████░░░░░░░░ 60%           │
    └─────────────────────────────────────┘

    ┌─────────────────────────────────────┐
    │ Trial-to-Paid                       │
    │ Paid / Trial Ended                  │
    │ Target: >40%                        │
    │ ████████░░░░░░░░░░░░ 40%           │
    └─────────────────────────────────────┘

    ┌─────────────────────────────────────┐
    │ Time to Redemption                  │
    │ Median days from create → redeem    │
    │ Target: <3 days                     │
    │ ████░░░░░░░░░░░░░░░░ 2.5 days      │
    └─────────────────────────────────────┘

    ┌─────────────────────────────────────┐
    │ Cohort Capacity                     │
    │ Current / Cap                       │
    │ Monitor: approaching limit?         │
    │ ████████░░░░░░░░░░░░ 45/50 orgs    │
    └─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         LEGEND                                      │
└─────────────────────────────────────────────────────────────────────┘

    ✅ = Complete & Tested
    ⚠️  = Needs Implementation (Template Provided)
    ❌ = Blocked/Error State
    ── = Data Flow
    ◄─ = Reference/Link
    └─ = Sub-item/Child

    Colors (in actual system):
    • Neon Green (#00FF85)  - Primary actions, valid states
    • Electric Blue (#1E90FF) - Accents, info states
    • Orange (#FF8C00)       - Warnings, expiring soon
    • Red (#FF4444)          - Errors, revoked states
    • Gray (#A0A0A0)         - Muted, unused states

┌─────────────────────────────────────────────────────────────────────┐
│                       QUICK REFERENCE                               │
└─────────────────────────────────────────────────────────────────────┘

    Deploy:    ./DEPLOY_EARLY_ACCESS.sh
    Docs:      EARLY_ACCESS_SYSTEM_COMPLETE.md
    Quick:     EARLY_ACCESS_QUICK_START.md
    Handoff:   EARLY_ACCESS_HANDOFF.md
    Visual:    EARLY_ACCESS_VISUAL_MAP.md (this file)

    Admin URL: /early-access-admin
    Invite URL: /invite/ea?token={TOKEN}
    API Base:  /make-server-55e8c5b2/early-access

    Support:   help@buboiq.com
    Sender:    onboarding@buboiq.com

    Status:    Backend ✅ | Frontend 50% ⚠️ | Docs ✅
```

---

**Built for BuboIQ — The Brain of Modern IT Operations** 🦉
