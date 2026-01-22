
import React from 'react';
import { ArrowLeft, Trash2, Bookmark, History } from 'lucide-react';
import { AnimeReleaseItem } from '../types';
import { ContentCard } from './ContentCard';

interface ListViewProps {
  title: string;
  items: AnimeReleaseItem[];
  icon: React.ReactNode;
  onGoBack: () => void;
  onLoadDetail: (url: string) => void;
  onClearAll?: () => void;
  emptyMessage: string;
}

export const ListView: React.FC<ListViewProps> = ({
  title,
  items,
  icon,
  onGoBack,
  onLoadDetail,
  onClearAll,
  emptyMessage,
}) => {
  return (
    <div className="px-6 md:px-12 py-8 space-y-8 animate-slide-up max-w-[1600px] mx-auto min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
          <button
            onClick={onGoBack}
            className="p-3.5 bg-zinc-900 hover:bg-red-600 rounded-2xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
              {icon}
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {title}
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">
                {items.length} nodes archived
              </p>
            </div>
          </div>
        </div>

        {onClearAll && items.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <ContentCard
              key={i}
              title={item.title}
              image={item.img}
              duration={item.duration}
              genres={item.genre}
              onClick={() => onLoadDetail(item.url)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center gap-5 opacity-20">
          <div className="scale-[1.5]">
             {icon}
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
};
