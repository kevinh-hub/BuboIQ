# ⚡ START HERE - BuboIQ Quick Start

## 🚀 **3 Commands to Start Developing**

```bash
npm install                           # 1️⃣ Install dependencies
supabase functions deploy make-server # 2️⃣ Deploy backend API
npm run dev                           # 3️⃣ Start local dev server
```

**Then open:** `http://localhost:5173`

---

## 🔑 **Login Credentials**

```
Email:    admin@buboiq.dev
Password: BuboIQ2024!Admin
```

---

## ❌ **If Login Fails**

The super admin account doesn't exist yet. Create it:

### Quick Fix (30 seconds):

1. **Sign up** with credentials above
2. **Go to:** https://supabase.com/dashboard/project/ephiymteomxphqnkcsvs/sql
3. **Run this SQL:**
   ```sql
   UPDATE users SET role = 'super_admin' WHERE email = 'admin@buboiq.dev';
   ```
4. **Refresh browser** and login!

---

## 📍 **Where to Go After Login**

| URL | What It Is |
|-----|-----------|
| `/admin` | Super Admin Dashboard |
| `/early-access-admin` | Early Access Management |
| `/admin/demo-leads` | Demo Leads Panel |
| `/dashboard` | Main Dashboard |
| `/devices` | Device Management |
| `/tickets` | Support Tickets |

---

## 🔧 **Check Your Setup**

```bash
chmod +x check-setup.sh
./check-setup.sh
```

This shows what's configured and what needs setup.

---

## 📚 **Need More Details?**

- **`/RUN_LOCALLY.md`** - Simple local dev guide
- **`/LOCAL_DEVELOPMENT_QUICKSTART.md`** - Detailed setup
- **`/LOCAL_VS_DEPLOYED.md`** - Architecture explained
- **`/SUPER_ADMIN_CREDENTIALS.md`** - Full credential guide

---

## ❓ **Common Questions**

### Do I need to deploy to login?
**No!** Run `npm run dev` and login locally.

### Where is the backend?
Already deployed to **Supabase Cloud** (`ephiymteomxphqnkcsvs`)

### Where is the database?
Already on **Supabase Cloud** (same project)

### Can I test everything locally?
**Yes!** Frontend runs locally, backend/database in cloud.

---

## 🎯 **Next Steps**

1. ✅ Run `npm run dev`
2. ✅ Create super admin account
3. ✅ Navigate to `/early-access-admin`
4. ✅ Create your first early access invite!
5. ✅ Test the platform

---

## 🆘 **Need Help?**

Run the setup checker:
```bash
./check-setup.sh
```

It will tell you exactly what's missing!

---

**That's it! You're ready to develop.** 🎉

**Just run:** `npm run dev`
