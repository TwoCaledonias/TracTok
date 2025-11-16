# 🔗 Phase 2: TikTok Account Integration

**Started**: November 15, 2025  
**Status**: 🚧 In Progress  
**Goal**: OAuth 2.0 flow, multi-account support, API client framework

---

## 📋 Overview

Phase 2 adds the ability for users to securely connect their TikTok accounts using OAuth 2.0. This is **critical** for the TikTok API application and enables data syncing in future phases.

### What We're Building

1. **TikTok OAuth 2.0 Flow** - Secure account connection
2. **Token Management** - Encrypted storage and auto-refresh
3. **Multi-Account Support** - Connect and switch between accounts
4. **API Client Framework** - Foundation for future data syncing

---

## 🎯 Success Criteria

- ✅ Users can initiate OAuth connection to TikTok
- ✅ OAuth tokens stored securely (encrypted)
- ✅ Token refresh logic handles expiration automatically
- ✅ Users can connect multiple TikTok accounts (based on subscription tier)
- ✅ Account switcher dropdown in dashboard
- ✅ Selected account persists in session
- ✅ API client service with error handling and rate limiting
- ✅ Documentation updated with OAuth setup instructions

---

## 📚 Phase 2 Sub-Tasks

### 2.1 TikTok OAuth Setup

**Research Phase:**

- [ ] Review TikTok for Developers documentation
- [ ] Understand OAuth 2.0 flow requirements
- [ ] Identify required scopes for affiliate data access
- [ ] Document redirect URI requirements

**Implementation:**

- [ ] Register app with TikTok for Developers (manual step)
- [ ] Add TikTok OAuth credentials to environment variables
- [ ] Create OAuth initiation endpoint/route
- [ ] Create OAuth callback handler
- [ ] Implement authorization code exchange
- [ ] Store access and refresh tokens (encrypted)
- [ ] Handle OAuth errors gracefully

**Testing:**

- [ ] Test OAuth flow with test TikTok account
- [ ] Verify tokens are stored correctly
- [ ] Test error scenarios (user denies, network failure)

### 2.2 API Integration Framework

**Token Management:**

- [ ] Create token encryption/decryption utilities
- [ ] Implement token refresh logic (before expiration)
- [ ] Create middleware to check token validity
- [ ] Handle token refresh failures (re-auth required)

**API Client Service:**

- [ ] Create TikTok API client class
- [ ] Implement rate limiting (respect TikTok limits)
- [ ] Add request/response logging
- [ ] Implement retry logic with exponential backoff
- [ ] Create error handling for common API errors
- [ ] Type definitions for TikTok API responses

**Mock Data Structure:**

- [ ] Create mock data matching TikTok API format
- [ ] Use mocks for development/testing
- [ ] Document API endpoints we'll use in Phase 3+

**Testing:**

- [ ] Unit tests for token refresh logic
- [ ] Unit tests for rate limiting
- [ ] Unit tests for error handling
- [ ] Mock API responses for testing

### 2.3 Multi-Account Support

**Database Updates:**

- [ ] Verify TikTokAccounts model supports multiple accounts per user
- [ ] Add fields for account nickname/display name
- [ ] Add account status field (active, expired, error)

**UI Components:**

- [ ] Create "Connect TikTok Account" button in Settings
- [ ] Build account switcher dropdown component
- [ ] Show account list with status indicators
- [ ] Add "Disconnect Account" functionality
- [ ] Display current account in header/nav

**Session Management:**

- [ ] Store selected account ID in user session
- [ ] Create utility to get current selected account
- [ ] Handle case when no account is selected
- [ ] Auto-select first account if only one exists

**Subscription Enforcement:**

- [ ] Check user subscription tier before allowing connection
- [ ] Block connection if tier limit reached
- [ ] Prompt upgrade if user tries to exceed limit
- [ ] Display remaining account slots in UI

**Testing:**

- [ ] E2E test: Connect first TikTok account
- [ ] E2E test: Switch between accounts
- [ ] E2E test: Disconnect account
- [ ] E2E test: Try to exceed tier limit
- [ ] Test session persistence across page loads

---

## 🏗️ Technical Architecture

### OAuth Flow Diagram

```
User                  TracTok                    TikTok
  |                      |                         |
  | Click "Connect"      |                         |
  |--------------------->|                         |
  |                      |                         |
  |                      | Redirect to TikTok Auth |
  |                      |------------------------>|
  |                      |                         |
  |                      |    User grants access   |
  |                      |<------------------------|
  |                      |                         |
  |   Redirect callback  |                         |
  |<---------------------|                         |
  |                      |                         |
  |  Exchange code       |                         |
  |--------------------->|                         |
  |                      | Request tokens          |
  |                      |------------------------>|
  |                      |                         |
  |                      | Return tokens           |
  |                      |<------------------------|
  |                      |                         |
  |   Store encrypted    |                         |
  |   Success message    |                         |
  |<---------------------|                         |
```

### Token Storage Strategy

**Encryption:**

- Use AES-256-GCM for token encryption
- Store encryption key in environment variable (never committed)
- Encrypt both access and refresh tokens
- Store encrypted values in `TikTokAccounts.accessToken` and `refreshToken`

**Token Refresh:**

- Check token expiration before each API call
- Refresh if within 5 minutes of expiration
- Update database with new tokens
- Handle refresh failures (require re-auth)

### File Structure

New files to create:

```
src/
├── app/
│   ├── api/
│   │   └── tiktok/
│   │       ├── connect/route.ts          # Initiate OAuth
│   │       ├── callback/route.ts         # OAuth callback
│   │       └── disconnect/route.ts       # Disconnect account
│   └── actions/
│       └── tiktok.ts                     # Server actions for account management
├── lib/
│   ├── tiktok/
│   │   ├── client.ts                     # TikTok API client
│   │   ├── oauth.ts                      # OAuth utilities
│   │   ├── tokens.ts                     # Token encryption/refresh
│   │   ├── types.ts                      # TypeScript types
│   │   └── mock-data.ts                  # Mock API responses
│   └── crypto.ts                         # Encryption utilities
├── components/
│   └── features/
│       ├── account-switcher.tsx          # Account dropdown
│       └── connect-account.tsx           # Connect button & UI
└── hooks/
    └── use-selected-account.ts           # Hook for current account
```

---

## 🔐 Security Considerations

### Token Storage

- ✅ Never store tokens in localStorage or cookies
- ✅ Encrypt tokens at rest in database
- ✅ Use environment variable for encryption key
- ✅ Rotate encryption key periodically (production)
- ✅ Use separate encryption keys per environment

### OAuth Security

- ✅ Validate state parameter to prevent CSRF
- ✅ Use PKCE (Proof Key for Code Exchange) if supported
- ✅ Validate redirect URI matches registered URI
- ✅ Check token signature/validity
- ✅ Handle token revocation

### API Client Security

- ✅ Never expose tokens to client-side
- ✅ All API calls happen server-side
- ✅ Rate limit requests to prevent abuse
- ✅ Log suspicious activity
- ✅ Validate all API responses

---

## 📦 Dependencies to Add

```json
{
  "dependencies": {
    "crypto-js": "^4.2.0", // For token encryption (or use native crypto)
    "axios": "^1.6.0", // For API requests (alternative to fetch)
    "date-fns": "^2.30.0" // For date handling (token expiration)
  },
  "devDependencies": {
    "@types/crypto-js": "^4.2.0"
  }
}
```

**Note**: We may use Node's native `crypto` module instead of crypto-js to reduce dependencies.

---

## 🌐 Environment Variables

New variables needed:

```bash
# TikTok OAuth Configuration
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_REDIRECT_URI=https://tractok.vercel.app/api/tiktok/callback

# For local development
# TIKTOK_REDIRECT_URI=http://localhost:3000/api/tiktok/callback

# Token Encryption
TIKTOK_ENCRYPTION_KEY=your_secure_random_key_here  # Generate with: openssl rand -base64 32
```

---

## 📝 TikTok Developer Application Notes

### What You'll Need

1. **TikTok Developer Account**: Register at https://developers.tiktok.com/
2. **App Registration**: Create a new app
3. **Scopes Required**:
   - `user.info.basic` - Get user profile
   - `video.list` - Access to videos (if needed)
   - May need additional scopes for Shop/Affiliate data (TBD)
4. **Redirect URI**: Must match exactly what's registered
5. **App Review**: May need to submit for review to access certain scopes

### Application Timeline

- App registration: Instant
- Basic scopes: Usually immediate
- Advanced scopes (Shop data): May require review (1-2 weeks)
- **Strategy**: Start with mock data, integrate real API after approval

---

## 🧪 Testing Strategy

### Unit Tests

- Token encryption/decryption
- Token refresh logic
- Rate limiting logic
- API error handling

### E2E Tests

- Complete OAuth flow
- Multi-account connection
- Account switching
- Disconnect account
- Tier limit enforcement

### Manual Testing

- Test with real TikTok account
- Verify tokens stored correctly
- Test token expiration handling
- Test error scenarios

---

## 📊 Database Schema Updates

The `TikTokAccounts` model is already defined in Phase 1. Verify it includes:

```prisma
model TikTokAccount {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Account identification
  tiktokUserId      String   @unique
  tiktokUsername    String
  displayName       String?  // User-friendly nickname
  avatarUrl         String?

  // OAuth tokens (encrypted)
  accessToken       String   // Encrypted access token
  refreshToken      String   // Encrypted refresh token
  tokenExpiresAt    DateTime

  // Account status
  status            String   @default("active") // active, expired, error
  lastSyncAt        DateTime?

  // Metadata
  connectedAt       DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  orders            Order[]
  dailyRevenue      DailyRevenue[]
  withdrawals       Withdrawal[]
  rewards           Reward[]

  @@index([userId])
  @@index([tiktokUserId])
}
```

**Update if needed**: Add `displayName` and `status` fields if missing.

---

## 🎨 UI Updates

### Settings Page

- Add "Connected Accounts" section
- Show list of connected accounts with status
- "Connect New Account" button (check tier limit)
- "Disconnect" button for each account
- Visual indicators for account status

### Dashboard Header/Navigation

- Add account switcher dropdown (if multiple accounts)
- Show current account name and avatar
- Quick access to account settings

### Empty States

- When no accounts connected: Prominent CTA to connect
- Show benefits of connecting account
- Link to help documentation

---

## 📈 Progress Tracking

```
Phase 2: TikTok Integration              ░░░░░░░░░░░░░░░░░░░░   0%
  ├─ 2.1 OAuth Setup                     ░░░░░░░░░░░░░░░░░░░░   0%
  ├─ 2.2 API Client Framework            ░░░░░░░░░░░░░░░░░░░░   0%
  └─ 2.3 Multi-Account Support           ░░░░░░░░░░░░░░░░░░░░   0%
```

---

## ⏭️ What's Next After Phase 2

### Phase 3: Order Tracking

- Sync order data from TikTok API
- Display orders in table
- Search, filter, sort functionality
- Order detail pages

Phase 2 builds the foundation for all data syncing!

---

## 🚀 Let's Get Started!

### Step 1: TikTok Developer Setup

We'll need to register the app with TikTok. This requires:

- Your TikTok account
- Basic app information
- Redirect URIs

### Step 2: Mock Data First

While waiting for API approval, we'll:

- Build the OAuth flow UI
- Use mock tokens for testing
- Implement the account management features
- Create the API client with mock responses

### Step 3: Real Integration

Once approved:

- Add real credentials
- Test with live TikTok account
- Verify data sync works

---

## 💬 Questions Before We Start

1. **Do you have a TikTok Developer account?**
   - If yes: Great! We'll need your client credentials
   - If no: We can create one together

2. **Should we start with mock data or wait for API approval?**
   - Recommendation: Build with mocks, switch to real API later

3. **Any specific TikTok account connection UX preferences?**
   - Simple button in settings?
   - Onboarding flow after registration?

---

**Ready to build Phase 2!** 🎉

Let me know if you have any questions or want to adjust the approach!
