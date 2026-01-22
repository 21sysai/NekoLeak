
import React, { useState, useEffect } from 'react';
import { BANNER_DATA } from '../constants';

export const Banner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_DATA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden group">
      {BANNER_DATA.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/80 via-transparent to-transparent z-10" />
          
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[10s]"
          />

          <div className="absolute bottom-20 left-6 md:left-12 z-20 max-w-2xl space-y-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit">
              {slide.icon}
              <span className="text-xs font-bold uppercase tracking-wider">{slide.tag}</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-red-500 font-bold text-sm tracking-widest uppercase">{slide.subtitle}</h3>
              <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">
                {slide.title}
              </h2>
            </div>
            
            <p className="text-gray-300 text-sm md:text-lg line-clamp-2 font-medium">
              {slide.description}
            </p>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-8 right-12 z-20 flex gap-2">
        {BANNER_DATA.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 transition-all duration-300 rounded-full ${
              idx === current ? 'w-8 bg-red-500' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
