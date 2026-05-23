'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import { completeOnboarding, getUserProfile } from '@/lib/api';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Phone, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    address: '',
    age: '',
    phone_no: '',
    state: ''
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const profile = await getUserProfile();
        if (profile.client_id) {
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 404) {
          console.error(err);
        }
      }

      setLoading(false);
    };
    checkUserStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await completeOnboarding({
        first_name: formData.first_name,
        middle_name: formData.middle_name || undefined,
        last_name: formData.last_name,
        address: formData.address || undefined,
        age: parseInt(formData.age) || undefined,
        phone_no: formData.phone_no || undefined,
        state: formData.state || undefined,
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error('🚨 Database Storage Failure Setup:', err);
      alert(`Configuration Error: ${err?.message || 'Verification failed.'}`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-[#090d16]/80 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8 space-y-8 relative shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Registration
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Complete your profile
          </h1>
          <p className="text-sm text-slate-400">Configure your system access identity settings below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Names */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">First Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text" required value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="w-full bg-[#0d1321] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Middle Name</label>
              <input
                type="text" value={formData.middle_name}
                onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                className="w-full bg-[#0d1321] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Last Name *</label>
              <input
                type="text" required value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="w-full bg-[#0d1321] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text" placeholder="+1 (555) 000-0000" value={formData.phone_no}
                  onChange={(e) => setFormData({...formData, phone_no: e.target.value})}
                  className="w-full bg-[#0d1321] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Age</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number" value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-[#0d1321] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Location */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Street Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text" value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-[#0d1321] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">State</label>
              <input
                type="text" placeholder="NY" value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full bg-[#0d1321] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-all text-white rounded-xl text-sm font-semibold shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Constructing Environment...' : 'Initialize Workspace'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}