# 🚀 BuboIQ Local Development Quick Start

## TL;DR - Start in 3 Commands

```bash
npm install                              # Install dependencies
supabase functions deploy make-server    # Deploy backend (one-time)
npm run dev                              # Start local dev server
```

Then open `http://localhost:5173` and login! 🎉

---

## 📋 Prerequisites Checklist

Before you can run locally, verify these are complete:

### ✅ Already Configured (Based on Your Files):
- ✅ Supabase Project: `ephiymteomxphqnkcsvs`
- ✅ Environment variables in `/utils/supabase/info.tsx`
- ✅ Database schema files ready
- ✅ Edge Functions code ready

### 🔧 Need to Verify:

#### 1. Database Schema Deployed?
Check if your database has tables:

```bash
# Option A: Via Supabase CLI
supabase db push

# Option B: Via Supabase Dashboard
# Go to: https://supabase.com/dashboard/project/ephiymteomxphqnkcsvs/editor
# Run the schema files manually if needed
```

**Schema Files to Deploy** (in order):
1. `/supabase/migrations/20251001_buboiq_all_in_one.sql`
2. `/supabase/migrations/20251002_partner_routing.sql`
3. `/supabase/migrations/20251003_compliance_features.sql`
4. `/supabase/migrations/20251022_buboiq_analyst.sql`
5. `/supabase/migrations/20251022_early_access_system.sql`
6. `/supabase/migrations/20251023_demo_leads.sql`

#### 2. Edge Functions Deployed?
```bash
# Deploy the main server function
supabase functions deploy make-server

# Verify it's deployed
supabase functions list
```

#### 3. Super Admin Account Created?
See next section 👇

---

## 🔑 Create Super Admin (One-Time Setup)

### Method 1: Automated Signup + SQL Promotion

**Step 1:** Start the dev server
```bash
npm run dev
```

**Step 2:** Open browser to `http://localhost:5173`

**Step 3:** Sign up with super admin credentials:
- Email: `admin@buboiq.dev`
- Password: `BuboIQ2024!Admin`

**Step 4:** Get your user ID from Supabase SQL Editor:
```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@buboiq.dev';
```

**Step 5:** Promote to super admin:
```sql
UPDATE users 
SET role = 'super_admin', org_id = NULL
WHERE email = 'admin@buboiq.dev';
```

**Step 6:** Refresh browser and login!

---

### Method 2: Quick Login Button (If Available)

If you see the **"Super Admin Quick Login"** card on the login page:
1. Just click the button
2. Auto-logs you in!
3. (Requires account to already exist from Method 1)

---

## 🏃 Running Locally - Step by Step

### First Time Setup:

```bash
# 1. Install Node modules
npm install

# 2. Deploy database schema (if not done)
supabase db push

# 3. Deploy Edge Functions
supabase functions deploy make-server

# 4. Start dev server
npm run dev
```

### Every Day After:

```bash
# Just start the dev server
npm run dev
```

### Access the App:

Open your browser to:
- **Local Dev:** `http://localhost:5173`
- **Login:** Use super admin credentials
- **Admin Dashboard:** Navigate to `/admin` after login

---

## 🎯 Quick Navigation Map

Once logged in as super admin:

| Route | What It Does |
|-------|--------------|
| `/` | Landing page (public) |
| `/login` | Login page |
| `/dashboard` | Main user dashboard |
| `/admin` | **Super Admin Dashboard** |
| `/early-access-admin` | **Early Access Management** |
| `/admin/demo-leads` | **Demo Leads Panel** |
| `/devices` | Device management |
| `/tickets` | Support tickets |
| `/signals` | Intelligence signals |
| `/settings` | User settings |

---

## 🔧 Troubleshooting Local Development

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config
npm run dev -- --port 3000
```

### "Cannot connect to Supabase"
- Check your internet connection
- Verify Supabase project is active: https://supabase.com/dashboard
- Check `/utils/supabase/info.tsx` has correct project ID

### "Invalid credentials" when logging in
- Create account first via signup
- Then run SQL promotion (see Create Super Admin above)
- Clear browser cache/cookies and try again

### "Function not found" errors
- Deploy Edge Functions:
  ```bash
  supabase functions deploy make-server
  ```
- Check function is deployed:
  ```bash
  supabase functions list
  ```

### "Table does not exist" errors
- Deploy database schema:
  ```bash
  supabase db push
  ```
- Or run migration files manually in Supabase SQL Editor

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Check for errors
npm run type-check

# Rebuild
npm run build
```

---

## 🚀 When to Deploy vs Run Locally

### ✅ Run Locally For:
- Development and testing
- Building new features
- Debugging issues
- Quick iteration
- Demo to team on your machine

### 🌐 Deploy For:
- Production use
- Share with remote users
- Customer demos
- Beta testing
- Permanent access

---

## 📦 Deployment Options (When Ready)

### Option 1: Vercel (Recommended for Frontend)
```bash
# Deploy to Vercel
vercel deploy --prod
```

### Option 2: Netlify
```bash
# Deploy to Netlify
netlify deploy --prod
```

### Option 3: One-Command Deploy
```bash
# Use the provided deploy script
./SHIP_IT.sh
```

---

## 🎉 Success Checklist

You're ready to develop when you can:

- [ ] Run `npm run dev` without errors
- [ ] Open `http://localhost:5173` in browser
- [ ] See the BuboIQ landing page
- [ ] Click "Login" and see login form
- [ ] Login with `admin@buboiq.dev` / `BuboIQ2024!Admin`
- [ ] Navigate to `/admin` and see Super Admin Dashboard
- [ ] Navigate to `/early-access-admin` and see Early Access panel
- [ ] No console errors (check browser DevTools)

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Check TypeScript errors

# Supabase
supabase functions deploy make-server    # Deploy Edge Functions
supabase functions list                  # List deployed functions
supabase db push                         # Deploy database schema
supabase migration list                  # List migrations

# Database
supabase db reset        # Reset database (⚠️ destructive)
supabase db diff         # Show database changes

# Testing
npm run lint             # Lint code
./smoke-test.sh          # Run smoke tests (if available)
```

---

## 🔐 Environment Variables Reference

Your environment is configured in `/utils/supabase/info.tsx`:

```typescript
projectId = "ephiymteomxphqnkcsvs"
publicAnonKey = "eyJhbGci..."  // Your anon key
```

The Supabase Edge Functions have access to:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` (for billing)

---

## 🎯 Next Steps After Local Setup

1. ✅ Verify login works
2. ✅ Navigate to `/admin` - see Super Admin Dashboard
3. ✅ Navigate to `/early-access-admin` - create test invite
4. ✅ Test invite redemption flow
5. ✅ Navigate to `/admin/demo-leads` - see demo leads
6. ✅ Test all super admin features
7. ✅ When ready, deploy to production!

---

## 📞 Need Help?

### Check These Files:
- `/SUPER_ADMIN_CREDENTIALS.md` - Full credential guide
- `/SUPER_ADMIN_QUICK_CARD.md` - Quick reference
- `/EARLY_ACCESS_QUICK_START.md` - Early Access setup
- `/DEPLOY_NOW.md` - Deployment instructions

### Common Issues:
- **Can't login?** → Create super admin account first
- **Can't see admin routes?** → Check user role in database
- **Functions not working?** → Deploy Edge Functions
- **Database errors?** → Deploy schema with `supabase db push`

---

**You're all set! Run `npm run dev` and start building!** 🚀
