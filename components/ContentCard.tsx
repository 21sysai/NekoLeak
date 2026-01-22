
import React from 'react';
import { Clock, PlayCircle, Zap } from 'lucide-react';

interface Props {
  title: string;
  image: string;
  subtitle?: string;
  genres?: string[];
  duration?: string;
  onClick: () => void;
}

export const ContentCard: React.FC<Props> = ({ title, image, subtitle, genres, duration, onClick }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src.includes('/logo.png')) return;
    target.src = '/logo.png';
    target.classList.add('p-12', 'bg-zinc-900', 'object-contain');
  };

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col bg-[#0a0a0b] border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-red-600/40 hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.2)] transform hover:-translate-y-1"
    >
      <div className="aspect-video overflow-hidden relative bg-zinc-900/50">
        <img 
          src={image} 
          alt={title} 
          referrerPolicy="no-referrer"
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
              <PlayCircle className="w-8 h-8 text-white fill-white/20" />
            </div>
        </div>

        {/* Badge */}
        <div className="absolute top-3 right-3 z-10">
          {duration && (
            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[8px] font-black flex items-center gap-2 border border-white/10 shadow-2xl">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              <span className="uppercase tracking-widest text-zinc-100">{duration}</span>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent opacity-90" />
      </div>

      <div className="p-4 space-y-3 flex-grow flex flex-col bg-[#0a0a0b] z-20">
        <h3 className="font-extrabold text-[12px] md:text-[13px] line-clamp-2 leading-tight group-hover:text-red-500 transition-colors uppercase tracking-tight h-10">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1.5 h-4 overflow-hidden">
            {genres && genres.length > 0 ? (
              genres.slice(0, 2).map((g, i) => (
                <span key={i} className="text-[7px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-zinc-500 font-black uppercase tracking-widest whitespace-nowrap">
                  {g.trim()}
                </span>
              ))
            ) : (
              <span className="text-[7px] text-zinc-700 font-black uppercase tracking-widest">Global Archive</span>
            )}
          </div>
          <Zap className="w-3 h-3 text-zinc-800 group-hover:text-red-600 transition-colors" />
        </div>
      </div>
    </div>
  );
};
