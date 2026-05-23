'use client';

import { useEffect, useState } from 'react';
import { FileText, Loader2, Radio, Terminal } from 'lucide-react';
import { ApiError } from '@/lib/api/client';
import { getPages, type Page } from '@/lib/api';

export default function DashboardPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPages = async () => {
      try {
        const data = await getPages();
        setPages(data);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.details
              ? `${err.message}: ${err.details}`
              : err.message
            : 'Failed to load pages';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1321] to-[#040814] border border-slate-800/80 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 text-indigo-500/10 pointer-events-none">
          <Terminal className="w-64 h-64 -mr-12 -mt-12" />
        </div>
        <div className="max-w-xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-3 h-3 animate-pulse" /> Pages Connected
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">Your Form Pages</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Pages are loaded from the backend API and scoped to your workspace client.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading pages...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && pages.length === 0 && (
        <div className="p-8 rounded-xl bg-[#090d16] border border-slate-800 text-center space-y-2">
          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-300 font-medium">No pages yet</p>
          <p className="text-xs text-slate-500">
            Create pages in Supabase or via POST /api/pages/ once the pages table is set up.
          </p>
        </div>
      )}

      {!loading && !error && pages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-3 shadow-md hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{page.title}</h3>
                  <p className="text-[11px] text-slate-500 truncate">/{page.slug}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide shrink-0 ${
                    page.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : page.status === 'archived'
                        ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {page.status}
                </span>
              </div>
              {page.description && (
                <p className="text-xs text-slate-400 line-clamp-2">{page.description}</p>
              )}
              <p className="text-[10px] text-slate-600">
                Updated {new Date(page.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
