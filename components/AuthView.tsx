
import React from 'react';
import { AlertCircle, Loader2, Zap, Send, ShieldCheck } from 'lucide-react';
import { Security } from '../utils/security';

interface AuthViewProps {
  accessKey: string;
  setAccessKey: (val: string) => void;
  onAuth: (e: React.FormEvent) => void;
  loading: boolean;
  authError: string;
}

export const AuthView: React.FC<AuthViewProps> = ({
  accessKey,
  setAccessKey,
  onAuth,
  loading,
  authError,
}) => {
  const BOT_USERNAME = 'NekoLeak_bot'; 

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-inter perspective-1000">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] animate-pulse-glow" />
      
      <div className="max-w-md w-full space-y-8 text-center animate-slide-up relative z-10 transition-transform duration-700">
        <div className="space-y-6">
          <div className="relative w-24 h-24 mx-auto group">
            <div className="absolute inset-0 bg-red-600/20 rounded-[2rem] blur-2xl group-hover:bg-red-600/40 transition-all duration-700" />
            <div className="relative w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
              <div className="scan-line" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-glow-red">
              NEKO<span className="text-red-600">LEAK</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3 text-red-600" />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.6em]">
                SECURE ACCESS {Security.VERSION}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0b]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-2xl ring-1 ring-white/5">
          <div className="space-y-1.5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Identity Verification</h2>
            <div className="h-0.5 w-12 bg-red-600 mx-auto rounded-full" />
          </div>

          <form onSubmit={onAuth} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                placeholder="NX-XXXXXX"
                disabled={loading}
                autoFocus
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-6 px-4 text-sm font-black tracking-[0.5em] focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 transition-all placeholder:text-zinc-800 text-center uppercase font-mono"
              />
            </div>

            {authError && (
              <div className="flex items-center justify-center gap-2.5 p-4 bg-red-600/10 border border-red-600/20 rounded-2xl animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-[9px] text-red-500 font-black uppercase tracking-widest leading-tight">
                  {authError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !accessKey}
              className="w-full crimson-gradient hover:opacity-90 disabled:opacity-50 text-white font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-red-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white group-hover:scale-125 transition-transform" />
                  INITIATE DATABASE SYNC
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-white/5">
            <a
              href={`https://t.me/${BOT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-sky-500/50 group-hover:bg-sky-500/10 transition-all duration-500">
                <Send className="w-5 h-5 text-zinc-400 group-hover:text-sky-400 transition-colors" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">Generate Key via Telegram</span>
                <p className="text-[7px] text-zinc-700 font-bold uppercase tracking-widest">Nexus Authorization Bot</p>
              </div>
            </a>
          </div>
        </div>

        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.4em] opacity-50">
          All connection attempts are recorded by the central node.
        </p>
      </div>
    </div>
  );
};
