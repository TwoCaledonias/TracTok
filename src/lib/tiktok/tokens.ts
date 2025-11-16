/**
 * Token management utilities
 * Handles encryption, decryption, and refresh of TikTok OAuth tokens
 */

import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import { refreshAccessToken, calculateTokenExpiration, isTokenExpired } from "./oauth";
import type { ConnectedAccount } from "./types";

/**
 * Store OAuth tokens for a TikTok account
 * Encrypts tokens before storing in database
 */
export async function storeTokens(
  userId: string,
  tiktokUserId: string,
  tiktokUsername: string,
  displayName: string | null,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): Promise<string> {
  const encryptedAccessToken = encrypt(accessToken);
  const encryptedRefreshToken = encrypt(refreshToken);
  const tokenExpiresAt = calculateTokenExpiration(expiresIn);

  // Upsert: create new or update existing account
  const account = await prisma.tikTokAccount.upsert({
    where: {
      tiktokUserId: tiktokUserId,
    },
    create: {
      userId,
      tiktokUserId,
      tiktokUsername: tiktokUsername,
      tiktokDisplayName: displayName,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      tokenExpiresAt,
      isActive: true,
    },
    update: {
      tiktokUsername: tiktokUsername,
      tiktokDisplayName: displayName,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      tokenExpiresAt,
      isActive: true,
      updatedAt: new Date(),
    },
  });

  return account.id;
}

/**
 * Get a connected TikTok account with decrypted tokens
 * Automatically refreshes expired tokens
 */
export async function getAccountWithTokens(accountId: string): Promise<ConnectedAccount | null> {
  const account = await prisma.tikTokAccount.findUnique({
    where: { id: accountId },
  });

  if (!account || !account.isActive) {
    return null;
  }

  // Decrypt tokens
  let accessToken = decrypt(account.accessToken);
  let refreshToken = account.refreshToken ? decrypt(account.refreshToken) : null;
  let tokenExpiresAt = account.tokenExpiresAt;

  // Check if token needs refresh
  if (tokenExpiresAt && isTokenExpired(tokenExpiresAt)) {
    if (!refreshToken) {
      // No refresh token available, account needs re-authentication
      await markAccountAsExpired(accountId);
      return null;
    }

    try {
      // Refresh the token
      const newTokens = await refreshAccessToken(refreshToken);

      // Update database with new tokens
      accessToken = newTokens.access_token;
      refreshToken = newTokens.refresh_token;
      tokenExpiresAt = calculateTokenExpiration(newTokens.expires_in);

      await prisma.tikTokAccount.update({
        where: { id: accountId },
        data: {
          accessToken: encrypt(accessToken),
          refreshToken: encrypt(refreshToken),
          tokenExpiresAt,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to refresh token:", error);
      await markAccountAsExpired(accountId);
      return null;
    }
  }

  return {
    id: account.id,
    tiktokUserId: account.tiktokUserId,
    tiktokUsername: account.tiktokUsername,
    tiktokDisplayName: account.tiktokDisplayName,
    accessToken,
    refreshToken,
    tokenExpiresAt,
    isActive: account.isActive,
    lastSyncedAt: account.lastSyncedAt,
  };
}

/**
 * Get all connected accounts for a user (without tokens)
 */
export async function getUserAccounts(userId: string) {
  return await prisma.tikTokAccount.findMany({
    where: {
      userId,
      isActive: true,
    },
    select: {
      id: true,
      tiktokUserId: true,
      tiktokUsername: true,
      tiktokDisplayName: true,
      isActive: true,
      lastSyncedAt: true,
      tokenExpiresAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

/**
 * Mark an account as expired (token refresh failed)
 */
export async function markAccountAsExpired(accountId: string): Promise<void> {
  await prisma.tikTokAccount.update({
    where: { id: accountId },
    data: {
      isActive: false,
      updatedAt: new Date(),
    },
  });
}

/**
 * Disconnect (delete) a TikTok account
 */
export async function disconnectAccount(accountId: string, userId: string): Promise<boolean> {
  try {
    await prisma.tikTokAccount.delete({
      where: {
        id: accountId,
        userId, // Ensure user owns this account
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to disconnect account:", error);
    return false;
  }
}

/**
 * Update last sync time for an account
 */
export async function updateLastSync(accountId: string): Promise<void> {
  await prisma.tikTokAccount.update({
    where: { id: accountId },
    data: {
      lastSyncedAt: new Date(),
    },
  });
}

/**
 * Check if user can connect more accounts based on subscription tier
 */
export async function canConnectMoreAccounts(userId: string): Promise<boolean> {
  // Use getAccountLimits which handles user creation
  const limits = await getAccountLimits(userId);
  return limits.canConnect;
}

/**
 * Get account count and limit for a user
 */
export async function getAccountLimits(
  userId: string,
  userEmail?: string
): Promise<{
  current: number;
  max: number;
  canConnect: boolean;
}> {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tiktokAccounts: {
        where: {
          isActive: true,
        },
      },
    },
  });

  // If user doesn't exist in database, create them with default values
  if (!user) {
    console.log(`Creating user record for ${userId}`);
    // Use actual email or generate a unique placeholder
    const email = userEmail || `user-${userId}@tractok.temp`;

    try {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: email,
          subscriptionTier: "FREE_TRIAL",
          subscriptionStatus: "TRIALING",
          maxAccounts: 1,
          dataRetentionMonths: 6,
          freeTrialStartDate: new Date(),
          freeTrialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        include: {
          tiktokAccounts: {
            where: {
              isActive: true,
            },
          },
        },
      });
      console.log(`✅ User record created successfully`);
    } catch (error) {
      console.error(`❌ Failed to create user record:`, error);
      throw error;
    }
  }

  const current = user.tiktokAccounts.length;
  const max = user.maxAccounts;

  return {
    current,
    max,
    canConnect: current < max,
  };
}
