import React, { useEffect, useId, useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';
import useMediaQuery from '../../hooks/useMediaQuery';
import OptimizedImage, { imageMetadata } from './OptimizedImage';

/** Static poster by default; the complete original GIF remains available on request. */
export default function ProjectPreview({ src, alt, sizes }) {
  const metadata = imageMetadata(src);
  const animated = metadata?.animated;
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const container = useRef(null);
  const previewId = useId();

  useEffect(() => { if (reducedMotion) setPlaying(false); }, [reducedMotion]);
  useEffect(() => {
    if (!animated || !playing) return undefined;
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', hide);
    let observer;
    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) setPlaying(false); });
      observer.observe(container.current);
    }
    return () => { document.removeEventListener('visibilitychange', hide); observer?.disconnect(); };
  }, [animated, playing]);

  return (
    <div className="portfolio__item-image" ref={container}>
      <div id={previewId}>
        {playing
          ? <img src={src} alt={alt} width={metadata.width} height={metadata.height} decoding="async" />
          : <OptimizedImage src={src} alt={alt} sizes={sizes} />}
      </div>
      {animated && <button type="button" className="project-preview__toggle" aria-controls={previewId} onClick={() => setPlaying(value => !value)}>
        {playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
        {playing ? 'Detener animación' : 'Reproducir animación'}
        <span className="visually-hidden"> de {alt}</span>
      </button>}
    </div>
  );
}
