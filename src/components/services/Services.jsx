import React from 'react'
import './services.css'
import {BiCheck} from 'react-icons/bi'

const Services = () => {
  return (
    <section id='services'>
      <h5>Lo que ofrezco</h5>
      <h2>Mis Servicios</h2>

      <div className="container services__container">
        <article className="service">
          <div className="service__head">
            <h3>UI/UX Desing</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Investigación de usuario para entender las necesidades y comportamientos de los usuarios.</p>
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
              <p>Diseño de prototipos para visualizar cómo será el producto final y cómo interactuará el usuario con él.</p>
            </li>
          </ul>
        </article>

        <article className="service">
          <div className="service__head">
            <h3>Web Development</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Desarrollo de sitios web responsivos Asegúrando que el sitio se vea y funcione bien en cualquier dispositivo con el servicio de desarrollo de sitios web responsivos.</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Desarrollo de aplicaciones web con funcionalidades avanzadas y una excelente experiencia de usuario</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Desarrollo de comercio electrónicos en línea de manera efectiva y segura, de lo cual implemento diferentes herramientas y consumo de API's</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Desarrollo de portales web con gran accesibilidad basandonos en el modelo del negocio de la propia empresa</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Incorporacion de maquedatado en base a la definicion del concepto, mision y vision de la empresa con la utilizacion de direfernetes herramientas (Wireframes).</p>
            </li>
          </ul>
        </article>

        <article className="service">
          <div className="service__head">
            <h3>Creacion de Contenido</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheck className='service__list-icon'/>
              <p>Conocimiento y manejo de fotografia profesional y empleado en lugares y objetos dependiendo de la utilizacion del mismo</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Implementacion y manejos de Camaras 360º en la realizacion de recorridos virtuales e interactivos en diferentes plataformas</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Realizacion de conteido audiovisual con utilizacion de Drone DJI, creando contenido en base a un concepto</p>
            </li>

            <li>
              <BiCheck className='service__list-icon'/>
              <p>Renderizacion en 3D de maquetas en base a planos arquitectonicos utilizando tecnologia I.A en base a equios de pilotaje profecional</p>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default Services