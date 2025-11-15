# Phase 1 Setup Guide

This guide will help you set up the environment for Phase 1 development and deployment.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Account**: Your code should be in a GitHub repository

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Name**: tractok (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this SECRET!

3. Go to **Project Settings** → **Database**
4. Scroll down to **Connection String** → **URI**
5. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

## Step 3: Set Up Environment Variables

### For Local Development

1. Create a file named `.env.local` in the `tractok` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Database (Use the connection string from Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

2. Replace the placeholder values with your actual Supabase credentials

### For Vercel Deployment

You'll add these same environment variables in the Vercel dashboard during deployment (see Step 5).

## Step 4: Initialize Database with Prisma

Once your environment variables are set up:

```bash
# Navigate to the project directory
cd tractok

# Generate Prisma Client
pnpm db:generate

# Push the schema to your database
pnpm db:push
```

This will create all the necessary tables in your Supabase database.

**Verify it worked:**

1. Go to Supabase Dashboard → **Table Editor**
2. You should see tables like `users`, `tiktok_accounts`, `orders`, etc.

## Step 5: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub:

```bash
git add .
git commit -m "Phase 1 complete: Auth and database setup"
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `tractok`
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`

6. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your `.env.local` file
   - **Important**: Update `NEXT_PUBLIC_APP_URL` to your Vercel URL (you'll get this after first deploy)

7. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
pnpm add -g vercel

# Navigate to project
cd tractok

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? tractok
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add DATABASE_URL
vercel env add DIRECT_URL

# Deploy to production
vercel --prod
```

## Step 6: Update Environment Variables

After your first deployment, you'll receive a production URL (e.g., `https://tractok.vercel.app`).

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Click "Save"
4. Redeploy the project (Vercel → Deployments → Click ⋯ → Redeploy)

## Step 7: Test Your Deployment

1. Visit your production URL
2. Click "Start Free Trial"
3. Create an account with your email
4. Verify you can:
   - Register successfully
   - See the dashboard
   - Navigate between pages
   - Log out and log back in

## Troubleshooting

### Build Fails with "Invalid environment variables"

- Verify all environment variables are set in Vercel
- Make sure there are no extra spaces or quotes
- Check that URLs don't have trailing slashes

### "Failed to create user in database"

- Verify `DATABASE_URL` is correct
- Check that Prisma schema was pushed successfully
- Look at Vercel function logs for detailed error

### Can't connect to Supabase

- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** key, not service role
- Ensure there are no extra quotes or spaces

### Auth redirects not working

- Make sure middleware is deployed (check Vercel → Functions)
- Verify `NEXT_PUBLIC_APP_URL` matches your actual URL
- Clear browser cookies and try again

## Database Management

### View data in Supabase

```bash
# Open Supabase Studio in browser
# Go to your Supabase Dashboard → Table Editor
```

### View data locally

```bash
pnpm db:studio
# Opens Prisma Studio at http://localhost:5555
```

### Make schema changes

```bash
# 1. Update prisma/schema.prisma
# 2. Push changes to database
pnpm db:push

# For production migrations (later):
pnpm db:migrate
```

## Next Steps

Once Phase 1 is deployed and working:

✅ Users can register and log in  
✅ Dashboard is accessible  
✅ Database is connected  
✅ App is live on Vercel

**Ready for Phase 2**: TikTok Account Integration

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs (Supabase Dashboard → Logs)
3. Review the error messages carefully
4. Ensure all environment variables are set correctly

---

**Phase 1 Complete! 🎉**
