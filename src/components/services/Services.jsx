import React from 'react'
import './services.css'
import {BiCheck} from 'react-icons/bi'

const Services = () => {
  return (
    <section id='services'>
      <div className="section__heading">
        <h2>Servicios</h2>
        <p className="container">Desarrollo de software a medida y sistemas web para empresas en México. Con DMS, convierto las necesidades de tu negocio en soluciones empresariales.</p>
      </div>

      <div className="container services__container">
        <article className="service">
          <div className="service__head">
            <h3>Diseño UI/UX</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Investigación de usuarios para entender sus necesidades y comportamientos.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Diseño de interfaces de usuario atractivas y funcionales.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Arquitectura de información para mejorar la organización del contenido.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Diseño de interacción para hacer que la interfaz de usuario sea más dinámica y atractiva.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Pruebas de usabilidad para evaluar la facilidad de uso de un producto y descubrir oportunidades de mejora.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Diseño de prototipos para visualizar el producto final y su interacción con los usuarios.</p>
            </li>
          </ul>
        </article>

        <article className="service">
          <div className="service__head">
            <h3>Desarrollo web</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Desarrollo de sitios web responsivos que se adaptan a computadoras, tablets y celulares.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Desarrollo de aplicaciones web con funcionalidades avanzadas y una experiencia de usuario cuidada.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Desarrollo de comercio electrónico de forma efectiva y segura, con integración de herramientas y consumo de API.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Desarrollo de portales web accesibles, alineados con el modelo de negocio de cada empresa.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Maquetado y wireframes a partir del concepto, la misión y la visión de la empresa.</p>
            </li>
          </ul>
        </article>

        <article className="service">
          <div className="service__head">
            <h3>Creación de contenido</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Fotografía profesional de espacios y objetos, adaptada al uso de cada proyecto.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Recorridos virtuales e interactivos con cámaras 360° para distintas plataformas.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Contenido audiovisual con dron DJI, desarrollado a partir de un concepto.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Renderización 3D de maquetas a partir de planos arquitectónicos, utilizando tecnología de IA y equipos de pilotaje profesional.</p>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default Services
