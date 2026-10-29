import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import ReCAPTCHA from "react-google-recaptcha";
import Swal from 'sweetalert2';
import './contact.css'
import {MdOutlineMarkEmailRead} from 'react-icons/md'
import {FaWhatsapp} from 'react-icons/fa'

const Contact = () => {

  const form = useRef();
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!captchaToken) {
      Swal.fire('Por favor verifica el reCAPTCHA');
      return;
    }

    emailjs.sendForm(
      'default_service',
      'template_cs4txqq',
      form.current,
      'vlXc2frkVlADzCPKt' // Reemplaza con tu public key real
    )
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Mensaje enviado',
          text: 'Nos comunicaremos contigo en breve.',
        });
        form.current.reset();
        setCaptchaToken(null);
      })
      .catch((err) => {
        Swal.fire('Error', 'Hubo un problema al enviar el mensaje', 'error');
        console.error(err);
      });
  };


  return (
    <section id='contact'>
      <h5 style={{color:'white'}}>Póngase en contacto</h5>
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
        <form ref={form} onSubmit={sendEmail} id="form">
          <input type="text" name='name' id='name' placeholder='Nombre Completo' required />
          <input type="email" name="phone" id='phone' placeholder='Correo Electronico' required />
          <input type="text" name="email" id='email' placeholder='Telefono' required />
          <textarea name="message" id='message' rows="7" placeholder='Mensaje' required></textarea>

          <ReCAPTCHA
            sitekey="6LcT4V4rAAAAAJmXYWcL6Vp7uHKXLQw4p3sHY7dt" // Reemplaza con tu clave de sitio
            onChange={handleCaptcha}
          />

          <button type='submit' className='btn btn-primary'>Enviar</button>
        </form>

      </div>
    </section>
  )
}

export default Contact