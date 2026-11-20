import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import App from './App'
import baseline from '../docs/phase-1/baseline.json'

jest.mock('./components/Typewriter', () => () => <h1>David Molina</h1>)
jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div>{children}</div>,
  SwiperSlide: ({ children }) => <div>{children}</div>,
}))
jest.mock('swiper', () => ({ A11y: {} }))
jest.mock('swiper/css', () => ({}), { virtual: true })
jest.mock('swiper/css/a11y', () => ({}), { virtual: true })
jest.mock('react-google-recaptcha', () => {
  const React = require('react')
  return React.forwardRef((props, ref) => <div ref={ref}>reCAPTCHA simulado</div>)
})
jest.mock('sweetalert2', () => ({ fire: jest.fn() }))
jest.mock('emailjs-com', () => ({ sendForm: jest.fn() }))

beforeEach(() => window.history.replaceState(null, '', '/'))

test('ofrece un salto al contenido y todos los destinos internos existen una sola vez', () => {
  const { container } = render(<App />)
  const main = screen.getByRole('main')
  expect(screen.getByRole('link', { name: 'Saltar al contenido principal' }))
    .toHaveAttribute('href', `#${main.id}`)
  expect(main).toHaveAttribute('tabindex', '-1')
  container.querySelectorAll('a[href^="#"]').forEach(link => {
    const id = link.getAttribute('href').slice(1)
    expect(id).not.toBe('')
    expect(container.querySelectorAll(`[id="${id}"]`)).toHaveLength(1)
  })
  expect(document.getElementById('experience')).toHaveTextContent('+5 años de experiencia')
  expect(document.getElementById('experience').closest('section')).toHaveAttribute('id', 'about')
})

test('da nombre a ambas navegaciones y a los enlaces sociales del pie', () => {
  render(<App />)
  expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Navegación del pie de página' })).toBeInTheDocument()
  const footer = screen.getByRole('contentinfo')
  for (const network of ['Facebook', 'Instagram', 'Twitter']) {
    expect(within(footer).getByRole('link', { name: `David Molina en ${network}` })).toBeInTheDocument()
  }
})

test('conserva todos los proyectos, demos, enlaces externos, CV y formulario', () => {
  const { container } = render(<App />)
  baseline.inventory.projects.forEach(project => {
    expect(screen.getByRole('heading', { name: project.name })).toBeInTheDocument()
    if (project.demo) expect(screen.getByRole('link', { name: `Ver proyecto ${project.name}` })).toHaveAttribute('href', project.demo)
  })
  baseline.inventory.links.filter(link => link.mounted && !link.url.startsWith('#')).forEach(link => {
    const expectedUrl = link.url === 'https://api.whatsapp.com//send?phone=5540613200'
      ? 'https://wa.me/525540613200'
      : link.url
    expect(container.querySelector(`a[href="${expectedUrl}"]`)).not.toBeNull()
  })
  expect(screen.getByRole('link', { name: 'Ver mi CV' })).toHaveAttribute('download')
  expect(container.querySelectorAll('form')).toHaveLength(1)
  expect(container.querySelectorAll('form input')).toHaveLength(3)
  expect(container.querySelectorAll('.portfolio__feature-subdescription')).toHaveLength(4)
  expect([...container.querySelectorAll('.service__list')].map(list => list.children.length)).toEqual([6, 5, 4])
})

test('ofrece una solicitud identificable de demo por cada proyecto sin revelar detalles confidenciales', () => {
  const { container } = render(<App />)
  const links = container.querySelectorAll('a.project-demo-link')
  expect(links).toHaveLength(23)
  const messages = new Set()
  baseline.inventory.projects.forEach(project => {
    const link = screen.getByRole('link', { name: `Solicitar demo de ${project.name} por WhatsApp` })
    const url = new URL(link.href)
    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe('/525540613200')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.rel).toContain('noopener')
    expect(link.rel).toContain('noreferrer')
    const text = url.searchParams.get('text')
    expect(text).toContain(project.name)
    expect(text.includes('demo privada')).toBe(project.confidential)
    expect(text).not.toMatch(/https?:/)
    messages.add(text)
  })
  expect(messages.size).toBe(23)
})
