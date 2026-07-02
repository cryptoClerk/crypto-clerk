'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/auth/AuthModal';

export default function Header() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">CryptoClerks</span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-slate-300 hover:text-white text-sm">
                Receipts
              </Link>
              <Link href="/dashboard" className="text-slate-300 hover:text-white text-sm">
                Dashboard
              </Link>
              <Link href="/help" className="text-slate-300 hover:text-white text-sm">
                Help
              </Link>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-4">
              {isLoading ? (
                <div className="w-20 h-8 bg-slate-700 rounded animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 text-sm hidden sm:block">
                    {user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
