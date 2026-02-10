'use client';

import { useState } from 'react';

export default function TwitterMockAuthPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleAuthorize = () => {
    if (isRedirecting) {
      return;
    }

    setIsRedirecting(true);
    window.setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage({ type: 'TWITTER_AUTH_SUCCESS' }, '*');
      }
      window.close();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0B0D10] px-8 py-10 shadow-2xl">
        <div className="absolute right-6 top-6 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/80?u=note-boost"
            alt="User avatar"
            className="h-9 w-9 rounded-full border border-white/10"
          />
          <span className="text-sm font-semibold text-slate-200">@saniiscaching</span>
        </div>

        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-black text-white">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>

        <h1 className="mt-8 text-center text-xl font-bold text-white">
          Authorize NoteBoost Sentinel to access your account?
        </h1>

        <div className="mt-6 space-y-3 text-sm text-slate-300">
          {[
            'Read your timeline',
            'See who you follow',
            'View your profile details',
            'Access your saved posts'
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 text-emerald-400">
                ✓
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleAuthorize}
            disabled={isRedirecting}
            className="flex items-center justify-center gap-3 rounded-full bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRedirecting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Redirecting...
              </>
            ) : (
              'Authorize app'
            )}
          </button>
          <button
            className="rounded-full bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700"
            onClick={() => window.close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
