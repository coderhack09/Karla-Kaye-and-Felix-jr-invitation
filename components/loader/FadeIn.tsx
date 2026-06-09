import React, { useEffect, useState } from 'react';
import { FadeProps } from '../types';

export const FadeIn: React.FC<FadeProps> = ({ show, children, className = '', delay = 0 }) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`transition-all duration-1000 ease-in-out ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      onTransitionEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};
