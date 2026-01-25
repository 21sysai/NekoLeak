
import React from 'react';

interface Props {
  src: string;
  className?: string;
}

export const AdBlockedIframe: React.FC<Props> = ({ src, className = '' }) => {
  return (
    <div className="relative w-full h-full">
      <iframe
        key={src} 
        src={src}
        className={className}
        allowFullScreen
        frameBorder="0"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        referrerPolicy="no-referrer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};
