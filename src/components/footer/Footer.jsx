import React from 'react'
import './footer.css'
import {FaFacebookF} from 'react-icons/fa'
import {BsInstagram} from 'react-icons/bs'
import {FiTwitter} from 'react-icons/fi'


const Footer = () => {
  return (
    <footer className="site-footer">
      <a href="#inicio" className='footer__logo' aria-label="DMS: volver al inicio"> DMS</a>

      <nav aria-label="Navegación del pie de página">
      <ul className='permalinks'>
        <li> <a href="#inicio">Inicio</a> </li>
        <li> <a href="#about">Sobre mí</a> </li>
        <li> <a href="#experience">Experiencia</a> </li>
        <li> <a href="#services">Servicios</a> </li>
        <li> <a href="#portfolio">Portafolio</a> </li>
        <li> <a href="#testimonials">Testimonios</a> </li>
        <li> <a href="#contact">Contacto</a> </li>
      </ul>
      </nav>

      <div className="footer__socials">
        <a href="https://www.facebook.com/profile.php?id=100005001045548"><FaFacebookF aria-hidden="true" focusable="false"/><span className="visually-hidden">David Molina en Facebook</span></a>
        <a href="https://www.instagram.com/deivid_molina_gz/"><BsInstagram aria-hidden="true" focusable="false"/><span className="visually-hidden">David Molina en Instagram</span></a>
        <a href="https://twitter.com/DeividMolina19"><FiTwitter aria-hidden="true" focusable="false"/><span className="visually-hidden">David Molina en Twitter</span></a>
      </div>

      <div className="footer__copyrght">
        <small>&copy; 2026 DM SERIES. Todos los derechos reservados.</small>
      </div>
    </footer>
  )
}

export default Footer
