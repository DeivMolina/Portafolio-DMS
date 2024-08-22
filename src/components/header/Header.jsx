import React, { useState, useEffect } from 'react';
import Typewriter from '../Typewriter'
import './header.css'
import CV from '../../assets/cv.pdf'
import ME from '../../assets/me.webp'

import { CiLinkedin } from "react-icons/ci";
import {BsGithub} from 'react-icons/bs'
import {BsWhatsapp} from 'react-icons/bs'
import { IoDocumentTextOutline } from "react-icons/io5";


const Header = () => {
  const texts = ["Hey, soy David Molina.", "Desarrollador FrontEnd Jr.", "Bienvenido a mi universo Creativo."];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-dark py-8">
      <div className="container mx-auto text-center">
        <div className="me flex items-center justify-flex-start">
          <img src={ME} alt="David Molina" className="rounded-full mx-4" />
          <span className="badge text-sm">Disponible para trabajar</span>
        </div>
        {isMobile ? (
          <h1 className="text-2xl font-bold mt-2">Hey, soy David Molina.</h1>
        ) : (
          <Typewriter texts={texts} />
        )}
        <p className="font-bold mt-1 sm:text-xl md:text-3xl lg:text-4xl max-w-xs description">
          +4 años de experiencia, <span style={{fontWeight:'700', color:'#4b59fb'}}> Desarrollador FrontEnd Jr y Creador de Contenido</span>, <br></br> de México Especializado en proponer soluciones innovadoras.
        </p>

        <div className="badges mt-4 flex justify-center gap-4">
          <a href="https://api.whatsapp.com//send?phone=5540613200" target="_blank" className="badge-btn">
            <span><BsWhatsapp/> Contáctame</span>
          </a>
          <a href="https://www.linkedin.com/in/david-m-35957712a/" target="_blank" rel="noopener noreferrer" className="badge-btn">
            <span><CiLinkedin/> LinkedIn</span>
          </a>
          <a href={CV} download target="_blank" rel="noopener noreferrer" className="badge-btn">
            <span><IoDocumentTextOutline/> Ver mi CV</span>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
