/**
 * Server Actions for TikTok Account Management
 */

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserAccounts, disconnectAccount, getAccountLimits } from "@/lib/tiktok/tokens";

/**
 * Get all connected TikTok accounts for the current user
 */
export async function getConnectedAccounts() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const accounts = await getUserAccounts(session.user.id);
    return { success: true, accounts };
  } catch (error) {
    console.error("Failed to get accounts:", error);
    return { success: false, error: "Failed to fetch accounts" };
  }
}

/**
 * Disconnect a TikTok account
 */
export async function disconnectTikTokAccount(accountId: string) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const success = await disconnectAccount(accountId, session.user.id);

    if (success) {
      revalidatePath("/settings");
      revalidatePath("/dashboard");
      return { success: true };
    }

    return { success: false, error: "Failed to disconnect account" };
  } catch (error) {
    console.error("Failed to disconnect account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to disconnect account",
    };
  }
}

/**
 * Get account connection limits for the current user
 */
export async function getAccountConnectionLimits() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const limits = await getAccountLimits(session.user.id);
    return { success: true, limits };
  } catch (error) {
    console.error("Failed to get account limits:", error);
    return { success: false, error: "Failed to fetch limits" };
  }
}

/**
 * Set selected account ID in session/cookie
 * This will be used to filter data across the app
 */
export async function setSelectedAccount(_accountId: string) {
  // In a real implementation, you might want to:
  // 1. Store in a database session table
  // 2. Use cookies (with the cookies() API)
  // 3. Use server-side state management

  // For now, we'll use revalidation and let the client handle it
  // The client will pass accountId in queries

  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/earnings");
  revalidatePath("/reports");

  return { success: true };
}
