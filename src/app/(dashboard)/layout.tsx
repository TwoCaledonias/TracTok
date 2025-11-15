import type { Metadata } from "next";
import { Navigation } from "@/components/features/navigation";

export const metadata: Metadata = {
  title: "Dashboard - TracTok",
  description: "Track your TikTok Shop affiliate orders and earnings",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 lg:block">
        <Navigation />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
