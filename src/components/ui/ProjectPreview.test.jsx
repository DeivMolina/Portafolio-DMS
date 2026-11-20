import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectPreview from './ProjectPreview';
import OptimizedImage from './OptimizedImage';

let reduced, listeners, visibilityCallback;
const originalMedia = window.matchMedia;
const originalObserver = global.IntersectionObserver;
const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden');
const src = '/static/media/portafolio14.aabb1234.gif';

beforeEach(() => {
  reduced = false; listeners = new Set();
  window.matchMedia = () => ({get matches(){return reduced;},addEventListener:(_,fn)=>listeners.add(fn),removeEventListener:(_,fn)=>listeners.delete(fn)});
  global.IntersectionObserver = jest.fn(fn => { visibilityCallback=fn; return {observe:jest.fn(),disconnect:jest.fn()}; });
});
afterEach(() => {
  cleanup(); window.matchMedia=originalMedia; global.IntersectionObserver=originalObserver;
  if(originalHidden) Object.defineProperty(document,'hidden',originalHidden); else delete document.hidden;
});

test('el póster no usa el GIF hasta una petición explícita y permite detenerlo', () => {
  render(<ProjectPreview src={src} alt="ECHE" sizes="22rem" />);
  expect(screen.getByRole('img')).toHaveAttribute('src','/assets/optimized/portafolio14-poster.jpg');
  fireEvent.click(screen.getByRole('button',{name:'Reproducir animación de ECHE'}));
  expect(screen.getByRole('img')).toHaveAttribute('src',src);
  fireEvent.click(screen.getByRole('button',{name:'Detener animación de ECHE'}));
  expect(screen.getByRole('img').src).not.toContain('.gif');
});

test('activar movimiento reducido y salir de pantalla detiene la reproducción', () => {
  render(<ProjectPreview src={src} alt="ECHE" />);
  fireEvent.click(screen.getByRole('button',{name:/Reproducir/}));
  act(()=>{reduced=true;listeners.forEach(fn=>fn());});
  expect(screen.getByRole('img').src).not.toContain('.gif');
  fireEvent.click(screen.getByRole('button',{name:/Reproducir/}));
  expect(screen.getByRole('img')).toHaveAttribute('src',src);
  act(()=>visibilityCallback([{isIntersecting:false}]));
  expect(screen.getByRole('img').src).not.toContain('.gif');
});

test('ocultar la pestaña detiene el GIF y desmontar libera la escucha de preferencias', () => {
  const {unmount}=render(<ProjectPreview src={src} alt="ECHE" />);
  fireEvent.click(screen.getByRole('button',{name:/Reproducir/}));
  Object.defineProperty(document,'hidden',{configurable:true,value:true});
  act(()=>document.dispatchEvent(new Event('visibilitychange')));
  expect(screen.getByRole('img').src).not.toContain('.gif');
  unmount(); expect(listeners.size).toBe(0);
});

test('si falla una variante optimizada recupera la imagen original con su texto alternativo', () => {
  const {container}=render(<OptimizedImage src="/assets/portfolio14.png" alt="Proyecto original" />);
  expect(container.querySelector('source')).not.toBeNull();
  fireEvent.error(screen.getByRole('img'));
  expect(container.querySelector('source')).toBeNull();
  expect(screen.getByRole('img',{name:'Proyecto original'})).toHaveAttribute('src','/assets/portfolio14.png');
});
