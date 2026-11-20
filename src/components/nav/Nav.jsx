import React, { useEffect, useState } from 'react'
import './nav.css'
import { AiOutlineHome, AiFillPhone, AiFillFolderOpen } from 'react-icons/ai'
import { BiBookBookmark } from 'react-icons/bi'
import { MdOutlineDesignServices } from 'react-icons/md'

const navigation = [
  { id: 'inicio', label: 'Inicio', Icon: AiOutlineHome },
  { id: 'portfolio', label: 'Proyectos', Icon: AiFillFolderOpen },
  { id: 'services', label: 'Servicios', Icon: MdOutlineDesignServices },
  { id: 'about', label: 'Sobre mí', Icon: BiBookBookmark },
  { id: 'contact', label: 'Contacto', Icon: AiFillPhone },
]

const sectionLinks = [
  ['inicio', 'inicio'],
  ['portfolio', 'portfolio'],
  ['otros-proyectos', 'portfolio'],
  ['services', 'services'],
  ['about', 'about'],
  ['testimonials', 'about'],
  ['contact', 'contact'],
]

const Nav = () => {
  const [activeSection, setActiveSection] = useState('inicio')

  useEffect(() => {
    let frame = null

    const updateActiveSection = () => {
      frame = null
      const readingLine = window.innerHeight * 0.3
      let current = 'inicio'

      sectionLinks.forEach(([id, navId]) => {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= readingLine) {
          current = navId
        }
      })

      const pageHeight = document.documentElement.scrollHeight
      if (pageHeight > window.innerHeight && window.scrollY + window.innerHeight >= pageHeight - 2) {
        current = 'contact'
      }

      setActiveSection(current)
    }

    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateActiveSection)
    }

    const syncHash = () => {
      let id
      try {
        id = decodeURIComponent(window.location.hash.slice(1)) || 'inicio'
      } catch {
        scheduleUpdate()
        return
      }
      const match = sectionLinks.find(([sectionId]) => sectionId === id)
      if (match) setActiveSection(match[1])
      else if (id === 'experience') setActiveSection('about')
      scheduleUpdate()
    }

    // React mounts the targets after the document shell has loaded.
    if (window.location.hash) {
      try {
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
        if (target) target.scrollIntoView({ block: 'start', behavior: 'auto' })
      } catch {
        // A malformed fragment must not prevent navigation from working.
      }
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('hashchange', syncHash)
    window.addEventListener('popstate', syncHash)
    document.addEventListener('load', scheduleUpdate, true)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('hashchange', syncHash)
      window.removeEventListener('popstate', syncHash)
      document.removeEventListener('load', scheduleUpdate, true)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <nav className="site-nav" aria-label="Navegación principal">
      {navigation.map(({ id, label, Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          title={label}
          aria-current={activeSection === id ? 'location' : undefined}
          onClick={() => setActiveSection(id)}
          className={activeSection === id ? 'active' : undefined}
        >
          <Icon aria-hidden="true" focusable="false" />
        </a>
      ))}
    </nav>
  )
}

export default Nav
