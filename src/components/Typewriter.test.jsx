import React, { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Typewriter from './Typewriter';

const texts = ['David', 'Full Stack', 'Creativo'];
let reduced, width, hidden, observerCallback, disconnect;
let listeners;
const originalMatchMedia = window.matchMedia;
const originalObserver = global.IntersectionObserver;
const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden');

beforeEach(() => {
  jest.useFakeTimers();
  reduced = false; width = 1440; hidden = false; listeners = new Set();
  window.matchMedia = jest.fn(query => ({
    get matches() { return query.includes('min-width') ? width >= 600 && !reduced : reduced; },
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
  }));
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
  disconnect = jest.fn();
  global.IntersectionObserver = jest.fn(callback => {
    observerCallback = callback;
    return { observe: jest.fn(), disconnect };
  });
});

afterEach(() => {
  cleanup();
  jest.clearAllTimers(); jest.useRealTimers();
  window.matchMedia = originalMatchMedia;
  global.IntersectionObserver = originalObserver;
  if (originalHidden) Object.defineProperty(document, 'hidden', originalHidden);
  else delete document.hidden;
});

function tick(milliseconds = 10) { act(() => jest.advanceTimersByTime(milliseconds)); }
function preferences(update) { act(() => { update(); listeners.forEach(listener => listener()); }); }
function mount() { return render(<StrictMode><Typewriter texts={texts} delay={20} speed={10} eraseSpeed={5} /></StrictMode>); }

test('muestra contenido desde el primer render y recorre las frases con un solo temporizador', () => {
  mount();
  const heading = screen.getByRole('heading', { name: 'David' });
  expect(heading).toHaveTextContent('David');
  const seen = new Set([heading.textContent]);
  for (let step = 0; step < 160; step++) {
    tick(); seen.add(heading.textContent);
    expect(jest.getTimerCount()).toBeLessThanOrEqual(1);
    expect(heading).toHaveAccessibleName('David');
  }
  texts.forEach(text => expect(seen.has(text)).toBe(true));
  expect(heading).not.toHaveAttribute('aria-live');
});

test('permite pausar completando la frase y reanudar sin acumular temporizadores', () => {
  mount(); tick(20); tick(5);
  expect(screen.getByRole('heading').textContent).not.toBe('David');
  fireEvent.click(screen.getByRole('button', { name: 'Pausar animación' }));
  expect(screen.getByRole('heading')).toHaveTextContent('David');
  expect(jest.getTimerCount()).toBe(0);
  tick(5000);
  expect(screen.getByRole('heading')).toHaveTextContent('David');
  fireEvent.click(screen.getByRole('button', { name: 'Reanudar animación' }));
  expect(jest.getTimerCount()).toBe(1);
});

test('respeta movimiento reducido desde el inicio y al cambiar la preferencia', () => {
  reduced = true; mount();
  expect(screen.getByRole('heading')).toHaveTextContent('David');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(jest.getTimerCount()).toBe(0);
  preferences(() => { reduced = false; });
  expect(screen.getByRole('button', { name: 'Pausar animación' })).toBeInTheDocument();
  expect(jest.getTimerCount()).toBe(1);
  preferences(() => { reduced = true; });
  expect(jest.getTimerCount()).toBe(0);
  expect(screen.getByRole('heading')).toHaveTextContent('David');
});

test('la versión móvil es estática y se adapta al cruzar los 600 px', () => {
  width = 390; mount();
  expect(screen.getByRole('heading')).toHaveTextContent('David');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(jest.getTimerCount()).toBe(0);
  preferences(() => { width = 600; });
  expect(jest.getTimerCount()).toBe(1);
});

test('suspende la secuencia fuera de pantalla o con la pestaña oculta', () => {
  mount();
  act(() => observerCallback([{ isIntersecting: false }]));
  expect(jest.getTimerCount()).toBe(0);
  act(() => observerCallback([{ isIntersecting: true }]));
  expect(jest.getTimerCount()).toBe(1);
  act(() => { hidden = true; document.dispatchEvent(new Event('visibilitychange')); });
  expect(jest.getTimerCount()).toBe(0);
  act(() => { hidden = false; document.dispatchEvent(new Event('visibilitychange')); });
  expect(jest.getTimerCount()).toBe(1);
});

test('libera temporizadores, observador y escucha de preferencias al desmontarse', () => {
  const { unmount } = mount();
  expect(listeners.size).toBe(1);
  unmount();
  expect(jest.getTimerCount()).toBe(0);
  expect(listeners.size).toBe(0);
  expect(disconnect).toHaveBeenCalledTimes(2);
});

test('ofrece una presentación estática si matchMedia no está disponible', () => {
  window.matchMedia = undefined;
  mount();
  expect(screen.getByRole('heading')).toHaveTextContent('David');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(jest.getTimerCount()).toBe(0);
});
