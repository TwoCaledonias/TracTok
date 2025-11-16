/**
 * TikTok OAuth 2.0 utilities
 * Handles the OAuth flow for connecting TikTok accounts
 */

import { env } from "@/lib/env";
import type {
  TikTokOAuthConfig,
  TikTokTokenResponse,
  TikTokRefreshTokenResponse,
  TikTokUserInfo,
} from "./types";

// TikTok OAuth endpoints
const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize";
const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";

/**
 * Get OAuth configuration from environment
 */
function getOAuthConfig(): TikTokOAuthConfig | null {
  const clientKey = env.TIKTOK_CLIENT_KEY;
  const clientSecret = env.TIKTOK_CLIENT_SECRET;
  const redirectUri = env.TIKTOK_REDIRECT_URI;

  if (!clientKey || !clientSecret || !redirectUri) {
    console.warn("⚠️  TikTok OAuth credentials not configured");
    return null;
  }

  return {
    clientKey,
    clientSecret,
    redirectUri,
    // Scopes needed for affiliate data
    // NOTE: These may need to be adjusted based on actual TikTok API documentation
    scope: [
      "user.info.basic",
      "user.info.profile",
      "user.info.stats",
      // Add affiliate/shop scopes when available
      // "shop.order.readonly",
      // "shop.fulfillment.readonly",
    ],
  };
}

/**
 * Generate the OAuth authorization URL
 * User will be redirected to this URL to grant access
 */
export function getAuthorizationUrl(state?: string): string | null {
  const config = getOAuthConfig();
  if (!config) {
    return null;
  }

  // Generate a random state for CSRF protection if not provided
  const csrfState = state || generateRandomState();

  const params = new URLSearchParams({
    client_key: config.clientKey,
    scope: config.scope.join(","),
    response_type: "code",
    redirect_uri: config.redirectUri,
    state: csrfState,
  });

  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<TikTokTokenResponse> {
  const config = getOAuthConfig();
  if (!config) {
    throw new Error("TikTok OAuth not configured");
  }

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      client_key: config.clientKey,
      client_secret: config.clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Token exchange failed:", error);
    throw new Error(
      `Failed to exchange code for tokens: ${error.error_description || "Unknown error"}`
    );
  }

  const data = await response.json();
  return data.data as TikTokTokenResponse;
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<TikTokRefreshTokenResponse> {
  const config = getOAuthConfig();
  if (!config) {
    throw new Error("TikTok OAuth not configured");
  }

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      client_key: config.clientKey,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Token refresh failed:", error);
    throw new Error(`Failed to refresh token: ${error.error_description || "Unknown error"}`);
  }

  const data = await response.json();
  return data.data as TikTokRefreshTokenResponse;
}

/**
 * Get user information using access token
 */
export async function getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
  const response = await fetch(TIKTOK_USER_INFO_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to get user info:", error);
    throw new Error(`Failed to get user info: ${error.error?.message || "Unknown error"}`);
  }

  const data = await response.json();
  return data.data.user as TikTokUserInfo;
}

/**
 * Calculate token expiration date
 */
export function calculateTokenExpiration(expiresIn: number): Date {
  // expiresIn is in seconds, convert to milliseconds
  const expirationMs = Date.now() + expiresIn * 1000;
  return new Date(expirationMs);
}

/**
 * Check if token is expired or will expire soon
 * @param expiresAt - Token expiration date
 * @param bufferMinutes - Minutes before expiration to consider token expired (default 5)
 */
export function isTokenExpired(expiresAt: Date | null, bufferMinutes = 5): boolean {
  if (!expiresAt) {
    return true;
  }

  const bufferMs = bufferMinutes * 60 * 1000;
  const now = Date.now();
  const expirationWithBuffer = expiresAt.getTime() - bufferMs;

  return now >= expirationWithBuffer;
}

/**
 * Generate a random state string for CSRF protection
 */
export function generateRandomState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Validate OAuth state parameter (CSRF protection)
 */
export function validateState(receivedState: string, expectedState: string): boolean {
  return receivedState === expectedState;
}
