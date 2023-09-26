import React from 'react'
import './portfolio.css'
import IMG1 from '../../assets/portfolio1.jpg'
import IMG2 from '../../assets/portfolio2.jpg'
import IMG3 from '../../assets/portfolio3.jpg'
import IMG4 from '../../assets/portfolio4.jpg'
import IMG5 from '../../assets/portfolio5.png'
import IMG6 from '../../assets/portfolio6.jpg'
import IMG7 from '../../assets/portfolio7.jpg'
import IMG8 from '../../assets/portfolio8.jpg'
import IMG9 from '../../assets/portfolio9.png'
import IMG10 from '../../assets/portfolio10.jpg'


const data = [
  {
    id: 1,
    image: IMG1,
    tittle: 'ASGL & ASOC <Web-Site />',
    github: 'https://github.com',
    demo: 'https://asglasociados.com.mx'
  },
  {
    id: 2,
    image: IMG2,
    tittle: 'INAP <Web-Site />',
    github: 'https://github.com',
    demo: 'https://inap.mx'
  },
  {
    id: 3,
    image: IMG3,
    tittle: 'DESPACHO ATM <Web-Site & CRM />',
    github: 'https://github.com',
    demo: 'https://despachoatm.com'
  },
  {
    id: 4,
    image: IMG4,
    tittle: 'Molina Consultores <Web-site />',
    github: 'https://github.com',
    demo: 'https://molina-consultores.com'
  },
  {
    id: 5,
    image: IMG5,
    tittle: 'Law Soluciones Legales <Web-Site />',
    github: 'https://github.com',
    demo: 'https://www.lawsolucioneslegales.com'
  },
  {
    id: 6,
    image: IMG6,
    tittle: 'Planilla Dorada <Web-Site />',
    github: 'https://github.com',
    demo: 'http://planilla-dorada.com'
  },
  {
    id: 7,
    image: IMG7,
    tittle: 'Alearth <E-Commerce />',
    github: 'https://github.com',
    demo: 'https://www.dm-series.online'
  },
  {
    id: 8,
    image: IMG8,
    tittle: 'Grupo Inders <E-commerce />',
    github: 'https://github.com',
    demo: 'https://www.dm-series.online'
  },
  {
    id: 9,
    image: IMG9,
    tittle: 'Bliblioteca UTN <Sistema de Inventario />',
    github: 'https://github.com',
    demo: 'https://www.dm-series.online'
  },
  {
    id: 10,
    image: IMG10,
    tittle: 'Reach QR <Sistema In:Out />',
    github: 'https://github.com',
    demo: 'https://www.dm-series.online'
  }
]

const Portfolio = () => {
  return (
    <section id='portfolio'>
      <h5>Mis ultimos Trabajos</h5>
      <h2>Mi Portafolio</h2>

      <div className="container portfolio__container">

      {
        data.map(({id, image, tittle, github, demo}) => {
          return(
            <article key={id} className="portfolio__item">
              <div className="portfolio__item-image">
                <img src={image} alt={tittle} />
              </div>
                <h3>{tittle}</h3>
                <div className="portfolio__item-cta">
                  <a href={github} className='btn'target='_blank'>GitHub</a>
                  <a href={demo} className='btn btn-primary' target='_blank'>Live Demo</a>
                </div>
          </article>
          )
        })
      }
      </div>
    </section>
  )
}

export default Portfolio