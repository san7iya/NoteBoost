import React from 'react';

export const RightPanel = () => (
  <aside className="h-full border-l border-slate-800 p-6 bg-[#0F172A] flex flex-col gap-6">
    <section className="bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Origin Distribution</h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">Last 24h</span>
      </div>
      <div className="flex items-end gap-3 h-24">
        <div className="w-6 rounded bg-emerald-500/40 h-10" />
        <div className="w-6 rounded bg-emerald-500/50 h-16" />
        <div className="w-6 rounded bg-emerald-500/30 h-8" />
        <div className="w-6 rounded bg-emerald-500/70 h-20" />
        <div className="w-6 rounded bg-emerald-500/40 h-12" />
      </div>
    </section>

    <section className="bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Live Log Output</h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">Sentinel</span>
      </div>
      <div className="font-mono text-xs bg-black/50 p-4 rounded border border-slate-800">
        <p className="text-emerald-500">[09:24:11] Polling worker 01 started</p>
        <p>[09:24:12] Scan: 142 following IDs found</p>
        <p className="text-yellow-400">[09:24:15] Warning: Xpoz API Latency +40ms</p>
        <p className="text-red-400">[09:24:20] Alert: Risk Score &gt; 0.75 identified</p>
        <p className="animate-pulse">_</p>
      </div>
    </section>

    <section className="mt-auto">
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Auto-Sentinel Active</h4>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">LIVE</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Adaptive weights are adjusting in real time based on incoming signal volatility.</p>
        <button className="w-full px-3 py-2 text-xs font-bold rounded bg-emerald-500/90 text-white hover:bg-emerald-500 transition">
          Adjust Weights
        </button>
      </div>
    </section>
  </aside>
);
