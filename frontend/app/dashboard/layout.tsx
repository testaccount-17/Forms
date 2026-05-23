'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import { getUserProfile } from '@/lib/api';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import SecurityModal from '@/components/SecurityModal';
import { ChevronDown, LogOut, Shield } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const profile = await getUserProfile();

        if (!profile.client_id || !profile.clients) {
          router.push('/onboarding');
        } else {
          setProfile(profile.clients);
        }
      } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
          router.push('/onboarding');
        } else {
          router.push('/login');
        }
      }
    };

    fetchProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col antialiased">
      <header className="sticky top-0 z-40 bg-[#030712]/70 backdrop-blur-xl border-b border-slate-900 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold tracking-tight text-sm text-white">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
            U
          </div>
          <span>Unicorn<span className="text-indigo-400 font-medium">Lab</span></span>
        </div>

        {profile && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-black text-white">
                {profile.first_name?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                {profile.first_name} {profile.last_name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {dropdownOpen && (
              <div
                onMouseLeave={() => setDropdownOpen(false)}
                className="absolute right-0 mt-2 w-52 bg-[#090d16] border border-slate-800 rounded-xl shadow-2xl p-1.5 space-y-1"
              >
                <div className="px-2.5 py-2 border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Active Node: <span className="text-slate-300 block truncate font-normal normal-case text-xs mt-0.5">{profile.email}</span>
                </div>
                <button
                  onClick={() => { setModalOpen(true); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-900 rounded-lg transition-all text-left cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  Security Tokens
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  Terminate Session
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative z-10">
        {children}
      </main>

      <SecurityModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}