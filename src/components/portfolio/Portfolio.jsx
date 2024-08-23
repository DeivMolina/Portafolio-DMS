import React from 'react'
import './portfolio.css'
import { dataFeatures } from '../../data/data'
import { FiGithub } from "react-icons/fi";
import { IoIosLink } from "react-icons/io";


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
import IMG11 from '../../assets/portfolio11.png'
import IMG12 from '../../assets/portfolio12.png'
import IMG13 from '../../assets/portfolio13.png'
import IMG14 from '../../assets/portafolio14.gif'
import IMG15 from '../../assets/portfolio18.png'

const data = [
  {
    id: 1,
    image: IMG15,
    tittle: 'TechComp - Sitio Web',
    github: '',
    demo: 'https://rkcreativo.com.mx/techcomp-promociones/#'
  },
  {
    id: 1,
    image: IMG14,
    tittle: 'ECHE - Sitio Web',
    github: '',
    demo: 'https://eche.com.mx'
  },
  {
    id: 2,
    image: IMG13,
    tittle: 'BeFocused - Sitio Web',
    github: '',
    demo: 'https://befocused.panduitlatam.com'
  },
  {
    id: 3,
    image: IMG12,
    tittle: 'Caña de Oro - Sitio Web',
    github: '',
    demo: 'https://canadeoro.com.mx'
  },
  {
    id: 4,
    image: IMG1,
    tittle: 'ASGL & ASOC - Sitio Web',
    github: '',
    demo: 'https://asglasociados.com.mx'
  },
  {
    id: 9,
    image: IMG11,
    tittle: 'Hydra Consultores - Sitio Web',
    github: '',
    demo: 'https://hydraconsultores.com.mx'
  },
  {
    id: 5,
    image: IMG2,
    tittle: 'INAP - Sitio Web',
    github: '',
    demo: 'https://inap.mx'
  },
  {
    id: 6,
    image: IMG3,
    tittle: 'DESPACHO ATM - Sitio Web',
    github: '',
    demo: 'https://despachoatm.com'
  },
  {
    id: 8,
    image: IMG8,
    tittle: 'Grupo Inders <E-commerce />',
    github: '',
    demo: 'https://inders.com.mx'
  },
  {
    id: 7,
    image: IMG4,
    tittle: 'Molina Consultores - Sitio Web',
    github: '',
    demo: ''
  },
  {
    id: 10,
    image: IMG6,
    tittle: 'Planilla Dorada - Sitio Web',
    github: '',
    demo: ''
  },
  {
    id: 11,
    image: IMG7,
    tittle: 'Alearth <E-Commerce />',
    github: '',
    // demo: 'https://www.dm-series.online'
  },
  {
    id: 12,
    image: IMG5,
    tittle: 'Law Soluciones Legales - Sitio Web',
    github: '',
    // demo: 'https://www.lawsolucioneslegales.com'
  },
  {
    id: 13,
    image: IMG9,
    tittle: 'Bliblioteca UTN <Sistema de Inventario />',
    github: '',
    // demo: 'https://www.dm-series.online'
  },
  {
    id: 14,
    image: IMG10,
    tittle: 'Reach QR <Sistema In:Out />',
    github: '',
    // demo: 'https://www.dm-series.online'
  }
]

export function PortfolioFeatures() {
  return (
    <div>
      <section id='portfolio'>
        <h5 style={{color:'white'}}>Mis Proyectos</h5>
        <h2>Destacados</h2>

        <div className="container portfolio__features-container">
          {dataFeatures.map(feature => (
            <div key={feature.id} className="portfolio__feature-item">
              <div className="portfolio__feature-image">
                <img src={feature.imgSrc} alt={feature.title} />
              </div>
              <div className="portfolio__feature-content">
                <h3 className="portfolio__feature-title">{feature.title}</h3>
                
                {feature.tags.length > 0 && (
                  <div className="portfolio__feature-tags">
                    {feature.tags.map(tag => (
                      <span key={tag.name} className={tag.class}>
                        {tag.icon} {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="portfolio__feature-description">
                  {feature.description}
                </p>
                
                {feature.subdescription && (
                  <p className="portfolio__feature-subdescription">
                    {feature.subdescription}
                  </p>
                )}
                
                <div className="portfolio__feature-cta">
                  {feature.codeLink && (
                    <a href={feature.codeLink} className="btn__feature"><FiGithub /> GitHub</a>
                  )}
                  {feature.previewLink && (
                    <a href={feature.previewLink} className="btn__feature btn-primary"><IoIosLink /> Preview</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


export function Portfolio() {
  return (
    <section id='portfolio'>
      <h2>Otros Proyectos</h2>

      <div className="container portfolio__container">
        {
          data.map(({ id, image, tittle, github, demo }) => {
            return (
              <article key={id} className="portfolio__item">
                <div className="portfolio__item-image">
                  <img src={image} alt={tittle} />
                </div>
                <h3>{tittle}</h3>
                <div className="portfolio__item-cta">
                  {github && (
                    <a href={github} className='btn' target='_blank' rel='noopener noreferrer'>
                      <FiGithub /> GitHub
                    </a>
                  )}
                  {demo && (
                    <a href={demo} className='btn btn-primary' target='_blank' rel='noopener noreferrer'>
                      <IoIosLink /> Preview
                    </a>
                  )}
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