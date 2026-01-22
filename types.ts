
export interface AnimeLatestItem {
  title: string;
  upload: string;
  image: string; // API Latest menggunakan 'image'
  link: string;  // API Latest menggunakan 'link'
}

export interface AnimeReleaseItem {
  img: string;   // API Release menggunakan 'img'
  title: string;
  url: string;   // API Release menggunakan 'url'
  genre: string[];
  duration: string;
}

export interface AnimeSearchItem {
  img: string;
  title: string;
  url: string;
  genre: string[];
  duration: string;
}

export interface StreamSource {
  name: string;
  url: string;
}

export interface DownloadLink {
  name: string;
  link: string;
}

export interface DownloadCategory {
  type: string;
  title: string;
  links: DownloadLink[];
}

export interface AnimeDetail {
  title: string;
  info: string;
  img: string;
  sinopsis: string;
  genre: string;
  anime: string;
  producers: string;
  duration: string;
  size: string;
  streams: StreamSource[];
  download: DownloadCategory[];
}

export enum ViewState {
  AUTH = 'AUTH',
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  DETAIL = 'DETAIL',
  PRIVACY = 'PRIVACY',
  DMCA = 'DMCA',
  CONTACT = 'CONTACT',
  FAQ = 'FAQ'
}
