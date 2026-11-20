import React from 'react';
import Typewriter from '../Typewriter'
import './header.css'
import CV from '../../assets/cv.pdf'
import ME from '../../assets/me.webp'
import ActionLink from '../ui/ActionLink'
import OptimizedImage from '../ui/OptimizedImage'

import { CiLinkedin } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";


const texts = ["Hey, soy David Molina.", "Desarrollador Full Stack.", "Bienvenido a mi universo Creativo."];

const Header = () => {

  return (
    <header id="inicio" tabIndex={-1} className="portfolio-header">
      <div className="container">
        <div className="me">
          <OptimizedImage src={ME} alt="David Molina" sizes="clamp(4.5rem, 12vw, 6rem)" loading="eager" priority />
          <span className="availability-badge">Disponible para trabajar</span>
        </div>
        <Typewriter texts={texts} />
        <p className="header__description">
          +4 años de experiencia. <span className="text-accent">Desarrollador Full Stack y creador de contenido</span> en México, enfocado en proponer soluciones innovadoras.
        </p>

        <div className="header__actions">
          <ActionLink href="#contact" variant="primary">Hablemos</ActionLink>
          <ActionLink href="https://github.com/DeivMolina" target="_blank" rel="noopener noreferrer">
            <span><FiGithub/> GitHub</span>
          </ActionLink>
          <ActionLink href="https://www.linkedin.com/in/deivid-molina-917797326/" target="_blank" rel="noopener noreferrer">
            <span><CiLinkedin/> LinkedIn</span>
          </ActionLink>
          <ActionLink href={CV} download target="_blank" rel="noopener noreferrer">
            <span><IoDocumentTextOutline/> Ver mi CV</span>
          </ActionLink>
        </div>
      </div>
    </header>
  )
}

export default Header
