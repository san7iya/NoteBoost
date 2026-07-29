import React, { useState } from 'react';
import { GeminiTriagePanel } from './GeminiTriagePanel';

export interface ThreatProps {
  username: string;
  timestamp: string;
  text: string;
  riskScore: number;
  s_val: number;
  v_val: number;
  e_val: number;
  avatarUrl: string;
  onReviewStart?: () => void;
  onReviewEnd?: () => void;
  onReviewComplete?: () => void;
}

interface AnalysisResult {
  verdict: string;
  confidence: number;
  explanation: string;
}

export const ThreatCard = ({
  username,
  timestamp,
  text,
  riskScore,
  s_val,
  v_val,
  e_val,
  avatarUrl,
  onReviewStart,
  onReviewEnd,
  onReviewComplete
}: ThreatProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const isHigh = riskScore >= 0.75;
  const isMed = riskScore >= 0.4 && riskScore < 0.75;
  const verdictTone = analysis?.verdict?.toLowerCase() === 'malicious' ? 'border-red-500/60 text-red-300' : 'border-emerald-500/60 text-emerald-300';
  const triageData = {
    verdict: analysis?.verdict ?? (isHigh ? 'Malicious' : isMed ? 'Suspect' : 'Safe'),
    confidence: analysis?.confidence ?? riskScore,
    summary: analysis?.explanation ?? text,
    analysis_points: [
      {
        title: 'Sentiment Signal',
        desc: `S-score at ${s_val.toFixed(2)} indicates ${s_val >= 0.6 ? 'heightened' : 'stable'} sentiment volatility.`,
        status: s_val >= 0.6 ? 'warn' : 'ok'
      },
      {
        title: 'Propagation Velocity',
        desc: `V-score at ${v_val.toFixed(2)} suggests ${v_val >= 0.6 ? 'accelerated' : 'normal'} spread velocity.`,
        status: v_val >= 0.6 ? 'warn' : 'ok'
      },
      {
        title: 'Evidence Density',
        desc: `E-score at ${e_val.toFixed(2)} indicates ${e_val >= 0.6 ? 'link-heavy' : 'low'} evidence density.`,
        status: e_val >= 0.6 ? 'ok' : 'warn'
      }
    ],
    sources: ['X Signal', 'NoteBoost RAG', 'Threat Intel Cache']
  };

  const handleReview = async () => {
    if (isAnalyzing) {
      return;
    }

    setAnalysis(null);
    setLatencyMs(null);
    setIsAnalyzing(true);
    onReviewStart?.();
    const startedAt = performance.now();
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweet_text: text })
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = (await response.json()) as AnalysisResult;
      setLatencyMs(Math.round(performance.now() - startedAt));
      setAnalysis(data);
      onReviewComplete?.();
    } catch (error) {
      alert('Unable to analyze threat. Please try again.');
    } finally {
      setIsAnalyzing(false);
      onReviewEnd?.();
    }
  };

  return (
    <div
      className={`relative bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-lg p-5 border-l-4 ${isHigh ? 'border-l-red-500' : isMed ? 'border-l-yellow-500' : 'border-l-emerald-500'} mb-4`}
    >
      {isAnalyzing && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/60 backdrop-blur-sm">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span className="text-xs font-semibold text-emerald-200 tracking-[0.2em]">CONTACTING GEMINI AGENT...</span>
        </div>
      )}
      <div className="flex items-start gap-4">
        <img
          src={avatarUrl}
          alt={`${username} avatar`}
          className="size-10 rounded-full border border-white/10"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{username}</h4>
              <span className="text-xs text-slate-500 font-mono">{timestamp}</span>
            </div>
            <div className="relative group">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isHigh ? 'bg-red-500 text-white' : isMed ? 'bg-yellow-500 text-black' : 'bg-emerald-500 text-white'}`}>
                Risk Score: {riskScore}
              </div>
              <div className="pointer-events-none absolute right-0 top-8 z-10 hidden w-44 rounded-lg border border-slate-700/60 bg-[#0c1322] p-2 text-[10px] text-slate-200 shadow-lg group-hover:block">
                <div className="flex items-center justify-between">
                  <span className="uppercase text-slate-500">S</span>
                  <span className="font-mono">{s_val.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="uppercase text-slate-500">V</span>
                  <span className="font-mono">{v_val.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="uppercase text-slate-500">E</span>
                  <span className="font-mono">{e_val.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{text}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReview}
              disabled={isAnalyzing}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-all disabled:opacity-70 disabled:cursor-not-allowed ${isHigh ? 'bg-red-500/90 text-white hover:bg-red-500' : 'bg-emerald-500/90 text-white hover:bg-emerald-500'}`}
            >
              {isHigh ? 'Review & Block' : 'Flag for RAG'}
            </button>
            <button className="px-4 py-1.5 bg-white/5 text-slate-300 text-xs font-bold rounded hover:bg-white/10 transition-all">
              False Positive
            </button>
          </div>
          {analysis && (
            <div className={`mt-4 rounded-lg border p-3 text-xs ${verdictTone} bg-[#0c1322]`}>
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-[0.2em]">{analysis.verdict.toUpperCase()}</span>
                <span className="text-[10px] text-slate-400">Confidence {Math.round(analysis.confidence * 100)}%</span>
              </div>
              <p className="mt-2 text-slate-300">{analysis.explanation}</p>
            </div>
          )}
          {analysis && (
            <div className="mt-4">
              <GeminiTriagePanel key={analysis.explanation} data={triageData} latencyMs={latencyMs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};