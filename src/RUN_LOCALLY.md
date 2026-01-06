# 🚀 Run BuboIQ Locally - Ultra Simple Guide

## ❓ **Do I Need to Deploy to Login?**

**NO!** You can run everything locally on your machine.

---

## 🏃 **3-Step Quick Start**

```bash
# Step 1: Install dependencies (first time only)
npm install

# Step 2: Deploy backend to Supabase (first time only)
supabase functions deploy make-server

# Step 3: Start local dev server
npm run dev
```

**Then open:** `http://localhost:5173`

**Login with:**
- Email: `admin@buboiq.dev`
- Password: `BuboIQ2024!Admin`

---

## 🔧 **If Login Doesn't Work**

The super admin account needs to be created first:

### Quick Fix:

1. **Sign up** on the login page with:
   - Email: `admin@buboiq.dev`
   - Password: `BuboIQ2024!Admin`

2. **Run this SQL** in [Supabase SQL Editor](https://supabase.com/dashboard/project/ephiymteomxphqnkcsvs/sql):
   ```sql
   UPDATE users 
   SET role = 'super_admin' 
   WHERE email = 'admin@buboiq.dev';
   ```

3. **Refresh** your browser and login!

---

## ✅ **Verify Setup Status**

Run this to check what's configured:

```bash
chmod +x check-setup.sh
./check-setup.sh
```

---

## 📍 **What Each Command Does**

| Command | What It Does | When to Run |
|---------|--------------|-------------|
| `npm install` | Downloads code dependencies | Once (or after pulling new code) |
| `supabase db push` | Sets up database tables | Once (or after schema changes) |
| `supabase functions deploy make-server` | Deploys backend API | Once (or after backend changes) |
| `npm run dev` | Starts local web server | Every time you want to develop |

---

## 🌐 **Local vs Deployed**

### Running Locally (What You're Doing Now):
- ✅ Frontend runs on your computer (`http://localhost:5173`)
- ✅ Backend runs on Supabase cloud (Edge Functions)
- ✅ Database runs on Supabase cloud (Postgres)
- ✅ Only accessible from your machine
- ✅ Perfect for development and testing

### Deployed (For Production):
- 🌐 Frontend runs on Vercel/Netlify (accessible to anyone)
- 🌐 Backend runs on Supabase cloud (same)
- 🌐 Database runs on Supabase cloud (same)
- 🌐 Accessible via public URL
- 🌐 Required for users/customers to access

**Bottom Line:** Backend is already "deployed" to Supabase cloud. You're just running the frontend locally!

---

## 🎯 **Your Current Setup**

Based on your files, you have:

- ✅ **Supabase Project:** `ephiymteomxphqnkcsvs`
- ✅ **Code:** All components ready
- ✅ **Database Schema:** Ready to deploy
- ✅ **Edge Functions:** Ready to deploy
- ✅ **Super Admin Credentials:** Documented

**You're ready to run locally!**

---

## 🚨 **Common Issues**

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Function not found" errors
```bash
supabase functions deploy make-server
```

### "Table does not exist" errors
```bash
supabase db push
```

### "Invalid credentials" errors
- Create super admin account (see "If Login Doesn't Work" above)

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

---

## 📚 **More Documentation**

- **`/LOCAL_DEVELOPMENT_QUICKSTART.md`** - Detailed setup guide
- **`/SUPER_ADMIN_CREDENTIALS.md`** - Full credential reference
- **`/SUPER_ADMIN_QUICK_CARD.md`** - Quick credential card
- **`/check-setup.sh`** - Automated setup checker

---

## 🎉 **You're All Set!**

To start developing:

```bash
npm run dev
```

Then open `http://localhost:5173` and login!

**No deployment needed.** 🚀
