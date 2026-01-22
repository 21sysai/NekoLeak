
import React, { useState, useEffect } from 'react';
import { BANNER_DATA } from '../constants';
import { Play, Info } from 'lucide-react';

export const Banner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_DATA.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[65vh] md:h-[85vh] overflow-hidden group perspective-1000">
      {BANNER_DATA.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${
            idx === current ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent z-10" />
          
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover transform animate-kenburns"
          />

          <div className="absolute bottom-24 left-6 md:left-16 z-20 max-w-3xl space-y-6">
            <div className={`transition-all duration-1000 delay-300 transform ${idx === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center gap-3 bg-red-600/10 backdrop-blur-xl border border-red-600/20 px-4 py-1.5 rounded-full w-fit">
                {slide.icon}
                <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">{slide.tag}</span>
              </div>
            </div>
            
            <div className={`space-y-2 transition-all duration-1000 delay-500 transform ${idx === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h3 className="text-zinc-500 font-black text-xs md:text-sm tracking-[0.4em] uppercase">{slide.subtitle}</h3>
              <h2 className="text-5xl md:text-8xl font-black leading-tight tracking-tighter text-glow-red italic">
                {slide.title}
              </h2>
            </div>
            
            <p className={`text-zinc-400 text-sm md:text-xl line-clamp-2 font-medium max-w-xl transition-all duration-1000 delay-700 transform ${idx === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {slide.description}
            </p>
          </div>
        </div>
      ))}

      {/* Modern Indicators */}
      <div className="absolute bottom-12 right-12 z-20 flex flex-col gap-3">
        {BANNER_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-700 rounded-full h-1.5 ${
              idx === current ? 'w-10 bg-red-600' : 'w-4 bg-zinc-800 hover:bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
