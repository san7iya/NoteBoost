import React from 'react';

export const LiveLogs = () => (
  <div className="space-y-4">
    <p className="text-[10px] font-bold text-slate-500 uppercase">Live Sentinel Log</p>
    <div className="bg-black/40 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1 overflow-hidden h-48">
      <p className="text-emerald-500">[09:24:11] Polling worker 01 started</p>
      <p>[09:24:12] Scan: 142 following IDs found</p>
      <p className="text-yellow-400">[09:24:15] Warning: Xpoz API Latency +40ms</p>
      <p className="text-red-400">[09:24:20] Alert: Risk Score &gt; 0.8 identified</p>
      <p className="animate-pulse">_</p>
    </div>
  </div>
);