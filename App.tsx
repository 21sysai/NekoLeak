
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, ChevronLeft, ChevronRight, Play, Download, ArrowLeft, 
  Loader2, Monitor, AlertCircle, Shield, FileText, Mail, 
  HelpCircle, ExternalLink, Activity, Info, Calendar, HardDrive, User, Clock, Zap, X, Lock, Key, Send, Sparkles
} from 'lucide-react';
import { ViewState, AnimeLatestItem, AnimeReleaseItem, AnimeSearchItem, AnimeDetail } from './types';
import { api } from './services/api';
import { Banner } from './components/Banner';
import { ContentCard } from './components/ContentCard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [latest, setLatest] = useState<AnimeReleaseItem[]>([]);
  const [releases, setReleases] = useState<AnimeReleaseItem[]>([]);
  const [searchResults, setSearchResults] = useState<AnimeSearchItem[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AnimeDetail | null>(null);
  const [activeStream, setActiveStream] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const BOT_USERNAME = "NekoLeak_bot"; 

  useEffect(() => {
    const savedKey = localStorage.getItem('NEKO_ACCESS_TOKEN');
    if (savedKey) {
      setView(ViewState.HOME);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = accessKey.trim().toUpperCase();
    if (!cleanKey) return;

    setLoading(true);
    setAuthError('');

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: cleanKey }),
      });

      const result = await response.json();

      if (response.ok && result.valid) {
        localStorage.setItem('NEKO_ACCESS_TOKEN', cleanKey);
        setView(ViewState.HOME);
      } else {
        setAuthError(result.message || 'INVALID ACCESS PROTOCOL.');
      }
    } catch (err) {
      const keyPattern = /^NK-[A-Z0-9]{6}$/;
      if (keyPattern.test(cleanKey)) {
        localStorage.setItem('NEKO_ACCESS_TOKEN', cleanKey);
        setView(ViewState.HOME);
      } else {
        setAuthError('CONNECTION ERROR OR INVALID KEY FORMAT.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    if (view === ViewState.AUTH) return;
    setLoading(true);
    setError(null);
    try {
      const [latestData, releasesData] = await Promise.all([
        api.getLatest(),
        api.getReleases(currentPage)
      ]);
      setLatest(latestData);
      setReleases(releasesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, view]);

  useEffect(() => {
    if (view === ViewState.HOME) fetchData();
  }, [fetchData, view]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setView(ViewState.SEARCH);
    try {
      const results = await api.search(searchQuery);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await api.getDetail(url);
      setSelectedAnime(detail);
      setActiveStream(detail.streams?.[0]?.url || null);
      setView(ViewState.DETAIL);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (view === ViewState.DETAIL) {
      setView(searchQuery ? ViewState.SEARCH : ViewState.HOME);
    } else {
      setView(ViewState.HOME);
      setSearchQuery('');
    }
  };

  if (view === ViewState.AUTH) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="max-w-md w-full space-y-8 text-center animate-slide-up relative z-10">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)] border border-white/10 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tighter text-glow">NEKO<span className="text-red-600">LEAK</span></h1>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Restricted Access Area</p>
            </div>
          </div>
          <div className="bg-[#0a0a0b] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="text"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                  placeholder="NK-XXXXXX"
                  disabled={loading}
                  className="w-full bg-[#050505] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs font-black tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-zinc-800"
                />
              </div>
              {authError && (
                <div className="flex items-center justify-center gap-2 p-3 bg-red-600/5 border border-red-600/10 rounded-lg">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  <p className="text-[9px] text-red-600 font-black uppercase tracking-widest">{authError}</p>
                </div>
              )}
              <button type="submit" disabled={loading || !accessKey} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.3em] shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "VERIFY IDENTITY"}
              </button>
            </form>
            <div className="pt-4 border-t border-white/5 text-center">
              <a href={`https://t.me/${BOT_USERNAME}?start=request`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                <Send className="w-4 h-4 text-sky-500" />
                <span className="text-[10px] font-black uppercase tracking-widest underline decoration-sky-500/30 underline-offset-4">Get Key from Telegram Bot</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-red-500 selection:text-white flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/95 backdrop-blur-3xl border-b border-white/5 px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div onClick={() => { setView(ViewState.HOME); setSearchQuery(''); }} className="flex items-center gap-2 cursor-pointer group flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden shadow-lg group-hover:rotate-6 transition-transform">
             <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-[900] tracking-tighter uppercase hidden sm:block">NEKO<span className="text-red-600">LEAK</span></h1>
        </div>

        {/* Dynamic Search + Logout Area */}
        <div className="flex items-center gap-2 md:gap-4 flex-grow justify-end max-w-4xl">
           <form onSubmit={handleSearch} className="relative flex-grow max-w-[120px] xs:max-w-[180px] md:max-w-xs transition-all duration-300">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
            <input 
              type="text"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border border-white/5 rounded-lg py-2 pl-8 pr-3 text-[9px] md:text-[10px] font-black tracking-widest focus:outline-none focus:ring-1 focus:ring-red-600/50 w-full placeholder:text-zinc-700"
            />
          </form>
          <button 
            onClick={() => { localStorage.removeItem('NEKO_ACCESS_TOKEN'); window.location.reload(); }} 
            className="flex-shrink-0 px-3 md:px-5 py-2 md:py-2.5 bg-red-600 text-white rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="pt-16 md:pt-20 flex-grow">
        {view === ViewState.HOME && (
          <div className="animate-in fade-in duration-1000">
            <Banner />
            
            {/* Section: LATEST UPDATE */}
            <section className="px-4 md:px-12 py-10 space-y-8 max-w-[1600px] mx-auto border-b border-white/5">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Latest Update</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading ? [...Array(4)].map((_, i) => <div key={i} className="aspect-video bg-zinc-900/50 animate-pulse rounded-xl" />) : 
                latest.slice(0, 8).map((item, i) => (
                  <ContentCard key={i} title={item.title} image={item.img} duration={item.duration} onClick={() => loadDetail(item.url)} />
                ))}
              </div>
            </section>

            {/* Section: GLOBAL RELEASES */}
            <section className="px-4 md:px-12 pt-10 pb-2 space-y-8 max-w-[1600px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-red-600" />
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Global Releases</h2>
                </div>
                <div className="flex items-center gap-4 bg-[#0a0a0b] border border-white/5 p-1 rounded-xl shadow-xl">
                   <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 hover:bg-red-600 disabled:opacity-20 rounded-lg transition-all"><ChevronLeft className="w-4 h-4" /></button>
                   <span className="text-base font-black text-red-500 px-3">{currentPage}</span>
                   <button onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 hover:bg-red-600 rounded-lg transition-all"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => <div key={i} className="aspect-video bg-zinc-900/50 animate-pulse rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {releases.map((item, i) => <ContentCard key={i} title={item.title} image={item.img} duration={item.duration} genres={item.genre} onClick={() => loadDetail(item.url)} />)}
                </div>
              )}
            </section>
          </div>
        )}

        {view === ViewState.SEARCH && (
          <div className="px-4 md:px-12 py-10 space-y-8 animate-slide-up">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <button onClick={goBack} className="p-2 hover:bg-zinc-900 rounded-full transition-colors"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-xl font-black uppercase tracking-tighter">Found Result for: <span className="text-red-600">{searchQuery}</span></h2>
            </div>
            {loading ? (
               <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {searchResults.map((item, i) => <ContentCard key={i} title={item.title} image={item.img} duration={item.duration} genres={item.genre} onClick={() => loadDetail(item.url)} />)}
              </div>
            )}
          </div>
        )}

        {view === ViewState.DETAIL && selectedAnime && (
          <div className="px-4 md:px-12 py-8 max-w-[1400px] mx-auto animate-slide-up">
             <button onClick={goBack} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 font-black uppercase text-[10px] tracking-widest transition-colors"><ArrowLeft className="w-4 h-4" /> Return to Archive</button>
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                   <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative group">
                      <iframe src={activeStream || ''} className="w-full h-full" allowFullScreen frameBorder="0" />
                   </div>
                   <div className="bg-[#0a0a0b] p-6 md:p-10 rounded-3xl border border-white/5 space-y-6">
                      <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-tight border-l-4 border-red-600 pl-4">{selectedAnime.title}</h1>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnime.genre?.split(',').map((g, i) => <span key={i} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-red-600/10 text-red-500 rounded-full border border-red-500/10">{g.trim()}</span>)}
                      </div>
                      <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium">{selectedAnime.sinopsis}</p>
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nodes Available</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {selectedAnime.streams?.map((s, i) => (
                            <button key={i} onClick={() => setActiveStream(s.url)} className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${activeStream === s.url ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-900 border border-white/5 hover:border-red-500/50'}`}>
                              {s.name}
                            </button>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-4 space-y-8">
                   <img 
                    src={selectedAnime.img} 
                    className="w-full rounded-3xl shadow-2xl border border-white/5" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                     e.currentTarget.src = '/logo.png';
                     e.currentTarget.classList.add('bg-zinc-900', 'p-12', 'object-contain');
                   }} />
                   <div className="bg-[#0a0a0b] p-8 rounded-3xl border border-white/5 space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Download className="w-5 h-5 text-red-600" />
                        <h3 className="font-black uppercase text-lg tracking-tighter">Payloads</h3>
                      </div>
                      <div className="space-y-4">
                        {selectedAnime.download?.map((dl, i) => (
                          <div key={i} className="space-y-3">
                            <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{dl.type}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {dl.links.map((link, li) => <a key={li} href={link.link} target="_blank" rel="noopener noreferrer" className="text-center text-[9px] bg-zinc-900 border border-white/5 py-2.5 rounded-xl hover:bg-red-600 transition-all font-black uppercase tracking-widest">{link.name}</a>)}
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="py-8 px-6 border-t border-white/5 text-center bg-[#030303] mt-0">
         <div className="max-w-4xl mx-auto space-y-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-lg mx-auto border border-white/10 overflow-hidden shadow-xl">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tighter">NEKO<span className="text-red-600">LEAK</span></h2>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-loose">
              AUTHORIZED ACCESS ONLY. ALL DATA ENCRYPTED. &copy; 2026 NEXUS OPS.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default App;
