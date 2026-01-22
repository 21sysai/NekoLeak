
import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Monitor,
  PlayCircle,
  Clock,
  Cpu,
  Eye,
  Calendar,
  Info,
  HardDrive,
  Download,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { AnimeDetail } from '../types';
import { AdBlockedIframe } from './AdBlockedIframe';
import { parseSizeString, parseInfoString } from '../utils/parsers';

interface DetailViewProps {
  anime: AnimeDetail;
  activeStream: string | null;
  onSetActiveStream: (url: string) => void;
  onGoBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  anime,
  activeStream,
  onSetActiveStream,
  onGoBack,
  isBookmarked,
  onToggleBookmark
}) => {
  const parsedSizes = useMemo(() => parseSizeString(anime.size), [anime.size]);
  const infoData = useMemo(() => parseInfoString(anime.info), [anime.info]);

  return (
    <div className="px-6 md:px-12 py-8 max-w-[1600px] mx-auto animate-slide-up space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.3em]"
        >
          <div className="p-2 bg-zinc-900 group-hover:bg-red-600 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Return to Global Archive
        </button>

        <button
          onClick={onToggleBookmark}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${
            isBookmarked 
              ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' 
              : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
          }`}
        >
          {isBookmarked ? (
            <>
              <BookmarkCheck className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              Bookmark
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative group ring-1 ring-white/5">
            <AdBlockedIframe src={activeStream || ''} className="w-full h-full" />
          </div>

          <div className="bg-[#0a0a0b] p-8 md:p-10 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap gap-2">
              {(anime.genre || '').split(',').filter(Boolean).map((g, i) => (
                <span
                  key={i}
                  className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-red-600/10 text-red-500 rounded-full border border-red-500/10"
                >
                  {g.trim()}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-[1.1] text-glow">
              {anime.title}
            </h1>

            {/* Intelligence Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-zinc-900/40 rounded-[1.5rem] border border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase tracking-widest">Runtime</span>
                </div>
                <p className="text-[10px] font-black text-white uppercase">{anime.duration || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase tracking-widest">Source</span>
                </div>
                <p className="text-[10px] font-black text-white uppercase truncate">{anime.producers || 'Unknown'}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase tracking-widest">Access</span>
                </div>
                <p className="text-[10px] font-black text-red-500 uppercase">{infoData.views}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase tracking-widest">Date</span>
                </div>
                <p className="text-[10px] font-black text-white uppercase">{infoData.date}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-500">
                <Info className="w-4 h-4" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em]">Brief Intelligence</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{anime.sinopsis || 'No data provided.'}</p>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Streaming Nodes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {anime.streams?.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onSetActiveStream(s.url)}
                    className={`py-3 px-2 rounded-[1rem] font-black text-[9px] uppercase tracking-widest transition-all ${
                      activeStream === s.url
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-zinc-900 border border-white/5 hover:border-red-500/50'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="relative group">
            <img
              src={anime.img}
              className="w-full rounded-[2rem] shadow-2xl border border-white/5"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
          </div>

          <div className="bg-[#0a0a0b] p-6 rounded-[2rem] border border-white/5 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10">
                <HardDrive className="w-3.5 h-3.5 text-red-500" />
              </div>
              <h3 className="font-black uppercase text-xs tracking-widest">Payload Data</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {parsedSizes.length > 0 ? (
                parsedSizes.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-red-600/30 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Resolution</span>
                      <span className="text-[10px] font-black text-white">{s.resolution}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Size</span>
                      <div className="text-[10px] font-black text-red-500 font-mono">{s.size}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-zinc-600 font-black text-[9px] uppercase">No data</div>
              )}
            </div>
          </div>

          <div className="bg-[#0a0a0b] p-6 rounded-[2rem] border border-white/5 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                <Download className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-black uppercase text-xs tracking-widest">Acquire Link</h3>
            </div>
            <div className="space-y-4">
              {anime.download?.map((dl, i) => (
                <div key={i} className="space-y-2.5">
                  <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest px-2 border-l-2 border-red-600">
                    {dl.type}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {dl.links.map((link, li) => (
                      <a
                        key={li}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center text-[8px] bg-zinc-900 border border-white/5 py-2.5 rounded-lg hover:bg-white hover:text-black transition-all font-black uppercase tracking-tighter truncate px-1"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
