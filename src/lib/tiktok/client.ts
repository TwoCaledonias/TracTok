/**
 * TikTok API Client
 * Handles all API requests to TikTok with rate limiting, retries, and error handling
 */

import type {
  TikTokApiClientConfig,
  ApiRequestOptions,
  RateLimitInfo,
  TikTokApiResponse,
} from "./types";

/**
 * TikTok API Base URL
 */
const TIKTOK_API_BASE_URL = "https://open.tiktokapis.com";

/**
 * Rate limit tracking
 * In production, use Redis or similar for distributed rate limiting
 */
const rateLimitStore = new Map<string, RateLimitInfo>();

/**
 * TikTok API Client
 */
export class TikTokApiClient {
  private accessToken: string;
  private baseUrl: string;

  constructor(config: TikTokApiClientConfig) {
    this.accessToken = config.accessToken;
    this.baseUrl = config.baseUrl || TIKTOK_API_BASE_URL;
  }

  /**
   * Make an API request
   */
  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, retries = 3 } = options;

    // Check rate limits
    await this.checkRateLimit(endpoint);

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
      ...headers,
    };

    let lastError: Error | null = null;

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });

        // Update rate limit info from response headers
        this.updateRateLimitFromHeaders(endpoint, response.headers);

        if (!response.ok) {
          // Handle specific HTTP errors
          if (response.status === 401) {
            throw new TikTokApiError(
              "Unauthorized - Token may be expired",
              "UNAUTHORIZED",
              response.status
            );
          }

          if (response.status === 429) {
            // Rate limited - wait and retry
            const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
            await this.sleep(retryAfter * 1000);
            continue;
          }

          if (response.status >= 500) {
            // Server error - retry
            throw new TikTokApiError("TikTok API server error", "SERVER_ERROR", response.status);
          }

          // Client error - don't retry
          const errorData = await response.json();
          throw new TikTokApiError(
            errorData.error?.message || "API request failed",
            errorData.error?.code || "API_ERROR",
            response.status
          );
        }

        const data: TikTokApiResponse<T> = await response.json();

        // Check for API-level errors
        if (data.error && data.error.code !== "ok") {
          throw new TikTokApiError(data.error.message, data.error.code, response.status);
        }

        return data.data;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (
          error instanceof TikTokApiError &&
          (error.code === "UNAUTHORIZED" || error.statusCode < 500)
        ) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    // All retries failed
    throw lastError || new Error("API request failed after retries");
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body: Record<string, unknown>,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  /**
   * Check rate limits before making request
   */
  private async checkRateLimit(endpoint: string): Promise<void> {
    const rateLimitKey = this.getRateLimitKey(endpoint);
    const rateLimit = rateLimitStore.get(rateLimitKey);

    if (!rateLimit) {
      return; // No rate limit info yet
    }

    // Check if we have remaining requests
    if (rateLimit.remaining <= 0) {
      // Check if rate limit has reset
      const now = Date.now() / 1000;
      if (now < rateLimit.reset) {
        // Wait until reset
        const waitTime = (rateLimit.reset - now) * 1000;
        console.log(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)}s...`);
        await this.sleep(waitTime);
      }
    }
  }

  /**
   * Update rate limit info from response headers
   */
  private updateRateLimitFromHeaders(endpoint: string, headers: Headers): void {
    const limit = headers.get("X-Rate-Limit-Limit");
    const remaining = headers.get("X-Rate-Limit-Remaining");
    const reset = headers.get("X-Rate-Limit-Reset");

    if (limit && remaining && reset) {
      const rateLimitKey = this.getRateLimitKey(endpoint);
      rateLimitStore.set(rateLimitKey, {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
      });
    }
  }

  /**
   * Get rate limit key for an endpoint
   */
  private getRateLimitKey(endpoint: string): string {
    // Extract base endpoint (e.g., "/v2/user/info/" from "/v2/user/info/?fields=...")
    const baseEndpoint = endpoint.split("?")[0];
    return `${this.accessToken.substring(0, 10)}-${baseEndpoint}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Custom error class for TikTok API errors
 */
export class TikTokApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "TikTokApiError";
  }
}

/**
 * Create an API client for a specific access token
 */
export function createTikTokClient(accessToken: string): TikTokApiClient {
  return new TikTokApiClient({ accessToken });
}
