import React from 'react'
import './contact.css'
import {MdOutlineMarkEmailRead} from 'react-icons/md'
import {FaWhatsapp} from 'react-icons/fa'
import { useRef } from 'react';
import emailjs from 'emailjs-com';

const Contact = () => {

  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_dw2iep9', 'template_00bsoer', form.current, 'PLVe2mPiaHGqH25Tp')
     
    e.target.reset()
  };

  return (
    <section id='contact'>
      <h5>Póngase en contacto</h5>
      <h2>Contactame</h2>

      <div className="container contact__container">

        <div className="contact__options">
          <article className="contact__option">
            <MdOutlineMarkEmailRead className='contact__option-icon'/>
            <h4>Email</h4>
            <h5>davidglezm2015@gmail.com</h5>
            <a href="mailto:davidglezm2015@gmail.com" target="_blank">Enviar Mensaje</a>
          </article>

          <article className="contact__option">
            <FaWhatsapp className='contact__option-icon'/>
            <h4>Whatsapp</h4>
            <h5>(+52) 55 4061-3200</h5>
            <a href="https://api.whatsapp.com//send?phone=5540613200" target="_blank">Contactar</a>
          </article>
        </div>
        <form ref={form} onSubmit={sendEmail}>
          <input type="text" name='name' placeholder='Nombre Completo' required />
          <input type="email" name="email" placeholder='Correo Electronico' required />
          <textarea name="message" rows="7" placeholder='Mensaje' required></textarea>
          <button type='submit' className='btn btn-primary'>Enviar</button>
        </form>

      </div>
    </section>
  )
}

export default Contact