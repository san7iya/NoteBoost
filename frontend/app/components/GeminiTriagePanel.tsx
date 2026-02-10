import React from 'react';
import { ShieldCheck, CheckCircle, FileText } from 'lucide-react';

interface AnalysisPoint {
  title: string;
  desc: string;
  status: string;
}

interface GeminiTriageData {
  verdict: string;
  confidence: number;
  summary: string;
  analysis_points: AnalysisPoint[];
  sources: string[];
}

interface GeminiTriagePanelProps {
  data: GeminiTriageData;
}

const clampPercent = (value: number) => {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
};

export const GeminiTriagePanel = ({ data }: GeminiTriagePanelProps) => {
  const percent = Math.round(clampPercent(data.confidence) * 100);
  const dashArray = 2 * Math.PI * 20;
  const dashOffset = dashArray * (1 - percent / 100);

  return (
    <div className="bg-[#0B1221] border border-slate-800 rounded-2xl p-6 text-white">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <h3 className="text-base font-bold">Gemini Triage Packet</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">Analysis complete • Latency 142ms</p>
        </div>
        <div className="relative h-12 w-12">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              className="text-slate-800"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              className="text-emerald-500"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {percent}%
          </span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Verification Summary</p>
        <p className="mt-2 text-sm text-slate-300">{data.summary}</p>
      </div>

      <div className="mt-6 rounded-xl bg-[#0f172a] border border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-white">AI Ground-Truth Analysis</h4>
        </div>
        <div className="mt-4 space-y-3">
          {data.analysis_points.map((point, index) => (
            <div key={`${point.title}-${index}`} className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">{point.title}</p>
                <p className="text-xs text-slate-400">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Verified Evidence Sources</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.sources.map((source, index) => (
            <span
              key={`${source}-${index}`}
              className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold text-blue-400"
            >
              {source}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
