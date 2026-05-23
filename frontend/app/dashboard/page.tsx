'use client';

import { Activity, Radio, Cpu, Terminal } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Immersive Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1321] to-[#040814] border border-slate-800/80 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 text-indigo-500/10 pointer-events-none">
          <Terminal className="w-64 h-64 -mr-12 -mt-12" />
        </div>
        <div className="max-w-xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-3 h-3 animate-pulse" /> Core Infrastructure Operational
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">System Command Panel</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your distributed database link paths are integrated successfully. High-performance computing workflows, encryption layers, and user structures are accessible.
          </p>
        </div>
      </div>

      {/* Grid Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Data Processing Rate', value: '99.98%', change: 'Optimal', icon: Cpu },
          { label: 'Operational Nodes', value: 'Active Cluster', change: 'Synced', icon: Activity },
          { label: 'Network Pipeline Status', value: '0.04ms API Delay', change: '-12%', icon: Radio }
        ].map((metric, i) => (
          <div key={i} className="bg-[#090d16] border border-slate-800 p-5 rounded-xl space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{metric.label}</span>
              <metric.icon className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-white tracking-tight">{metric.value}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}