'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'TWITTER_AUTH_SUCCESS') {
        return;
      }

      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      setLoading(true);
      router.push('/dashboard');
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const interval = window.setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        popupRef.current = null;
        setLoading(false);
      }
    }, 300);

    return () => window.clearInterval(interval);
  }, [loading]);

  const handleSignIn = () => {
    if (loading) {
      return;
    }

    const popup = window.open('/auth/twitter-mock', 'twitter-auth', 'width=600,height=700');
    if (!popup) {
      setLoading(false);
      return;
    }

    popupRef.current = popup;
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(30,41,59,0.15)_0%,rgba(2,6,23,0.6)_40%,rgba(2,6,23,0.95)_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(135deg,rgba(148,163,184,0.15)_0,rgba(148,163,184,0.15)_1px,transparent_1px,transparent_10px)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900/80 border border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
            <Shield className="h-7 w-7 text-emerald-400" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">NoteBoost Sentinel</h1>
            <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-emerald-500/80">
              Secure Access Terminal v2.4
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 shadow-2xl">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">Identity Verification Required</p>
              <p className="text-xs text-slate-500">Provide credentials to initialize session</p>
            </div>

            <button
              onClick={handleSignIn}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              )}
              <span>{loading ? 'Authenticating...' : 'Sign in with X'}</span>
            </button>

            <div className="my-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              <span>System Protocol</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-xs text-slate-500">Trouble signing in? Contact SysAdmin</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
            Restricted Access. Authorized Personnel Only.
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
