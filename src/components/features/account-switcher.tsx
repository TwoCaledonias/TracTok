/**
 * Account Switcher Component
 * Dropdown to switch between connected TikTok accounts
 */

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getConnectedAccounts } from "@/app/actions/tiktok";
import { useSelectedAccount } from "@/hooks/use-selected-account";

interface Account {
  id: string;
  tiktokUsername: string;
  tiktokDisplayName: string | null;
  isActive: boolean;
}

export function AccountSwitcher() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedAccountId, selectAccount } = useSelectedAccount();

  const loadAccounts = React.useCallback(async () => {
    setLoading(true);
    const result = await getConnectedAccounts();
    if (result.success && result.accounts) {
      const activeAccounts = result.accounts.filter((a: Account) => a.isActive);
      setAccounts(activeAccounts);

      // Auto-select first account if none selected
      if (!selectedAccountId && activeAccounts.length > 0 && activeAccounts[0]) {
        selectAccount(activeAccounts[0].id);
      }
    }
    setLoading(false);
  }, [selectedAccountId, selectAccount]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAccounts();
  }, [loadAccounts]);

  // Don't show switcher if only one account or no accounts
  if (accounts.length <= 1) {
    return null;
  }

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-orange-200 hover:border-orange-300 hover:bg-orange-50"
        >
          <span className="truncate">
            {loading
              ? "Loading..."
              : selectedAccount
                ? selectedAccount.tiktokDisplayName || selectedAccount.tiktokUsername
                : "Select Account"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onClick={() => selectAccount(account.id)}
            className="cursor-pointer"
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                selectedAccountId === account.id ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="flex flex-col">
              <span className="font-medium">
                {account.tiktokDisplayName || account.tiktokUsername}
              </span>
              {account.tiktokDisplayName && (
                <span className="text-xs text-gray-500">@{account.tiktokUsername}</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
