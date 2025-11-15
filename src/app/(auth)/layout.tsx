import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - TracTok",
  description: "Sign in or create an account to manage your TikTok Shop affiliate tracking",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
