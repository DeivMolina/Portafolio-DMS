import React, { useRef, useState } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'
import OptimizedImage from '../ui/OptimizedImage'
import './testimonials.css'
import AVTR1 from '../../assets/avatar1.jpg'
import AVTR2 from '../../assets/avatar2.jpg'
import AVTR3 from '../../assets/avatar3.jpg'
import AVTR4 from '../../assets/avatar4.jpg'

// import Swiper core and required modules
import { A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/a11y';

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
  const swiper = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <section id='testimonials' aria-labelledby="testimonials-title">
      <h2 id="testimonials-title">Testimonios</h2>

      <div className="container testimonials__container">
      <Swiper className="testimonials__carousel"
            modules={[A11y]}
            role="group"
            aria-label="Opiniones de clientes"
            spaceBetween={40}
            slidesPerView={1}
            speed={reducedMotion ? 0 : 300}
            onSwiper={instance => { swiper.current = instance; }}
            onBeforeDestroy={() => { swiper.current = null; }}
            onSlideChange={instance => setActiveIndex(instance.activeIndex)}
            a11y={{
              id: 'testimonials-slides',
              containerRoleDescriptionMessage: 'carrusel',
              itemRoleDescriptionMessage: 'testimonio',
              slideLabelMessage: 'Testimonio {{index}} de {{slidesLength}}',
            }}
              >

       {
         data.map(({avatar, nome, review}, index) => {
           return (
            <SwiperSlide key={index} id={`testimonio-${index + 1}`} className="testimonial" aria-hidden={index !== activeIndex}>
              <div className="client__avatar">
                <OptimizedImage src={avatar} alt="" sizes="4rem" />
              </div>
              <h3 className='client__name'>{nome}</h3>
                <p className="client__review">
                  {review}
                </p>
          </SwiperSlide>
           )
         })
       }

      </Swiper>
      <div className="testimonials__pagination" role="group" aria-label="Elegir testimonio">
        {data.map((item, index) => (
          <button key={item.nome} type="button"
            aria-label={`Mostrar testimonio ${index + 1} de ${data.length}`}
            aria-controls={`testimonio-${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => swiper.current?.slideTo(index)}
          />
        ))}
      </div>
      </div>
    </section>
  )
}

export default Testimonials
