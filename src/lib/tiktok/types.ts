/**
 * TypeScript types for TikTok API integration
 * Based on TikTok for Developers API documentation
 */

// ============================================================================
// OAuth Types
// ============================================================================

export interface TikTokOAuthConfig {
  clientKey: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface TikTokTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // Seconds until expiration
  token_type: string; // Usually "Bearer"
  scope: string;
  open_id: string; // TikTok user ID
}

export interface TikTokRefreshTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  open_id: string;
}

export interface TikTokUserInfo {
  open_id: string;
  union_id?: string;
  avatar_url?: string;
  avatar_url_100?: string;
  avatar_large_url?: string;
  display_name?: string;
  bio_description?: string;
  profile_deep_link?: string;
  is_verified?: boolean;
  follower_count?: number;
  following_count?: number;
  likes_count?: number;
  video_count?: number;
}

export interface TikTokError {
  error: string;
  error_description?: string;
  log_id?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface TikTokApiResponse<T> {
  data: T;
  error: TikTokApiError;
}

export interface TikTokApiError {
  code: string;
  message: string;
  log_id: string;
}

// ============================================================================
// Shop/Affiliate Data Types (To be refined after API access)
// ============================================================================

/**
 * Order data from TikTok Shop
 * This is a preliminary structure - will be updated based on actual API
 */
export interface TikTokOrder {
  order_id: string;
  create_time: number; // Unix timestamp
  update_time: number;
  product_name: string;
  product_id: string;
  product_price: number;
  quantity: number;
  commission_rate: number; // Percentage as decimal (e.g., 0.10 for 10%)
  commission_amount: number;
  status: TikTokOrderStatus;
  delivery_time?: number;
  settlement_time?: number;
}

export type TikTokOrderStatus =
  | "UNPAID"
  | "AWAITING_SHIPMENT"
  | "AWAITING_COLLECTION"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

/**
 * Daily revenue data
 */
export interface TikTokDailyRevenue {
  date: string; // YYYY-MM-DD
  total_amount: number;
  order_ids: string[];
  order_count: number;
}

/**
 * Withdrawal data
 */
export interface TikTokWithdrawal {
  withdrawal_id: string;
  create_time: number;
  total_amount: number;
  service_fee: number;
  actual_amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

/**
 * Reward data
 */
export interface TikTokReward {
  reward_id: string;
  reward_time: number;
  reward_amount: number;
  reward_type: string;
  description?: string;
  paid_time?: number;
}

// ============================================================================
// Internal Types for TracTok
// ============================================================================

/**
 * Connected TikTok account with decrypted tokens
 */
export interface ConnectedAccount {
  id: string;
  tiktokUserId: string;
  tiktokUsername: string;
  tiktokDisplayName: string | null;
  accessToken: string; // Decrypted
  refreshToken: string | null; // Decrypted
  tokenExpiresAt: Date | null;
  isActive: boolean;
  lastSyncedAt: Date | null;
}

/**
 * Account status for UI display
 */
export type AccountStatus = "active" | "expired" | "error" | "syncing";

export interface AccountDisplayInfo {
  id: string;
  username: string;
  displayName: string | null;
  status: AccountStatus;
  lastSynced: Date | null;
}

// ============================================================================
// API Client Types
// ============================================================================

export interface TikTokApiClientConfig {
  accessToken: string;
  baseUrl?: string;
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  retries?: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}
