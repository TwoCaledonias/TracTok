# Quick Start Guide - Phase 1

**All code is complete!** Follow these steps to get your app running.

## ⚡ 5-Minute Setup

### Step 1: Create Supabase Project (2 minutes)

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - Name: `tractok`
   - Database Password: (generate and save it!)
   - Region: Choose closest to you
4. Click "Create new project" and wait ~2 minutes

### Step 2: Get Your Credentials (1 minute)

Once your project is ready:

1. **API Settings**: Go to Settings → API
   - Copy **Project URL**
   - Copy **anon public key**
   - Copy **service_role key** (keep secret!)

2. **Database URL**: Go to Settings → Database
   - Scroll to "Connection String" → URI
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

### Step 3: Set Up Environment (1 minute)

Create `.env.local` in the `tractok` folder:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx..."
SUPABASE_SERVICE_ROLE_KEY="eyJxxx..."
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

Replace the placeholders with your actual values!

### Step 4: Initialize Database (30 seconds)

```bash
cd tractok
pnpm db:push
```

This creates all the tables. You should see:

```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema
```

### Step 5: Run the App! (10 seconds)

```bash
pnpm dev
```

Open http://localhost:3000 in your browser!

## 🎉 Test It Out

1. Click "Start Free Trial"
2. Enter your email and password
3. Create account
4. You should see the dashboard!
5. Navigate between pages
6. Log out and log back in

## 🚀 Deploy to Vercel (Optional)

See [PHASE1_SETUP.md](./PHASE1_SETUP.md) for detailed deployment instructions.

Quick version:

```bash
# Push to GitHub first
git add .
git commit -m "Phase 1 complete"
git push

# Then go to vercel.com and import your repo
# Add the same environment variables from .env.local
# Click Deploy!
```

## ❓ Common Issues

**"Invalid environment variables"**

- Check for typos in `.env.local`
- Remove any extra quotes or spaces
- Make sure URLs don't have trailing slashes

**"Failed to create user in database"**

- Did you run `pnpm db:push`?
- Check that DATABASE_URL is correct
- Look for error details in the terminal

**Can't see the login page**

- Make sure the dev server is running: `pnpm dev`
- Try http://localhost:3000/login directly
- Clear browser cache and cookies

## 📚 Need More Help?

- Detailed guide: [PHASE1_SETUP.md](./PHASE1_SETUP.md)
- Full summary: [PHASE1_SUMMARY.md](./PHASE1_SUMMARY.md)
- Project docs: [README.md](./README.md)

---

**Ready to build something amazing!** 🚀
