import React from 'react';

interface TornPaperEdgeProps {
  className?: string;
  flipped?: boolean;
}

export const TornPaperEdge: React.FC<TornPaperEdgeProps> = ({ className = '', flipped = false }) => {
  // Irregular torn edge path
  const path = `
    M0,0 
    L0,6
    L2,8 L4,5 L6,9 L8,6 L10,10 L12,5 L14,9 L16,6 L18,10 L20,5 
    L22,9 L24,6 L26,10 L28,6 L30,9 L32,5 L34,10 L36,6 L38,9 L40,5 
    L42,9 L44,6 L46,10 L48,6 L50,9 L52,5 L54,10 L56,6 L58,9 L60,5
    L62,9 L64,6 L66,10 L68,6 L70,9 L72,5 L74,10 L76,6 L78,9 L80,5
    L82,9 L84,6 L86,10 L88,6 L90,9 L92,5 L94,10 L96,6 L98,9 L100,5
    L100,0 
    Z
  `;

  return (
    <div className={`w-full overflow-hidden leading-[0] ${className}`}>
      <svg 
        viewBox="0 0 100 10" 
        preserveAspectRatio="none" 
        className={`w-full h-3 md:h-8 block ${flipped ? 'rotate-180' : ''}`}
        fill="currentColor"
      >
        <path d={path} />
      </svg>
    </div>
  );
};


