import React from 'react'
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import Nav from './Nav'

const sectionIds = ['inicio', 'portfolio', 'otros-proyectos', 'services', 'about', 'testimonials', 'contact']
let scrollPosition
let scrollIntoView

const renderNavigation = () => render(
  <>
    <Nav />
    {sectionIds.map((id, index) => (
      <section
        key={id}
        id={id}
        ref={node => {
          if (node) node.getBoundingClientRect = () => ({ top: index * 1000 - scrollPosition })
        }}
      />
    ))}
    <article id="experience" />
  </>
)

const scrollToPosition = position => {
  scrollPosition = position
  fireEvent.scroll(window)
  act(() => jest.advanceTimersByTime(20))
}

beforeEach(() => {
  jest.useFakeTimers()
  scrollPosition = 0
  window.history.replaceState(null, '', '/')
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scrollPosition })
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 8000 })
  scrollIntoView = jest.fn()
  Element.prototype.scrollIntoView = scrollIntoView
})

afterEach(() => {
  jest.clearAllTimers()
  jest.useRealTimers()
  delete Element.prototype.scrollIntoView
})

test('identifica los cinco destinos y comunica una única ubicación activa', () => {
  renderNavigation()
  const navigation = screen.getByRole('navigation', { name: 'Navegación principal' })
  expect(within(navigation).getAllByRole('link').map(link => link.getAttribute('aria-label')))
    .toEqual(['Inicio', 'Proyectos', 'Servicios', 'Sobre mí', 'Contacto'])
  expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'location')
  expect(navigation.querySelectorAll('[aria-current]')).toHaveLength(1)
})

test('actualiza la ubicación al desplazarse sin pulsar la barra', () => {
  renderNavigation()
  scrollToPosition(3000)
  expect(screen.getByRole('link', { name: 'Servicios' })).toHaveAttribute('aria-current', 'location')
  expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  scrollToPosition(0)
  expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'location')
})

test('mantiene Proyectos activo en la sección de otros proyectos', () => {
  renderNavigation()
  scrollToPosition(2000)
  expect(screen.getByRole('link', { name: 'Proyectos' })).toHaveAttribute('aria-current', 'location')
})

test('responde a cambios de fragmento y al historial', () => {
  renderNavigation()
  scrollPosition = 4000
  window.history.pushState(null, '', '#experience')
  fireEvent(window, new HashChangeEvent('hashchange'))
  expect(screen.getByRole('link', { name: 'Sobre mí' })).toHaveAttribute('aria-current', 'location')
  act(() => jest.advanceTimersByTime(20))
  scrollPosition = 1000
  window.history.replaceState(null, '', '#portfolio')
  fireEvent.popState(window)
  act(() => jest.advanceTimersByTime(20))
  expect(screen.getByRole('link', { name: 'Proyectos' })).toHaveAttribute('aria-current', 'location')
})

test('resuelve un enlace directo al montar la aplicación', () => {
  window.history.replaceState(null, '', '#portfolio')
  renderNavigation()
  expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'auto' })
})

test('tolera fragmentos desconocidos o mal codificados', () => {
  window.history.replaceState(null, '', '#%E0%A4%A')
  expect(() => renderNavigation()).not.toThrow()
  fireEvent(window, new HashChangeEvent('hashchange'))
  act(() => jest.advanceTimersByTime(20))
  expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'location')
  window.history.replaceState(null, '', '#no-existe')
  fireEvent(window, new HashChangeEvent('hashchange'))
  act(() => jest.advanceTimersByTime(20))
  expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'location')
})

test('identifica Contacto al llegar al final y limpia las tareas al desmontar', () => {
  const cancelFrame = jest.spyOn(window, 'cancelAnimationFrame')
  const { unmount } = renderNavigation()
  scrollToPosition(7200)
  expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('aria-current', 'location')
  fireEvent.scroll(window)
  unmount()
  expect(cancelFrame).toHaveBeenCalled()
  const pending = jest.getTimerCount()
  fireEvent.scroll(window)
  expect(jest.getTimerCount()).toBe(pending)
  cancelFrame.mockRestore()
})
