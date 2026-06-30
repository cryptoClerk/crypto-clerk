'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-white hover:bg-white/10"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-slate-900 text-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            CryptoBooks
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-sm hover:text-slate-300">
              Dashboard
            </Link>
            <Link href="/dashboard/wallets" className="text-sm hover:text-slate-300">
              Wallets
            </Link>
            <Link href="/dashboard/statements" className="text-sm hover:text-slate-300">
              Statements
            </Link>
            <ThemeToggle />
            <Button variant="outline" size="sm" className="text-white border-white/20">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
