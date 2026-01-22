
import React from 'react';
import { Play, Flame, Zap } from 'lucide-react';

export const BANNER_DATA = [
  {
    id: 1,
    title: "NEKOLEAK",
    subtitle: "DIRECT LEAK FROM SOURCE",
    description: "No iklan njir",
    image: "/banner1.jpg",
    tag: "High Alert",
    icon: <Zap className="w-4 h-4 text-yellow-500" />
  },
  {
    id: 2,
    title: "Phantom Protocol",
    subtitle: "2026 CYBERPUNK MASTERPIECE",
    description: "Lorem ipsum.",
    image: "/banner2.jpg",
    tag: "Premium",
    icon: <Flame className="w-4 h-4 text-red-500" />
  },
  {
    id: 3,
    title: "FREE API",
    subtitle: "SANKAVOLLEREI",
    description: "Hidup lontwe.",
    image: "/banner3.jpg",
    tag: "Verified",
    icon: <Play className="w-4 h-4 text-blue-500" />
  }
];

export const CACHE_TIME = 10 * 60 * 1000;
export const RATE_LIMIT = 30;
