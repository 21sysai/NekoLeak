
import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Lock, Scale } from 'lucide-react';
import { ViewState } from '../types';

interface PolicyViewProps {
  type: ViewState.TERMS | ViewState.PRIVACY | ViewState.DMCA;
  onGoBack: () => void;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ type, onGoBack }) => {
  const getContent = () => {
    switch (type) {
      case ViewState.TERMS:
        return {
          title: "Service Protocols",
          subtitle: "Terms of Engagement",
          icon: <FileText className="w-8 h-8" />,
          sections: [
            {
              h: "1. Access Authorization",
              p: "Access to the NEKOLEAK database is restricted to authorized entities holding a valid NK-Series access key. Unauthorized attempts to bypass authentication layers are logged and may result in permanent node exclusion."
            },
            {
              h: "2. Usage Limitations",
              p: "The content indexed within this archive is for private, educational research only. Users are prohibited from utilizing automated scrapers or bots to extract metadata from the Nexus Ops Center."
            },
            {
              h: "3. Dissemination",
              p: "NEKOLEAK does not host proprietary media files. We function as a decentralized indexing terminal. Redistribution of links found within this portal is done at the user's own risk."
            }
          ]
        };
      case ViewState.PRIVACY:
        return {
          title: "Nexus Security",
          subtitle: "Data Privacy Protocol",
          icon: <Lock className="w-8 h-8" />,
          sections: [
            {
              h: "1. Identity Anonymity",
              p: "We do not collect personal identification data. Your access key is the only identifier within our encrypted traffic stream. No IP logs are retained beyond active session duration."
            },
            {
              h: "2. Encryption Standards",
              p: "All communication between your terminal and the Nexus Ops Center is encrypted via AES-256 protocols. We employ 'No-Referrer' policies to protect your navigational metadata."
            },
            {
              h: "3. Local Persistence",
              p: "Bookmarks and watch history are stored exclusively on your local machine's storage. NEKOLEAK servers have zero visibility into your personal archive collections."
            }
          ]
        };
      case ViewState.DMCA:
        return {
          title: "Legal Compliance",
          subtitle: "DMCA Intellectual Property",
          icon: <Scale className="w-8 h-8" />,
          sections: [
            {
              h: "1. Indexing Nature",
              p: "NEKOLEAK is an automated information retrieval system. We do not upload, host, or store any audio-visual content on our dedicated servers. All media is served via third-party providers."
            },
            {
              h: "2. Takedown Requests",
              p: "As a service provider, we respond to valid infringement notices under the Digital Millennium Copyright Act. However, removing a link from our index does not remove the source content from the internet."
            },
            {
              h: "3. Contact Protocol",
              p: "For formal takedown inquiries, please contact the original hosting providers. For index removal from our portal, reach out via the official encrypted Telegram channel."
            }
          ]
        };
    }
  };

  const data = getContent();

  return (
    <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto animate-slide-up space-y-12 min-h-[80vh]">
      <button
        onClick={onGoBack}
        className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.3em]"
      >
        <div className="p-2 bg-zinc-900 group-hover:bg-red-600 rounded-lg">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Return to Global Archive
      </button>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 border border-red-600/20">
            {data.icon}
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{data.title}</h1>
            <p className="text-xs text-zinc-500 font-bold uppercase mt-2 tracking-widest">{data.subtitle}</p>
          </div>
        </div>

        <div className="grid gap-8 pt-10">
          {data.sections.map((section, idx) => (
            <div key={idx} className="bg-[#0a0a0b] p-8 rounded-[2rem] border border-white/5 space-y-4 hover:border-red-600/20 transition-colors">
              <h3 className="text-red-500 font-black uppercase text-sm tracking-widest flex items-center gap-3">
                <span className="opacity-30">[{idx + 1}]</span>
                {section.h}
              </h3>
              <p className="text-zinc-400 leading-relaxed font-medium">
                {section.p}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-4 text-center">
        <ShieldCheck className="w-10 h-10 text-zinc-800" />
        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.5em]">
          Verified by Nexus Security Protocol v4.0
        </p>
      </div>
    </div>
  );
};
