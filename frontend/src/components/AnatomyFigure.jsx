import { useEffect, useRef } from 'react';
import AnatomySVG from './AnatomyFigure.svg?react';

export default function AnatomyFigure({ className = '' }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`anatomy-wrapper ${className}`}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 1.2s ease, transform 1.2s ease',
      }}
    >
      <AnatomySVG />
    </div>
  );
}
