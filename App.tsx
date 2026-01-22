
import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, History as HistoryIcon } from 'lucide-react';
import { ViewState, AnimeReleaseItem, AnimeSearchItem, AnimeDetail } from './types';
import { api } from './services/api';
import { Security } from './utils/security';

// Sub-components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthView } from './components/AuthView';
import { DetailView } from './components/DetailView';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { ListView } from './components/ListView';
import { PolicyView } from './components/PolicyView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [authError, setAuthError] = useState('');

  const [latest, setLatest] = useState<AnimeReleaseItem[]>([]);
  const [releases, setReleases] = useState<AnimeReleaseItem[]>([]);
  const [searchResults, setSearchResults] = useState<AnimeSearchItem[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AnimeDetail | null>(null);
  const [activeStream, setActiveStream] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [bookmarks, setBookmarks] = useState<AnimeReleaseItem[]>([]);
  const [history, setHistory] = useState<AnimeReleaseItem[]>([]);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('NEKO_ACCESS_TOKEN');
    localStorage.removeItem('NEKO_AUTH_TIME');
    setView(ViewState.AUTH);
    setAccessKey('');
    setAuthError('');
  }, []);

  // Monitor Sesi: Cek tiap 30 detik apakah key masih valid
  useEffect(() => {
    const checkSession = () => {
      const savedKey = localStorage.getItem('NEKO_ACCESS_TOKEN');
      if (savedKey) {
        const validation = Security.verifySecureKey(savedKey);
        if (!validation.isValid) {
          handleSignOut();
          setAuthError(validation.reason || 'SESSION EXPIRED');
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, [handleSignOut]);

  useEffect(() => {
    const savedKey = localStorage.getItem('NEKO_ACCESS_TOKEN');
    if (savedKey) {
      const validation = Security.verifySecureKey(savedKey);
      if (validation.isValid) {
        setView(ViewState.HOME);
      } else {
        handleSignOut();
      }
    }

    const savedBookmarks = localStorage.getItem('NEKO_BOOKMARKS');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const savedHistory = localStorage.getItem('NEKO_HISTORY');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, [handleSignOut]);

  useEffect(() => {
    localStorage.setItem('NEKO_BOOKMARKS', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('NEKO_HISTORY', JSON.stringify(history));
  }, [history]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = accessKey.trim().toUpperCase();
    if (!cleanKey) return;

    setLoading(true);
    setAuthError('');

    // Simulasi proses dekripsi terminal
    await new Promise(r => setTimeout(r, 1200));

    const validation = Security.verifySecureKey(cleanKey);
    if (validation.isValid) {
      localStorage.setItem('NEKO_ACCESS_TOKEN', cleanKey);
      setView(ViewState.HOME);
    } else {
      setAuthError(validation.reason || 'ACCESS DENIED');
    }
    setLoading(false);
  };

  const fetchData = useCallback(async () => {
    if (view !== ViewState.HOME) return;
    setLoading(true);
    try {
      const [latestData, releasesData] = await Promise.all([
        api.getLatest(),
        api.getReleases(currentPage)
      ]);
      setLatest(latestData);
      setReleases(releasesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, view]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setView(ViewState.SEARCH);
    try {
      const results = await api.search(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (url: string) => {
    setLoading(true);
    try {
      const detail = await api.getDetail(url);
      setSelectedAnime(detail);
      setActiveStream(detail.streams?.[0]?.url || null);
      
      const historyItem: AnimeReleaseItem = {
        title: detail.title,
        img: detail.img,
        url: url,
        genre: (detail.genre || '').split(',').map(g => g.trim()).filter(Boolean),
        duration: detail.duration
      };

      setHistory(prev => {
        const filtered = prev.filter(item => item.url !== url);
        return [historyItem, ...filtered].slice(0, 50);
      });

      setView(ViewState.DETAIL);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
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

  const navigateHome = () => {
    setView(ViewState.HOME);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmark = () => {
    if (!selectedAnime) return;
    const isCurrentlyBookmarked = bookmarks.some(b => b.title === selectedAnime.title);

    if (isCurrentlyBookmarked) {
      setBookmarks(prev => prev.filter(b => b.title !== selectedAnime.title));
    } else {
      const newBookmark: AnimeReleaseItem = {
        title: selectedAnime.title,
        img: selectedAnime.img,
        url: '', 
        genre: (selectedAnime.genre || '').split(',').map(g => g.trim()).filter(Boolean),
        duration: selectedAnime.duration
      };
      const foundItem = [...latest, ...releases, ...searchResults, ...history].find(i => i.title === selectedAnime.title);
      if (foundItem) newBookmark.url = foundItem.url;
      setBookmarks(prev => [newBookmark, ...prev]);
    }
  };

  if (view === ViewState.AUTH) {
    return (
      <AuthView
        accessKey={accessKey}
        setAccessKey={setAccessKey}
        onAuth={handleAuth}
        loading={loading}
        authError={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-inter">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onNavigateHome={navigateHome}
        onNavigateBookmarks={() => setView(ViewState.BOOKMARKS)}
        onNavigateHistory={() => setView(ViewState.HISTORY)}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onSignOut={handleSignOut}
        currentView={view}
      />

      <main className="pt-24 md:pt-28 flex-grow">
        {view === ViewState.HOME && (
          <HomeView
            loading={loading}
            latest={latest}
            releases={releases}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onLoadDetail={loadDetail}
          />
        )}

        {view === ViewState.SEARCH && (
          <SearchView
            loading={loading}
            searchQuery={searchQuery}
            searchResults={searchResults}
            onGoBack={goBack}
            onLoadDetail={loadDetail}
          />
        )}

        {view === ViewState.BOOKMARKS && (
          <ListView 
            title="Bookmarks"
            items={bookmarks}
            icon={<Bookmark className="w-6 h-6" />}
            onGoBack={navigateHome}
            onLoadDetail={loadDetail}
            emptyMessage="No bookmarks found in your archive."
          />
        )}

        {view === ViewState.HISTORY && (
          <ListView 
            title="Watch History"
            items={history}
            icon={<HistoryIcon className="w-6 h-6" />}
            onGoBack={navigateHome}
            onLoadDetail={loadDetail}
            onClearAll={() => setHistory([])}
            emptyMessage="Your watch history is currently empty."
          />
        )}

        {(view === ViewState.TERMS || view === ViewState.PRIVACY || view === ViewState.DMCA) && (
          <PolicyView 
            type={view as any} 
            onGoBack={navigateHome} 
          />
        )}

        {view === ViewState.DETAIL && selectedAnime && (
          <DetailView
            anime={selectedAnime}
            activeStream={activeStream}
            onSetActiveStream={setActiveStream}
            onGoBack={goBack}
            isBookmarked={bookmarks.some(b => b.title === selectedAnime.title)}
            onToggleBookmark={toggleBookmark}
          />
        )}
      </main>

      <Footer 
        onNavigateTerms={() => { setView(ViewState.TERMS); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onNavigatePrivacy={() => { setView(ViewState.PRIVACY); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onNavigateDMCA={() => { setView(ViewState.DMCA); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />
    </div>
  );
};

export default App;
