import React from 'react'
import './testimonials.css'
import AVTR1 from '../../assets/avatar1.jpg'
import AVTR2 from '../../assets/avatar2.jpg'
import AVTR3 from '../../assets/avatar3.jpg'
import AVTR4 from '../../assets/avatar4.jpg'

// import Swiper core and required modules
import { Pagination } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const data = [
  {
    avatar: AVTR1,
    nome: 'David Salinas - ASGL & ASOC',
    review: 'Hemos trabajado con David Molina en varios proyectos y siempre hemos quedado impresionados por su habilidad para transformar nuestras ideas en soluciones digitales elegantes y funcionales. Siempre ha sido muy colaborativo y su enfoque centrado en el usuario ha sido fundamental para el éxito de nuestros proyectos'
  },
  {
    avatar: AVTR2,
    nome: 'Irene Luna - Molina Consultores',
    review: 'Ha sido un placer trabajar con David Molina en nuestro sitio web. Nos ha mantenido informados en todo momento y ha sido muy receptivo a nuestras sugerencias y comentarios. Su atención al detalle y su experiencia en HTML, CSS y JavaScript ha sido fundamental para la calidad del producto final'
  },
  {
    avatar: AVTR3,
    nome: 'Luis Martinez - UTN',
    review: 'El trabajo de David Molina ha sido fundamental para el éxito de nuestro proyecto. Su capacidad para trabajar bien en equipo y comunicarse claramente ha sido muy apreciada. Además, ha sido capaz de solucionar problemas complejos de manera efectiva y ha mantenido el proyecto en el plazo y presupuesto acordados'
  },
  {
    avatar: AVTR4,
    nome: 'Sergio Torres - DESPACHO ATM',
    review: 'Estoy impresionado por la capacidad de David Molina para crear interfaces de usuario atractivas y responsivas. El sitio web que construyó para nosotros ha recibido muchos elogios de nuestros clientes y ha mejorado nuestra tasa de conversión'
  }
]

const Testimonials = () => {
  return (
    <section id='testimonials'>
      <h5>Opinión de los clientes</h5>
      <h2>Testimonios</h2>

      <Swiper className="container testimonials__container"
         // install Swiper modules
            modules={[ Pagination]}
            spaceBetween={40}
            slidesPerView={1}
            pagination={{ clickable: true }}
              >

       {
         data.map(({avatar, nome, review}, index) => {
           return (
            <SwiperSlide key={index} className="testimonial">
              <div className="client__avatar">
                <img src={avatar} alt="" />
              </div>
              <h5 className='client__name'>{nome}</h5>
                <small className="client__review">
                  {review}
                </small>
          </SwiperSlide>
           )
         })
       }

      </Swiper>
    </section>
  )
}

export default Testimonials