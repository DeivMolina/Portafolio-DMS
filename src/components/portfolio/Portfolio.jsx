import React from 'react'
import './portfolio.css'
import { dataFeatures } from '../../data/data'
import ActionLink from '../ui/ActionLink'
import OptimizedImage from '../ui/OptimizedImage'
import ProjectPreview from '../ui/ProjectPreview'
import ProjectDemoLink from '../ui/ProjectDemoLink'
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
import IMG16 from '../../assets/portfolio19.png'
import IMG17 from '../../assets/portfolio20.png'
import IMG18 from '../../assets/portfolio21.png'
import IMG19 from '../../assets/portfolio22.png'

const data = [
  {
    id: 1,
    image: IMG19,
    tittle: 'CREM - Sistema Web',
    github: '',
    demo: 'https://crem.panduitlatam.com'
  },
  {
    id: 2,
    image: IMG17,
    tittle: 'Ralte - Sitio Web',
    github: '',
    demo: 'https://front-ralte.rkcreativo.com.mx'
  },
  {
    id: 3,
    image: IMG16,
    tittle: 'Conecta y Crece - Sitio Web',
    github: '',
    demo: 'https://conectaycrece.com.mx'
  },
  {
    id: 4,
    image: IMG18,
    tittle: 'Adqusiciones & Pasivos - Sitio Web',
    github: '',
    demo: 'https://adquisicionesypasivosgws.com.mx/'
  },
  {
    id: 5,
    image: IMG15,
    tittle: 'TechComp - Sitio Web',
    github: '',
    demo: 'https://rkcreativo.com.mx/techcomp-promociones/#'
  },
  {
    id: 6,
    image: IMG14,
    tittle: 'ECHE - Sitio Web',
    github: '',
    demo: 'https://eche.com.mx'
  },
  {
    id: 7,
    image: IMG13,
    tittle: 'BeFocused - Sitio Web',
    github: '',
    demo: 'https://befocused.panduitlatam.com'
  },
  {
    id: 8,
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
    id: 10,
    image: IMG8,
    tittle: 'Grupo Inders <E-commerce />',
    github: '',
    demo: 'https://inders.com.mx'
  },
  
  {
    id: 11,
    image: IMG2,
    tittle: 'INAP - Sitio Web',
    github: '',
    demo: 'https://inap.mx'
  },
  {
    id: 12,
    image: IMG12,
    tittle: 'Caña de Oro - Sitio Web',
    github: '',
    demo: 'https://canadeoro.com.mx'
  },
  {
    id: 13,
    image: IMG3,
    tittle: 'DESPACHO ATM - Sitio Web',
    github: '',
    // demo: 'https://despachoatm.com'
  },
  
  {
    id: 14,
    image: IMG4,
    tittle: 'Molina Consultores - Sitio Web',
    github: '',
    demo: ''
  },
  {
    id: 15,
    image: IMG6,
    tittle: 'Planilla Dorada - Sitio Web',
    github: '',
    demo: ''
  },
  {
    id: 16,
    image: IMG7,
    tittle: 'Alearth <E-Commerce />',
    github: '',
    // demo: 'https://www.dm-series.online'
  },
  {
    id: 17,
    image: IMG5,
    tittle: 'Law Soluciones Legales - Sitio Web',
    github: '',
    // demo: 'https://www.lawsolucioneslegales.com'
  },
  {
    id: 18,
    image: IMG9,
    tittle: 'Bliblioteca UTN <Sistema de Inventario />',
    github: '',
    // demo: 'https://www.dm-series.online'
  },
  {
    id: 19,
    image: IMG10,
    tittle: 'Reach QR <Sistema In:Out />',
    github: '',
    // demo: 'https://www.dm-series.online'
  }
]

export function PortfolioFeatures() {
  return (
    <div>
      <section id='portfolio' aria-labelledby="portfolio-title" tabIndex={-1}>
        <div className="section__heading">
          <h2 id="portfolio-title">Proyectos destacados</h2>
          <p className="container">Solicita una demo por WhatsApp o visita los proyectos con enlace disponible.</p>
        </div>

        <div className="container portfolio__features-container">
          {dataFeatures.map(feature => (
            <div key={feature.id} className="portfolio__feature-item">
              <div className="portfolio__feature-image">
                <OptimizedImage src={feature.imgSrc} alt={feature.title} sizes="(max-width: 56rem) calc(100vw - 4rem), (max-width: 76rem) calc((100vw - 8rem) / 2), 33rem" loading={feature.id === dataFeatures[0].id ? 'eager' : 'lazy'} />
              </div>
              <div className="portfolio__feature-content">
                <h3 className="portfolio__feature-title">{feature.title}</h3>
                
                {feature.tags.length > 0 && (
                  <div className="portfolio__feature-tags">
                    {feature.tags.map(tag => (
                      <span key={tag.name} className={`tag ${tag.class}`}>
                        <span className="tag__icon" aria-hidden="true">{tag.icon}</span> {tag.name}
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
                    <ActionLink href={feature.codeLink} variant="secondary"><FiGithub /> GitHub</ActionLink>
                  )}
                  {feature.previewLink && (
                    <ActionLink href={feature.previewLink} aria-label={`Ver proyecto ${feature.title}`}><IoIosLink /> Ver proyecto</ActionLink>
                  )}
                  <ProjectDemoLink title={feature.title} confidential={/confidencial/i.test(feature.subdescription || '')} />
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
    <section id='otros-proyectos' aria-labelledby="otros-proyectos-title" tabIndex={-1}>
      <h2 id="otros-proyectos-title">Otros proyectos</h2>

      <div className="container portfolio__container">
        {
          data.map(({ id, image, tittle, github, demo }) => {
            return (
              <article key={id} className="portfolio__item">
                <ProjectPreview src={image} alt={tittle} sizes="(max-width: 42rem) calc(100vw - 4rem), (max-width: 62rem) calc((100vw - 7rem) / 2), 22rem" />
                <h3>{tittle}</h3>
                <div className="portfolio__item-cta">
                  {github && (
                    <ActionLink href={github} variant="secondary" target='_blank' rel='noopener noreferrer'>
                      <FiGithub /> GitHub
                    </ActionLink>
                  )}
                  {demo && (
                    <ActionLink href={demo} target='_blank' rel='noopener noreferrer' aria-label={`Ver proyecto ${tittle}`}>
                      <IoIosLink /> Ver proyecto
                    </ActionLink>
                  )}
                  <ProjectDemoLink title={tittle} />
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
