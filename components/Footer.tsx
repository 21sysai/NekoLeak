
import React from 'react';

interface FooterProps {
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
  onNavigateDMCA?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigateTerms, 
  onNavigatePrivacy, 
  onNavigateDMCA 
}) => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 text-center bg-[#030303] mt-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30" />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-5">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl mx-auto border border-white/10 overflow-hidden shadow-2xl p-0.5">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                NEKO<span className="text-red-600">LEAK</span>
              </h2>
            </div>
            <div className="flex items-center justify-center gap-4 text-zinc-500 font-black uppercase tracking-widest text-[8px]">
              <span 
                onClick={onNavigateTerms}
                className="hover:text-red-500 cursor-pointer transition-colors"
              >
                TERMS
              </span>
              <div className="w-1 h-1 bg-zinc-800 rounded-full" />
              <span 
                onClick={onNavigatePrivacy}
                className="hover:text-red-500 cursor-pointer transition-colors"
              >
                PRIVACY
              </span>
              <div className="w-1 h-1 bg-zinc-800 rounded-full" />
              <span 
                onClick={onNavigateDMCA}
                className="hover:text-red-500 cursor-pointer transition-colors"
              >
                DMCA
              </span>
            </div>
          </div>
        </div>

        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">
          GLOBAL ENCRYPTED DATABASE &copy; 2026 NEXUS OPS CENTER. ALL ACCESS LOGGED VIA SECURE TERMINAL.
        </p>
      </div>
    </footer>
  );
};
