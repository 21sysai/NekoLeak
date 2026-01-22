
import React from 'react';
import { Search, Menu, X, LogOut, Bookmark, History } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onNavigateHome: () => void;
  onNavigateBookmarks: () => void;
  onNavigateHistory: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  onSignOut: () => void;
  currentView: ViewState;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onNavigateHome,
  onNavigateBookmarks,
  onNavigateHistory,
  isMenuOpen,
  setIsMenuOpen,
  onSignOut,
  currentView,
}) => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
          <div onClick={onNavigateHome} className="flex items-center gap-3 cursor-pointer group flex-shrink-0">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl group-hover:rotate-12 transition-all duration-500">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase hidden sm:block group-hover:text-red-500 transition-colors">
              NEKO<span className="text-red-600 group-hover:text-white">LEAK</span>
            </h1>
          </div>

          <div className="flex-grow flex items-center justify-center max-w-2xl hidden md:flex">
            <form onSubmit={onSearch} className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="SEARCH DATABASE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[11px] font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600/20 w-full transition-all placeholder:text-zinc-700"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2 mr-2 border-r border-white/10 pr-4">
              <button 
                onClick={onNavigateBookmarks}
                className={`p-2.5 rounded-xl transition-all ${currentView === ViewState.BOOKMARKS ? 'bg-red-600 text-white' : 'hover:bg-zinc-900 text-zinc-400'}`}
                title="Bookmarks"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button 
                onClick={onNavigateHistory}
                className={`p-2.5 rounded-xl transition-all ${currentView === ViewState.HISTORY ? 'bg-red-600 text-white' : 'hover:bg-zinc-900 text-zinc-400'}`}
                title="History"
              >
                <History className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onSignOut}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
            >
              Sign Out
            </button>
            <button className="md:hidden p-2 text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[150] bg-[#050505] p-10 space-y-10 md:hidden animate-slide-up">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { onNavigateBookmarks(); setIsMenuOpen(false); }}
              className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border border-white/5 gap-3 transition-all ${currentView === ViewState.BOOKMARKS ? 'bg-red-600' : 'bg-zinc-900'}`}
            >
              <Bookmark className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Bookmarks</span>
            </button>
            <button 
              onClick={() => { onNavigateHistory(); setIsMenuOpen(false); }}
              className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border border-white/5 gap-3 transition-all ${currentView === ViewState.HISTORY ? 'bg-red-600' : 'bg-zinc-900'}`}
            >
              <History className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">History</span>
            </button>
          </div>

          <form
            onSubmit={(e) => {
              onSearch(e);
              setIsMenuOpen(false);
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="SEARCH..."
              className="w-full bg-zinc-900 p-5 rounded-2xl text-xl font-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="w-full bg-red-600 p-5 rounded-2xl font-black uppercase">
              Search
            </button>
          </form>
          <button
            onClick={onSignOut}
            className="w-full p-5 border border-white/10 rounded-2xl font-black uppercase text-red-500"
          >
            Log Out
          </button>
        </div>
      )}
    </>
  );
};
