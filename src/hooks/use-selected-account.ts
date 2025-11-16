/**
 * Hook for managing selected TikTok account
 * Uses localStorage for persistence across page loads
 */

"use client";

import { useState, useEffect } from "react";

const SELECTED_ACCOUNT_KEY = "tractok_selected_account";

export function useSelectedAccount() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(() => {
    // Initialize from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem(SELECTED_ACCOUNT_KEY);
    }
    return null;
  });

  // Save to localStorage when changed (using useEffect)
  useEffect(() => {
    if (selectedAccountId) {
      localStorage.setItem(SELECTED_ACCOUNT_KEY, selectedAccountId);
    } else {
      localStorage.removeItem(SELECTED_ACCOUNT_KEY);
    }
  }, [selectedAccountId]);

  const selectAccount = (accountId: string | null) => {
    setSelectedAccountId(accountId);
  };

  return {
    selectedAccountId,
    selectAccount,
  };
}
