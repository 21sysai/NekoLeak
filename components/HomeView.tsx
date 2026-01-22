
import React from 'react';
import { Sparkles, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeReleaseItem } from '../types';
import { Banner } from './Banner';
import { ContentCard } from './ContentCard';

interface HomeViewProps {
  loading: boolean;
  latest: AnimeReleaseItem[];
  releases: AnimeReleaseItem[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onLoadDetail: (url: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  loading,
  latest,
  releases,
  currentPage,
  setCurrentPage,
  onLoadDetail,
}) => {
  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      <Banner />
      
      <section className="px-6 md:px-12 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-600 rounded-full" />
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
            Latest Decryption <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && latest.length === 0
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-video bg-zinc-900 animate-pulse rounded-2xl" />
              ))
            : latest.slice(0, 12).map((item, i) => (
                <ContentCard
                  key={i}
                  title={item.title}
                  image={item.img}
                  duration={item.duration}
                  onClick={() => onLoadDetail(item.url)}
                />
              ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-10 bg-zinc-900/20 space-y-8 max-w-[1600px] mx-auto rounded-[2.5rem] border border-white/5 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600/10 rounded-xl flex items-center justify-center">
              <Activity className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Global Archive</h2>
          </div>
          <div className="flex items-center gap-2 bg-black border border-white/10 p-1.5 rounded-2xl shadow-2xl">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2.5 hover:bg-red-600 disabled:opacity-20 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-5 flex flex-col items-center min-w-[70px]">
              <span className="text-[9px] font-black text-zinc-600 uppercase">Page</span>
              <span className="text-base font-black text-red-500 leading-none">{currentPage}</span>
            </div>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2.5 hover:bg-red-600 rounded-xl transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video bg-zinc-900/50 animate-pulse rounded-2xl" />
              ))
            : releases.map((item, i) => (
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
      </section>
    </div>
  );
};
