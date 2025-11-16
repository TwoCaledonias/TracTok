/**
 * Connected Accounts Component
 * Displays list of connected TikTok accounts with connect/disconnect functionality
 */

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getConnectedAccounts,
  disconnectTikTokAccount,
  getAccountConnectionLimits,
} from "@/app/actions/tiktok";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface Account {
  id: string;
  tiktokUserId: string;
  tiktokUsername: string;
  tiktokDisplayName: string | null;
  isActive: boolean;
  lastSyncedAt: Date | null;
  tokenExpiresAt: Date | null;
  createdAt: Date;
}

export function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [limits, setLimits] = useState({ current: 0, max: 1, canConnect: false });
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const loadAccounts = React.useCallback(async () => {
    setLoading(true);
    const result = await getConnectedAccounts();
    if (result.success && result.accounts) {
      setAccounts(result.accounts);
    }
    setLoading(false);
  }, []);

  const loadLimits = React.useCallback(async () => {
    const result = await getAccountConnectionLimits();
    if (result.success && result.limits) {
      setLimits(result.limits);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAccounts();

    loadLimits();
  }, [loadAccounts, loadLimits]);

  const handleDisconnect = async (accountId: string) => {
    if (!confirm("Are you sure you want to disconnect this account?")) {
      return;
    }

    setDisconnecting(accountId);
    const result = await disconnectTikTokAccount(accountId);

    if (result.success) {
      await loadAccounts();
      await loadLimits();
    } else {
      alert(`Failed to disconnect account: ${result.error}`);
    }

    setDisconnecting(null);
  };

  const getAccountStatus = (account: Account) => {
    if (!account.isActive) {
      return { text: "Expired", icon: XCircle, color: "text-red-500" };
    }

    if (account.tokenExpiresAt) {
      const expiresAt = new Date(account.tokenExpiresAt);
      const now = new Date();
      if (expiresAt < now) {
        return { text: "Expired", icon: XCircle, color: "text-red-500" };
      }
    }

    return { text: "Active", icon: CheckCircle2, color: "text-green-500" };
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected TikTok Accounts</CardTitle>
        <CardDescription>
          Manage your connected TikTok Shop accounts. You can connect up to {limits.max}{" "}
          {limits.max === 1 ? "account" : "accounts"} with your current plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Account limit info */}
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div className="text-sm">
              <p className="font-medium text-orange-900">
                {limits.current} of {limits.max} accounts connected
              </p>
              {!limits.canConnect && (
                <p className="text-orange-700">Upgrade your plan to connect more accounts.</p>
              )}
            </div>
          </div>
        </div>

        {/* Connected accounts list */}
        {accounts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-600">No TikTok accounts connected yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Click the button below to connect your first account.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => {
              const status = getAccountStatus(account);
              const StatusIcon = status.icon;

              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">
                        {account.tiktokDisplayName || account.tiktokUsername}
                      </h4>
                      <div className={`flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{status.text}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">@{account.tiktokUsername}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Connected: {formatDate(account.createdAt)} • Last synced:{" "}
                      {formatDate(account.lastSyncedAt)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(account.id)}
                    disabled={disconnecting === account.id}
                  >
                    {disconnecting === account.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Disconnecting...
                      </>
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Connect button */}
        <div className="pt-4">
          {limits.canConnect ? (
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
              <a href="/api/tiktok/connect">Connect TikTok Account</a>
            </Button>
          ) : (
            <Button disabled className="w-full">
              Account Limit Reached - Upgrade to Connect More
            </Button>
          )}
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-500">
          By connecting your TikTok account, you authorize TracTok to access your TikTok Shop
          affiliate data. You can disconnect at any time.
        </p>
      </CardContent>
    </Card>
  );
}
