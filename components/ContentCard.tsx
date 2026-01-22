
import React from 'react';
import { Clock, PlayCircle } from 'lucide-react';

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
      className="group relative flex flex-col bg-[#0a0a0b] border border-white/5 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-red-600/50 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.3)]"
    >
      <div className="aspect-video overflow-hidden relative bg-zinc-900/50">
        <img 
          src={image} 
          alt={title} 
          referrerPolicy="no-referrer"
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <PlayCircle className="w-10 h-10 text-white/90 drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
        </div>

        <div className="absolute top-2 right-2 z-10 max-w-[80%]">
          {duration && (
            <div className="bg-black/90 backdrop-blur-md px-2 py-1 rounded text-[7px] md:text-[8px] font-black flex items-center gap-1.5 border border-white/10 shadow-xl">
              <Clock className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />
              <span className="uppercase tracking-tighter truncate">{duration}</span>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0b] to-transparent opacity-90" />
      </div>

      <div className="p-3 space-y-2 flex-grow flex flex-col bg-[#0a0a0b] z-20">
        <h3 className="font-bold text-[11px] md:text-[12px] line-clamp-2 leading-tight group-hover:text-red-500 transition-colors uppercase tracking-tight h-8">
          {title}
        </h3>
        
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto h-4 overflow-hidden">
            {genres.map((g, i) => (
              <span key={i} className="text-[6px] bg-zinc-900 border border-white/10 px-1 py-0.5 rounded text-zinc-500 font-bold uppercase tracking-tighter whitespace-nowrap">
                {g.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
