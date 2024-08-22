import React from 'react'
import './experience.css'
import {FaCheckCircle} from 'react-icons/fa'

const Experience = () => {
  return (
    <section id='experience'>
      <h5>Que habilidades tengo</h5>
      <h2>Mi Experiencia</h2>

      <div className="container experience__container">
        <div className="experience__frontend">
          <h3>Frontend Development</h3>
          <div className="experience__content">
            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>HTML 5</h4>
              <small className='text-light'>Experto</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>CCS 3</h4>
              <small className='text-light'>Experto</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>SASS</h4>
              <small className='text-light'>Experto</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>JavaScript</h4>
              <small className='text-light'>Intermedio</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>React Js</h4>
              <small className='text-light'>Intermedio</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>Vue Js</h4>
              <small className='text-light'>Intermedio</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>Angular</h4>
              <small className='text-light'>Basico</small>
              </div>
            </article>
          </div>
        </div>

        <div className="experience__backend">
        <h3>Backend Development</h3>
          <div className="experience__content">
          <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>Node Js</h4>
              <small className='text-light'>Intermedio</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>PHP</h4>
                <small className='text-light'>Intermedio</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>MySQL</h4>
              <small className='text-light'>Intermedio</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>Mongo DB</h4>
              <small className='text-light'>Basico</small>
              </div>
            </article>

            <article className="experience__details">
              <FaCheckCircle className='experience__details-icon'/>
              <div>
              <h4>Python</h4>
              <small className='text-light'>Basico</small>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience