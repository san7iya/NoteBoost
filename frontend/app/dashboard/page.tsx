// app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MetricCard } from '../components/MetricCard';
import { ThreatCard } from '../components/ThreatCard';
import { RightPanel } from '../components/RightPanel';
import { MOCK_THREATS } from '../lib/mockData';

type Threat = (typeof MOCK_THREATS)[number];

export default function Dashboard() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadThreats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/test-feed', {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = (await response.json()) as Threat[];
        setThreats(data);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Failed to load threats:', error);
        setError('Unable to load the live feed. Please try again.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadThreats();
    return () => controller.abort();
  }, []);

  return (
    <div className="grid grid-cols-[280px_1fr_350px] h-screen w-full overflow-hidden bg-[#0c1322]">
      <Sidebar />
      <main className="flex flex-col h-screen overflow-hidden relative min-w-0">
        <div className="shrink-0 z-20 bg-[#0c1322] p-6 pb-2 border-b border-slate-800">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500">search</span>
                <input
                  className="w-full rounded-lg bg-[#1e293b] pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Filter threat signatures..."
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-emerald-400">12 Parallel Workers</span>
                <button className="size-10 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition">
                  <span className="material-symbols-outlined text-xl">notifications</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard label="Tweets Scanned" value="1,420" icon="analytics" color="emerald" />
              <MetricCard label="High-Risk Flags" value="87" icon="warning" color="red" subValue="Priority" />
              <MetricCard label="RAG Tasks" value="12" icon="memory" color="blue" />
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                All Threats
              </button>
              <button className="text-xs font-semibold text-slate-400 hover:text-slate-200">High Risk Only</button>
              <button className="text-xs font-semibold text-slate-400 hover:text-slate-200">Flagged</button>
              <button className="text-xs font-semibold text-slate-400 hover:text-slate-200">History</button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <h2 className="text-2xl font-bold text-white mb-6">Live Sentinel Feed</h2>

          {loading ? (
            <div className="flex flex-col gap-4">
              <div className="h-32 w-full bg-white/5 animate-pulse rounded-xl" />
              <div className="h-32 w-full bg-white/5 animate-pulse rounded-xl" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : (
            threats.map((threat, index) => (
              <ThreatCard key={index} {...threat} />
            ))
          )}
        </div>
      </main>
      <RightPanel />
    </div>
  );
}
