
import { AnimeLatestItem, AnimeReleaseItem, AnimeSearchItem, AnimeDetail } from '../types';

// Sekarang murni mengambil dari environment, tanpa ada string URL di dalam kode
const BASE_PROXY_URL = process.env.BASE_PROXY_URL;

class ApiService {
  private requestLog: number[] = [];
  private cache: Map<string, { data: any, timestamp: number }> = new Map();

  private isRateLimited(): boolean {
    const now = Date.now();
    this.requestLog = this.requestLog.filter(t => now - t < 60000);
    return this.requestLog.length >= 30;
  }

  private async fetchWithProxy<T>(path: string, params: Record<string, string> = {}): Promise<T> {
    if (!BASE_PROXY_URL) {
      throw new Error('CRITICAL ERROR: BASE_PROXY_URL is not defined in Environment Variables.');
    }

    if (this.isRateLimited()) {
      throw new Error('Rate limit exceeded (30 req/min). Please wait.');
    }

    const query = new URLSearchParams(params).toString();
    const fullUrl = `${BASE_PROXY_URL}${path}${query ? '?' + query : ''}`;
    
    const cached = this.cache.get(fullUrl);
    const now = Date.now();
    if (cached && (now - cached.timestamp < 10 * 60 * 1000)) {
      return cached.data;
    }

    this.requestLog.push(now);

    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const json = await response.json();
    this.cache.set(fullUrl, { data: json, timestamp: now });
    
    return json;
  }

  async getLatest(): Promise<AnimeReleaseItem[]> {
    const res = await this.fetchWithProxy<{ results: AnimeLatestItem[] }>('/latest');
    if (!res || !res.results) return [];
    
    return res.results.map(item => ({
      img: item.image,
      title: item.title,
      url: item.link,
      genre: [],
      duration: item.upload || 'Recently'
    }));
  }

  async getReleases(page: number = 1): Promise<AnimeReleaseItem[]> {
    const res = await this.fetchWithProxy<{ data: AnimeReleaseItem[] }>(`/release/${page}`);
    return res.data || [];
  }

  async search(query: string): Promise<AnimeSearchItem[]> {
    const res = await this.fetchWithProxy<{ data: AnimeSearchItem[] }>(`/search/${encodeURIComponent(query)}`);
    return res.data || [];
  }

  async getDetail(url: string): Promise<AnimeDetail> {
    const res = await this.fetchWithProxy<{ data: AnimeDetail }>('/get', { url });
    return res.data;
  }
}

export const api = new ApiService();
