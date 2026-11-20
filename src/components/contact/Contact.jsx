import React, { useEffect, useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import './contact.css';
import FormField from '../ui/FormField';
import { whatsappUrl } from '../../utils/contactLinks';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const form = useRef(null);
  const captcha = useRef(null);
  const captchaGroup = useRef(null);
  const captchaToken = useRef(null);
  const feedback = useRef(null);
  const sending = useRef(false);
  const mounted = useRef(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [notice, setNotice] = useState({ kind: 'idle', text: '' });
  const [captchaReady, setCaptchaReady] = useState(false);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => { setClientReady(true); }, []);

  useEffect(() => {
    if (captchaReady || !captchaGroup.current) return undefined;
    if (typeof IntersectionObserver !== 'function') {
      setCaptchaReady(true);
      return undefined;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setCaptchaReady(true);
    }, { rootMargin: '800px' });
    observer.observe(captchaGroup.current);
    return () => observer.disconnect();
  }, [captchaReady]);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (notice.scroll) feedback.current?.scrollIntoView?.({ block: 'center', behavior: 'auto' });
  }, [notice]);

  const handleCaptcha = (token) => {
    captchaToken.current = token;
    setCaptchaError(token ? '' : 'Completa de nuevo la verificación de seguridad.');
  };

  const handleExpired = () => {
    captchaToken.current = null;
    setCaptchaError('La verificación caducó. Complétala de nuevo antes de enviar.');
  };

  const handleCaptchaError = () => {
    captchaToken.current = null;
    setCaptchaError('No se pudo cargar la verificación. Puedes recargar la página o contactar por correo o WhatsApp.');
  };

  const handleInput = (event) => {
    event.target.setCustomValidity('');
    if (!sending.current) setNotice({ kind: 'idle', text: '' });
  };

  const sendEmail = async (event) => {
    event.preventDefault();
    if (sending.current) return;

    const currentForm = form.current;
    for (const [name, message] of [
      ['name', 'Escribe tu nombre completo.'],
      ['phone', 'Escribe un teléfono de contacto.'],
      ['message', 'Escribe tu mensaje.'],
    ]) {
      const field = currentForm.elements.namedItem(name);
      field.setCustomValidity(field.value.trim() ? '' : message);
    }
    if (!currentForm.reportValidity()) return;

    if (!captchaToken.current) {
      setCaptchaError('Completa la verificación de seguridad antes de enviar.');
      captchaGroup.current.focus();
      return;
    }

    // The ref also blocks repeated submissions before React updates the button.
    sending.current = true;
    setIsSubmitting(true);
    setNotice({ kind: 'sending', text: 'Enviando tu mensaje…' });

    try {
      // Names match the local email template in correo.html.
      // The installed SDK serializes the form synchronously, before awaiting.
      await emailjs.sendForm(
        'default_service',
        'template_cs4txqq',
        currentForm,
        'vlXc2frkVlADzCPKt'
      );
      if (!mounted.current) return;

      currentForm.reset();
      setCaptchaError('');
      setNotice({ kind: 'success', text: 'Tu mensaje se envió correctamente.', scroll: true });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Mensaje enviado',
        showConfirmButton: false,
        timer: 4000,
      });
    } catch {
      if (!mounted.current) return;
      setNotice({
        kind: 'error',
        scroll: true,
        text: 'No se pudo enviar el mensaje. Tus datos se conservaron. Completa de nuevo la verificación y vuelve a intentarlo, o utiliza el correo o WhatsApp.',
      });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo enviar el mensaje',
        showConfirmButton: false,
        timer: 4000,
      });
    } finally {
      sending.current = false;
      captchaToken.current = null;
      if (mounted.current) {
        captcha.current?.reset();
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">Contáctame</h2>

      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <MdOutlineMarkEmailRead className="contact__option-icon" aria-hidden="true" focusable="false" />
            <h3>Correo electrónico</h3>
            <p className="contact__address">davidglezm2015@gmail.com</p>
            <a href="mailto:davidglezm2015@gmail.com" target="_blank" rel="noopener noreferrer">Escribir por correo</a>
          </article>

          <article className="contact__option">
            <FaWhatsapp className="contact__option-icon" aria-hidden="true" focusable="false" />
            <h3>WhatsApp</h3>
            <p className="contact__address">(+52) 55 4061-3200</p>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>
          </article>
        </div>

        <form
          ref={form}
          onSubmit={sendEmail}
          onInvalid={() => setNotice({ kind: 'error', text: 'Revisa los campos obligatorios y el formato del correo electrónico.' })}
          id="form"
          className="contact__form"
          aria-label="Formulario de contacto"
          aria-describedby="contact-required"
          aria-busy={isSubmitting}
        >
          <p id="contact-required" className="contact__help">Todos los campos son obligatorios.</p>

          <FormField className="contact__field" label="Nombre completo" type="text" name="name" id="name" autoComplete="name" required readOnly={isSubmitting} onInput={handleInput} />

          <FormField className="contact__field" label="Correo electrónico" type="email" name="email" id="email" autoComplete="email" placeholder="nombre@empresa.com" required readOnly={isSubmitting} onInput={handleInput} />

          <FormField className="contact__field" label="Teléfono" type="tel" name="phone" id="phone" autoComplete="tel" inputMode="tel" placeholder="+52 55 1234 5678" required readOnly={isSubmitting} onInput={handleInput} />

          <FormField className="contact__field" label="Mensaje" multiline name="message" id="message" rows="7" placeholder="Cuéntame qué necesitas desarrollar." required readOnly={isSubmitting} onInput={handleInput} />

          <div
            className="contact__captcha"
            ref={captchaGroup}
            onFocusCapture={() => setCaptchaReady(true)}
            role="group"
            aria-label="Verificación de seguridad"
            aria-describedby="contact-captcha-help contact-captcha-error"
            tabIndex={-1}
          >
            <p id="contact-captcha-help" className="contact__help">Completa la verificación de seguridad para enviar tu mensaje.</p>
            <div className="contact__captcha-widget">
            {captchaReady && <ReCAPTCHA
              ref={captcha}
              sitekey="6LcT4V4rAAAAAJmXYWcL6Vp7uHKXLQw4p3sHY7dt"
              size="compact"
              theme="dark"
              hl="es"
              onChange={handleCaptcha}
              onExpired={handleExpired}
              onErrored={handleCaptchaError}
              asyncScriptOnLoad={state => { if (state.errored) handleCaptchaError(); }}
            />}
            </div>
            <p id="contact-captcha-error" className="contact__error" role="alert">{captchaError}</p>
          </div>

          <div ref={feedback} className="contact__feedback">
            <p className="contact__status" role="status" aria-live="polite" aria-atomic="true">
              {notice.kind !== 'error' ? notice.text : ''}
            </p>
            <p className="contact__error" role="alert">{notice.kind === 'error' ? notice.text : ''}</p>
          </div>

          <button type="submit" className="btn btn-primary contact__submit" disabled={isSubmitting || !clientReady}>
            {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
