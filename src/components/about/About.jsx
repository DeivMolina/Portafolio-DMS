import React from 'react'
import './about.css'
import ME from '../../assets/me-about.jpg'
import {FaAward} from 'react-icons/fa'
import {TbUsers} from 'react-icons/tb'
import {AiOutlineFolderOpen} from 'react-icons/ai'

const About = () => {
  return (
    <section id='about'>
      <h5>Conoceme</h5>
      <h2>Sobre Mi</h2>
      
      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} alt="About Image" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className="about__card">
              <FaAward/>
              <h5>Mi Experiencia</h5>
              <small>+4 Años de Experiencia</small>
            </article>

            <article className="about__card">
              <TbUsers/>
              <h5>Mis Clientes</h5>
              <small>+15 Clientes Satisfechos</small>
            </article>

            <article className="about__card">
              <AiOutlineFolderOpen/>
              <h5>Mis Proyectos</h5>
              <small>+20 Proyectos en progreso</small>
            </article>
          </div>

          <p>Soy un desarrollador con amplia experiencia en Desarrollo Front-End, que se esfuerza por garantizar la satisfacción del cliente en todo momento. Tengo habilidades para trabajar en equipo o de forma independiente, según las necesidades del proyecto. Busco una oportunidad para demostrar mi valía en una empresa de futuro y contribuir al éxito del equipo con mi dedicación, creatividad y compromiso.</p>

          <a href="#contact" className='btn btn-primary'>Contactame!</a>

        </div>
      </div>
    </section>
  )
}

export default About