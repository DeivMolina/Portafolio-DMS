import React, { useEffect, useId, useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';
import useMediaQuery from '../hooks/useMediaQuery';

const Typewriter = ({ texts, speed = 150, eraseSpeed = 100, delay = 1000 }) => {
  const enabled = useMediaQuery('(min-width: 600px) and (prefers-reduced-motion: no-preference)');
  const [frame, setFrame] = useState(() => ({ index: 0, count: texts[0]?.length || 0, phase: 'hold' }));
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const [onScreen, setOnScreen] = useState(true);
  const element = useRef(null);
  const textId = useId();
  const currentText = texts[frame.index % texts.length] || '';
  const canAnimate = enabled && texts.length > 1;
  const running = canAnimate && !paused && pageVisible && onScreen;

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function' || !element.current) return undefined;
    const observer = new IntersectionObserver(entries => setOnScreen(entries[0].isIntersecting));
    observer.observe(element.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const wait = frame.phase === 'hold' ? delay : frame.phase === 'deleting' ? eraseSpeed : speed;
    const timer = setTimeout(() => {
      setFrame(previous => {
        const index = previous.index % texts.length;
        const length = texts[index].length;
        const count = Math.min(previous.count, length);
        if (previous.phase === 'hold') return { index, count, phase: 'deleting' };
        if (previous.phase === 'deleting') {
          return count > 0
            ? { index, count: count - 1, phase: 'deleting' }
            : { index: (index + 1) % texts.length, count: 0, phase: 'typing' };
        }
        const next = Math.min(count + 1, length);
        return { index, count: next, phase: next === length ? 'hold' : 'typing' };
      });
    }, wait);
    return () => clearTimeout(timer);
  }, [running, frame, texts, speed, eraseSpeed, delay]);

  const togglePause = () => {
    if (!paused) setFrame(previous => ({ ...previous, count: currentText.length, phase: 'hold' }));
    setPaused(previous => !previous);
  };

  if (!texts.length) return null;

  return (
    <div className="typewriter" ref={element}>
      <h1 className={`header__title${canAnimate ? ' typewriter-title' : ''}`} aria-label={texts[0]} data-running={running}>
        <span id={textId} aria-hidden="true">{canAnimate ? currentText.slice(0, frame.count) : texts[0]}</span>
      </h1>
      {canAnimate && (
        <button type="button" className="typewriter__control" onClick={togglePause} aria-controls={textId}>
          {paused ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}
          {paused ? 'Reanudar animación' : 'Pausar animación'}
        </button>
      )}
    </div>
  );
};

export default Typewriter;
