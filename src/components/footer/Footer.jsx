import React from 'react'
import './footer.css'
import {FaFacebookF} from 'react-icons/fa'
import {BsInstagram} from 'react-icons/bs'
import {FiTwitter} from 'react-icons/fi'


const Footer = () => {
  return (
    <footer>
      <a href="#" className='footer__logo'> DMS</a>

      <ul className='permalinks'>
        <li> <a href="#">Home</a> </li>
        <li> <a href="#about">Sobre Mi</a> </li>
        <li> <a href="#experience">Expriencia</a> </li>
        <li> <a href="#services">Servicios</a> </li>
        <li> <a href="#portfolio">Portafolio</a> </li>
        <li> <a href="#testimonials">Testimonios</a> </li>
        <li> <a href="#contact">Contacto</a> </li>
      </ul>

      <div className="footer__socials">
        <a href="https://www.facebook.com/profile.php?id=100005001045548"><FaFacebookF/></a>
        <a href="https://www.instagram.com/deivid_molina_gz/"><BsInstagram/></a>
        <a href="https://twitter.com/DeividMolina19"><FiTwitter/></a>
      </div>

      <div className="footer__copyrght">
        <small>&copy; DM SERIES All rights reserved. 2023 </small>
      </div>
    </footer>
  )
}

export default Footer