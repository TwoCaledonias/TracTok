/**
 * TikTok OAuth Connect Route
 * Initiates the OAuth flow by redirecting to TikTok authorization page
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthorizationUrl, generateRandomState } from "@/lib/tiktok/oauth";
import { canConnectMoreAccounts } from "@/lib/tiktok/tokens";

export async function GET() {
  try {
    // Check if user is authenticated
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can connect more accounts
    const canConnect = await canConnectMoreAccounts(session.user.id);
    if (!canConnect) {
      return NextResponse.json(
        {
          error:
            "Account limit reached. Please upgrade your subscription to connect more accounts.",
        },
        { status: 403 }
      );
    }

    // Generate CSRF state token
    const state = generateRandomState();

    // Store state in session/cookie for validation in callback
    // For simplicity, we'll use a cookie with httpOnly flag
    const response = NextResponse.redirect(
      getAuthorizationUrl(state) || "/settings?error=oauth_not_configured"
    );

    // Set state cookie (expires in 10 minutes)
    response.cookies.set("tiktok_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OAuth connect error:", error);
    return NextResponse.redirect("/settings?error=oauth_failed");
  }
}
