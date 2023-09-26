import React from 'react'
import {BsLinkedin} from 'react-icons/bs'
import {BsGithub} from 'react-icons/bs'
import {BsWhatsapp} from 'react-icons/bs'

const HeaderSocials = () => {
  return (
    <div className='header__socials'>
      <a href="https://www.linkedin.com/in/david-m-35957712a/" target="_blank"><BsLinkedin/></a>
      <a href="https://github.com/DeivMolina" target="_blank"><BsGithub/></a>
      <a href="https://api.whatsapp.com//send?phone=5540613200" target="_blank"><BsWhatsapp/></a>
    </div>
  )
}

export default HeaderSocials