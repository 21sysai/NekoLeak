
import React from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AnimeSearchItem } from '../types';
import { ContentCard } from './ContentCard';

interface SearchViewProps {
  loading: boolean;
  searchQuery: string;
  searchResults: AnimeSearchItem[];
  onGoBack: () => void;
  onLoadDetail: (url: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  loading,
  searchQuery,
  searchResults,
  onGoBack,
  onLoadDetail,
}) => {
  return (
    <div className="px-6 md:px-12 py-10 space-y-10 animate-slide-up max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-white/5 pb-10">
        <button
          onClick={onGoBack}
          className="p-4 bg-zinc-900 hover:bg-red-600 rounded-2xl transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Search Results: <span className="text-red-600">{searchQuery}</span>
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Found {searchResults.length} nodes</p>
        </div>
      </div>
      {loading ? (
        <div className="py-40 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase">
            Decrypting...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {searchResults.map((item, i) => (
            <ContentCard
              key={i}
              title={item.title}
              image={item.img}
              duration={item.duration}
              genres={item.genre}
              onClick={() => onLoadDetail(item.url)}
            />
          ))}
          {searchResults.length === 0 && (
            <div className="col-span-full py-40 text-center text-zinc-600 uppercase font-black tracking-widest">
              No results found in the database.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
