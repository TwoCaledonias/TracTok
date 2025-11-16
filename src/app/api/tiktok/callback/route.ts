/**
 * TikTok OAuth Callback Route
 * Handles the OAuth callback from TikTok after user grants access
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens, getUserInfo, validateState } from "@/lib/tiktok/oauth";
import { storeTokens } from "@/lib/tiktok/tokens";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Check if user is authenticated
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/settings?error=oauth_error&message=${encodeURIComponent(errorDescription || error)}`,
        request.url
      )
    );
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(new URL("/settings?error=invalid_callback", request.url));
  }

  // Validate CSRF state
  const savedState = request.cookies.get("tiktok_oauth_state")?.value;
  if (!savedState || !validateState(state, savedState)) {
    return NextResponse.redirect(new URL("/settings?error=invalid_state", request.url));
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await exchangeCodeForTokens(code);

    // Get user information
    const userInfo = await getUserInfo(tokenResponse.access_token);

    // Store tokens in database (encrypted)
    await storeTokens(
      session.user.id,
      userInfo.open_id,
      userInfo.display_name || userInfo.open_id,
      userInfo.display_name || null,
      tokenResponse.access_token,
      tokenResponse.refresh_token,
      tokenResponse.expires_in
    );

    // Clear state cookie
    const response = NextResponse.redirect(
      new URL("/settings?success=account_connected", request.url)
    );
    response.cookies.delete("tiktok_oauth_state");

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);

    // Clear state cookie even on error
    const response = NextResponse.redirect(
      new URL(
        `/settings?error=connection_failed&message=${encodeURIComponent(
          error instanceof Error ? error.message : "Unknown error"
        )}`,
        request.url
      )
    );
    response.cookies.delete("tiktok_oauth_state");

    return response;
  }
}
