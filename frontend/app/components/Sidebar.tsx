import React from 'react';

export const Sidebar = () => (
  <aside className="flex w-72 flex-col border-r border-slate-800 bg-[#0F172A] p-6 shrink-0 h-full">
    <div className="flex items-center gap-3 mb-10">
      <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
        <span className="material-symbols-outlined fill-1">shield_with_heart</span>
      </div>
      <div className="flex flex-col leading-tight">
        <h1 className="text-xl font-bold tracking-tight text-white">NoteBoost</h1>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Sentinel Engine v2.4</span>
      </div>
    </div>
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">System Health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-300">Polling Status</span>
            </div>
            <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">ACTIVE</span>
          </div>
        </div>
      </div>
      <nav className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Monitoring</h3>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span className="text-sm font-semibold">Live Feed</span>
        </button>
      </nav>
    </div>
  </aside>
);