# 🚀 Phase 2 Quick Start Guide

**TikTok Account Integration - Get Started in 10 Minutes**

---

## ✅ Prerequisites

Before you start, make sure you have:

- Phase 1 deployed and working (authentication, database)
- TikTok developer account (optional for testing, required for production)
- Node.js and pnpm installed

---

## 🔧 Step 1: Generate Encryption Key (2 minutes)

Run this command to generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output - you'll need it for the next step.

---

## 🌐 Step 2: Add Environment Variables (3 minutes)

Add these to your `.env.local` file:

```bash
# TikTok OAuth (Optional for local testing without real credentials)
TIKTOK_CLIENT_KEY=optional_for_now
TIKTOK_CLIENT_SECRET=optional_for_now
TIKTOK_REDIRECT_URI=http://localhost:3000/api/tiktok/callback

# Token Encryption (REQUIRED)
TIKTOK_ENCRYPTION_KEY=paste_your_generated_key_here
```

**Note**: You can test the UI without real TikTok credentials. The OAuth flow will fail gracefully.

---

## 🗄️ Step 3: Update Database (1 minute)

Phase 2 uses the existing `TikTokAccounts` table from Phase 1, so no migration needed!

Verify the schema is up to date:

```bash
cd tractok
pnpm db:push
```

---

## 🏃 Step 4: Start Development Server (1 minute)

```bash
cd tractok
pnpm dev
```

Visit: http://localhost:3000

---

## 🧪 Step 5: Test the UI (3 minutes)

### Without Real TikTok Credentials

1. **Navigate to Settings**: http://localhost:3000/settings
2. **View the Connected Accounts section** - it should show "No TikTok accounts connected yet"
3. **Check the navigation sidebar** - account switcher should NOT appear (no accounts)

### With Real TikTok Credentials

1. **Register TikTok App**: https://developers.tiktok.com/
   - Create new app
   - Add redirect URI: `http://localhost:3000/api/tiktok/callback`
   - Copy Client Key and Client Secret

2. **Update .env.local** with real credentials

3. **Test OAuth Flow**:
   - Go to Settings page
   - Click "Connect TikTok Account"
   - Complete OAuth on TikTok
   - You'll be redirected back to settings with account connected

4. **Test Account Switcher**:
   - Connect a second account (if your tier allows)
   - Account switcher dropdown appears in sidebar
   - Switch between accounts

---

## 📦 What's Working Now

### ✅ Features Ready

- **Settings Page**: Connected Accounts section with status indicators
- **Account Management**: Connect/disconnect TikTok accounts
- **Multi-Account Support**: Switch between accounts via dropdown
- **Tier Enforcement**: Respects subscription limits (1, 3, or 5 accounts)
- **Security**: Tokens encrypted at rest, CSRF protection, auto-refresh

### 🎨 UI Components

- Connected accounts card with visual status
- Account switcher dropdown in navigation
- Loading states and error handling
- Empty states with helpful messaging

---

## 🔐 Optional: Register TikTok App

If you want to test with real TikTok OAuth:

### 1. Create TikTok Developer Account

Visit: https://developers.tiktok.com/

### 2. Register Your App

1. Go to "Apps" → "Create an app"
2. Fill in app details:
   - **App Name**: TracTok (or your choice)
   - **App Description**: TikTok Shop affiliate tracker
   - **Category**: Business Tools

### 3. Configure OAuth Settings

1. Add redirect URI: `http://localhost:3000/api/tiktok/callback`
2. Request scopes:
   - `user.info.basic` - Get user profile
   - `user.info.profile` - Get user details
   - Additional scopes for affiliate data (when available)

### 4. Get Credentials

1. Copy **Client Key**
2. Copy **Client Secret**
3. Add to `.env.local`

### 5. Test OAuth Flow

1. Visit http://localhost:3000/settings
2. Click "Connect TikTok Account"
3. Authorize on TikTok
4. Should redirect back with account connected

---

## 🚀 Deploy to Vercel (Optional)

If you want to deploy Phase 2:

### 1. Update Environment Variables

In Vercel dashboard, add:

```
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=https://tractok.vercel.app/api/tiktok/callback
TIKTOK_ENCRYPTION_KEY=your_32_char_key
```

**Important**: Generate a NEW encryption key for production!

### 2. Update TikTok App Settings

Add production redirect URI in TikTok developer portal:

```
https://tractok.vercel.app/api/tiktok/callback
```

### 3. Deploy

```bash
git add .
git commit -m "feat: Phase 2 - TikTok Account Integration"
git push
```

Vercel will auto-deploy!

---

## 🧪 Testing Checklist

### Basic UI Tests (No Credentials)

- [ ] Settings page loads without errors
- [ ] Connected Accounts card displays
- [ ] Shows "No accounts connected" message
- [ ] Account switcher NOT visible in sidebar

### OAuth Flow Tests (With Credentials)

- [ ] Click "Connect" redirects to TikTok
- [ ] Completing OAuth redirects back to settings
- [ ] Account appears in connected accounts list
- [ ] Status shows as "Active"
- [ ] Last sync date shows "Never"

### Multi-Account Tests

- [ ] Connect second account (if tier allows)
- [ ] Account switcher appears in sidebar
- [ ] Can switch between accounts
- [ ] Selection persists across page reloads

### Error Handling Tests

- [ ] Try to connect beyond tier limit
- [ ] Shows upgrade message
- [ ] Connect button disabled when at limit
- [ ] Disconnect confirmation dialog works

---

## ❓ Troubleshooting

### "TikTok OAuth not configured" error

**Solution**: Add TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET to `.env.local`

### "Invalid encryption key" error

**Solution**: Make sure TIKTOK_ENCRYPTION_KEY is at least 32 characters

### OAuth redirect fails

**Solution**:

1. Check TIKTOK_REDIRECT_URI matches exactly in TikTok developer portal
2. Make sure redirect URI includes `http://` or `https://`
3. For localhost, use `http://localhost:3000/api/tiktok/callback`

### Account shows as "Expired"

**Solution**:

- Token may have expired (normal after 24-48 hours)
- Disconnect and reconnect the account
- Token refresh will happen automatically on next use

---

## 📝 Files Modified in Phase 2

**New files**: 13  
**Modified files**: 3

### Key Files to Know

- `src/lib/tiktok/oauth.ts` - OAuth flow logic
- `src/lib/tiktok/tokens.ts` - Token management
- `src/lib/tiktok/client.ts` - API client
- `src/app/api/tiktok/connect/route.ts` - OAuth initiation
- `src/app/api/tiktok/callback/route.ts` - OAuth callback
- `src/components/features/connected-accounts.tsx` - Account management UI
- `src/components/features/account-switcher.tsx` - Account dropdown

---

## 🎯 What's Next: Phase 3

After Phase 2 is working:

- **Order Tracking**: Sync and display TikTok Shop orders
- **Order Search**: Filter by date, product, status
- **Commission Calculations**: Track estimated and actual commissions
- **Order Details**: View complete order history

---

## 💬 Need Help?

### Check Logs

```bash
# In browser console (F12)
# Look for TikTok OAuth errors

# In terminal (where dev server is running)
# Look for server-side errors
```

### Common Issues

1. **TypeError: Cannot read properties of undefined**
   - Usually means environment variables not loaded
   - Restart dev server after changing `.env.local`

2. **401 Unauthorized**
   - Check TikTok credentials are correct
   - Make sure scopes are approved in TikTok developer portal

3. **CSRF state validation failed**
   - Clear cookies and try again
   - Check system time is correct

---

## ✅ Success Criteria

You'll know Phase 2 is working when:

- ✅ Settings page loads without errors
- ✅ Can see "Connected Accounts" section
- ✅ Can click "Connect TikTok Account" (even if it fails gracefully)
- ✅ UI is responsive and looks good
- ✅ No console errors on page load

**With real credentials:**

- ✅ OAuth flow completes successfully
- ✅ Account appears in connected list
- ✅ Can disconnect account
- ✅ Account switcher works

---

## 🎉 You're Ready!

Phase 2 is complete and ready to test. The foundation is set for Phase 3 where we'll actually sync and display TikTok Shop data!

**Next Steps:**

1. Test the UI locally
2. Apply for TikTok API access (if not done)
3. Deploy to production (optional)
4. Get ready for Phase 3: Order Tracking

---

**Quick Commands Cheat Sheet:**

```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Start dev server
cd tractok && pnpm dev

# Type check
pnpm run type-check

# Lint
pnpm run lint

# Update database
pnpm db:push
```

---

**Status**: ✅ Phase 2 Complete and Ready for Testing!
