import React from 'react'
import CV from '../../assets/cv.pdf'
import ActionLink from '../ui/ActionLink'

const CTA = () => {
  return (
    <div className='cta'>
        <ActionLink href={CV} download>Descarga CV</ActionLink>
        <ActionLink href="#contact" variant="primary">Hablemos...</ActionLink>
    </div>
  )
}

export default CTA
