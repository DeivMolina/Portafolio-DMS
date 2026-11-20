import React from 'react'
import './about.css'
import ME from '../../assets/me-about.jpg'
import ActionLink from '../ui/ActionLink'
import OptimizedImage from '../ui/OptimizedImage'
import {FaAward} from 'react-icons/fa'
import {TbUsers} from 'react-icons/tb'
import {AiOutlineFolderOpen} from 'react-icons/ai'

const About = () => {
  return (
    <section id='about' aria-labelledby="about-title" tabIndex={-1}>
      <h2 id="about-title">Sobre mí</h2>
      
      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <OptimizedImage src={ME} alt="David Molina" sizes="(max-width: 60rem) 80vw, 22rem" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article id="experience" className="about__card" aria-labelledby="experience-title" tabIndex={-1}>
              <FaAward/>
              <h3 id="experience-title">Mi experiencia</h3>
              <small>+5 años de experiencia</small>
            </article>

            <article className="about__card">
              <TbUsers/>
              <h3>Mis clientes</h3>
              <small>+20 clientes satisfechos</small>
            </article>

            <article className="about__card">
              <AiOutlineFolderOpen/>
              <h3>Mis proyectos</h3>
              <small>+20 Proyectos desarrollados</small>
            </article>
          </div>

          <p>Soy David Molina, desarrollador Full Stack bajo la marca DMS, con experiencia en desarrollo Front-End. Trabajo en equipo o de forma independiente según las necesidades de cada proyecto, con foco en la satisfacción del cliente. Busco una oportunidad para aportar mi dedicación, creatividad y compromiso al éxito de una empresa.</p>

          <ActionLink href="#contact" variant="primary">Hablemos de tu proyecto</ActionLink>

        </div>
      </div>
    </section>
  )
}

export default About
