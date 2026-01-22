
import React from 'react';
import { AlertCircle, Loader2, Zap, Send } from 'lucide-react';
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[160px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[160px] animate-pulse" />

      <div className="max-w-md w-full space-y-10 text-center animate-slide-up relative z-10">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] mx-auto flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(220,38,38,0.4)] border border-white/10 overflow-hidden rotate-3">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-glow">
              NEKO<span className="text-red-600">LEAK</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em] opacity-80">
              Nexus Quantum-Sync {Security.VERSION}
            </p>
          </div>
        </div>

        <div className="bg-[#0a0a0b]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
          <div className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-300">Identity Terminal</h2>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
              Verification Required
            </p>
          </div>

          <form onSubmit={onAuth} className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                placeholder="NX-XXXXXX"
                disabled={loading}
                className="w-full bg-[#050505] border border-white/5 rounded-2xl py-5 px-6 text-sm font-black tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-all placeholder:text-zinc-800 text-center uppercase"
              />
            </div>

            {authError && (
              <div className="flex items-center justify-center gap-2 p-4 bg-red-600/5 border border-red-600/10 rounded-xl animate-shake">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-[9px] text-red-600 font-black uppercase tracking-widest leading-tight text-center">
                  {authError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !accessKey}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-4 h-4 fill-white" /> INITIALIZE SESSION</>}
            </button>
          </form>

          <div className="pt-6 border-t border-white/5">
            <a
              href={`https://t.me/${BOT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 transition-all"
            >
              <div className="flex items-center gap-2 text-zinc-500 group-hover:text-sky-400 transition-colors">
                <Send className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Connect to Bot</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
