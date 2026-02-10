import React from 'react';

interface MetricProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: string;
  icon: string;
  color: 'emerald' | 'red' | 'blue';
}

export const MetricCard = ({ label, value, subValue, trend, icon, color }: MetricProps) => {
  const colors = {
    emerald: 'text-emerald-500',
    red: 'text-red-500',
    blue: 'text-blue-400'
  };

  return (
    <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-lg p-6 flex flex-col gap-2 relative overflow-hidden group">
      <div className="absolute top-2 right-2 text-6xl opacity-10">
        <span className={`material-symbols-outlined text-6xl ${colors[color]}`}>{icon}</span>
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
        {trend && <span className="text-xs font-semibold text-emerald-400">{trend}</span>}
        {subValue && <span className={`${colors[color]} text-xs font-medium px-1.5 py-0.5 rounded bg-white/5`}>{subValue}</span>}
      </div>
    </div>
  );
};