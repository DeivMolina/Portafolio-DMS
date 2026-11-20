import React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
import Contact from './Contact';

const mockCaptchaReset = jest.fn();

test('pospone el widget hasta acercarse al formulario y conserva los campos nativos', () => {
  const previous = global.IntersectionObserver;
  let notify;
  const disconnect = jest.fn();
  global.IntersectionObserver = jest.fn(callback => { notify = callback; return { observe: jest.fn(), disconnect }; });
  try {
    const {unmount} = render(<Contact />);
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.queryByRole('button', {name:'Verificar CAPTCHA'})).not.toBeInTheDocument();
    act(() => notify([{isIntersecting:true}]));
    expect(screen.getByRole('button', {name:'Verificar CAPTCHA'})).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();
    unmount();
  } finally { global.IntersectionObserver = previous; }
});

test('enfocar la verificación solicita el widget aunque el observador no lo haya activado', () => {
  const previous = global.IntersectionObserver;
  global.IntersectionObserver = jest.fn(() => ({observe:jest.fn(),disconnect:jest.fn()}));
  try {
    const {unmount}=render(<Contact />);
    fireEvent.focus(screen.getByRole('group', {name:'Verificación de seguridad'}));
    expect(screen.getByRole('button', {name:'Verificar CAPTCHA'})).toBeInTheDocument();
    unmount();
  } finally { global.IntersectionObserver = previous; }
});

jest.mock('emailjs-com', () => ({ sendForm: jest.fn() }));
jest.mock('sweetalert2', () => ({ fire: jest.fn() }));
jest.mock('react-google-recaptcha', () => {
  const React = require('react');
  return React.forwardRef(({ onChange, onExpired, onErrored, asyncScriptOnLoad }, ref) => {
    const [token, setToken] = React.useState('');
    React.useImperativeHandle(ref, () => ({
      reset: () => { mockCaptchaReset(); setToken(''); },
    }));
    return (
      <div>
        <textarea name="g-recaptcha-response" aria-hidden="true" hidden readOnly value={token} />
        <button type="button" onClick={() => { setToken('test-token'); onChange('test-token'); }}>Verificar CAPTCHA</button>
        <button type="button" onClick={onExpired}>Caducar CAPTCHA</button>
        <button type="button" onClick={onErrored}>Fallar CAPTCHA</button>
        <button type="button" onClick={() => asyncScriptOnLoad({ errored: true })}>Fallar carga del script</button>
      </div>
    );
  });
});

const fillForm = () => {
  fireEvent.input(screen.getByLabelText('Nombre completo'), { target: { value: 'José Molina' } });
  fireEvent.input(screen.getByLabelText('Correo electrónico'), { target: { value: 'jose@example.com' } });
  fireEvent.input(screen.getByLabelText('Teléfono'), { target: { value: '+52 55 1234 5678' } });
  fireEvent.input(screen.getByLabelText('Mensaje'), { target: { value: 'Necesito un sistema web.' } });
};

const verifyCaptcha = () => fireEvent.click(screen.getByRole('button', { name: 'Verificar CAPTCHA' }));
const submit = () => fireEvent.submit(screen.getByRole('form', { name: 'Formulario de contacto' }));

beforeEach(() => {
  jest.clearAllMocks();
  emailjs.sendForm.mockResolvedValue({ status: 200, text: 'OK' });
});

test('asocia etiquetas persistentes y configura autocompletado y teclado de teléfono', () => {
  render(<Contact />);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('autocomplete', 'name');
  expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('type', 'email');
  expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('name', 'email');
  expect(screen.getByLabelText('Teléfono')).toHaveAttribute('type', 'tel');
  expect(screen.getByLabelText('Teléfono')).toHaveAttribute('name', 'phone');
  expect(screen.getByLabelText('Teléfono')).toHaveAttribute('autocomplete', 'tel');
  for (const label of ['Nombre completo', 'Correo electrónico', 'Teléfono', 'Mensaje']) {
    expect(screen.getByLabelText(label)).toBeRequired();
  }
});

test('rechaza campos vacíos y correo inválido sin contactar con EmailJS', () => {
  render(<Contact />);
  submit();
  expect(emailjs.sendForm).not.toHaveBeenCalled();
  fillForm();
  fireEvent.input(screen.getByLabelText('Correo electrónico'), { target: { value: 'correo-invalido' } });
  submit();
  expect(emailjs.sendForm).not.toHaveBeenCalled();
  expect(screen.getByText(/Revisa los campos obligatorios/)).toHaveAttribute('role', 'alert');
});

test('rechaza nombre, teléfono y mensaje de solo espacios y permite corregirlos', () => {
  render(<Contact />);
  fillForm();
  for (const label of ['Nombre completo', 'Teléfono', 'Mensaje']) {
    fireEvent.input(screen.getByLabelText(label), { target: { value: '   ' } });
  }
  verifyCaptcha();
  submit();
  expect(emailjs.sendForm).not.toHaveBeenCalled();
  fillForm();
  expect(screen.getByRole('form')).toBeValid();
});

test('sin CAPTCHA anuncia el requisito y enfoca la verificación', () => {
  render(<Contact />);
  fillForm();
  submit();
  expect(emailjs.sendForm).not.toHaveBeenCalled();
  expect(screen.getByRole('group', { name: 'Verificación de seguridad' })).toHaveFocus();
  expect(screen.getByText('Completa la verificación de seguridad antes de enviar.')).toHaveAttribute('role', 'alert');
});

test('serializa correo, teléfono, mensaje y token según la plantilla local, y reinicia tras éxito', async () => {
  let data;
  emailjs.sendForm.mockImplementation((service, template, form) => {
    data = new FormData(form);
    return Promise.resolve({ status: 200 });
  });
  render(<Contact />);
  fillForm();
  verifyCaptcha();
  submit();
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Tu mensaje se envió correctamente.'));
  expect(emailjs.sendForm).toHaveBeenCalledWith('default_service', 'template_cs4txqq', screen.getByRole('form'), expect.any(String));
  expect(data.get('name')).toBe('José Molina');
  expect(data.get('email')).toBe('jose@example.com');
  expect(data.get('phone')).toBe('+52 55 1234 5678');
  expect(data.get('message')).toBe('Necesito un sistema web.');
  expect(data.get('g-recaptcha-response')).toBe('test-token');
  expect(screen.getByLabelText('Correo electrónico')).toHaveValue('');
  expect(mockCaptchaReset).toHaveBeenCalledTimes(1);
  expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ toast: true, icon: 'success' }));
});

test('bloquea envíos repetidos y edición durante una solicitud pendiente', async () => {
  let resolve;
  emailjs.sendForm.mockReturnValue(new Promise(done => { resolve = done; }));
  render(<Contact />);
  fillForm();
  verifyCaptcha();
  submit();
  submit();
  expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
  expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByLabelText('Mensaje')).toHaveAttribute('readonly');
  await act(async () => resolve({ status: 200 }));
  expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeEnabled();
  expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'false');
});

test('conserva los datos ante error y exige CAPTCHA nuevo antes de reintentar', async () => {
  emailjs.sendForm.mockRejectedValueOnce({ status: 0, text: 'simulated network failure' });
  render(<Contact />);
  fillForm();
  verifyCaptcha();
  submit();
  await waitFor(() => expect(screen.getByText(/Tus datos se conservaron/)).toBeInTheDocument());
  expect(screen.getByLabelText('Correo electrónico')).toHaveValue('jose@example.com');
  expect(screen.getByLabelText('Mensaje')).toHaveValue('Necesito un sistema web.');
  expect(mockCaptchaReset).toHaveBeenCalledTimes(1);
  submit();
  expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
  verifyCaptcha();
  submit();
  await waitFor(() => expect(emailjs.sendForm).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Tu mensaje se envió correctamente.'));
});

test('la expiración del CAPTCHA invalida un token previamente válido', () => {
  render(<Contact />);
  fillForm();
  verifyCaptcha();
  fireEvent.click(screen.getByRole('button', { name: 'Caducar CAPTCHA' }));
  expect(screen.getByText(/La verificación caducó/)).toBeInTheDocument();
  submit();
  expect(emailjs.sendForm).not.toHaveBeenCalled();
});

test.each(['Fallar CAPTCHA', 'Fallar carga del script'])('%s muestra alternativas y no envía', button => {
  render(<Contact />);
  fillForm();
  verifyCaptcha();
  fireEvent.click(screen.getByRole('button', { name: button }));
  expect(screen.getByText(/No se pudo cargar la verificación/)).toHaveAttribute('role', 'alert');
  submit();
  expect(emailjs.sendForm).not.toHaveBeenCalled();
});

test('gestiona una excepción síncrona del SDK sin perder datos ni dejar el botón bloqueado', async () => {
  emailjs.sendForm.mockImplementationOnce(() => { throw new Error('simulated'); });
  render(<Contact />);
  fillForm();
  verifyCaptcha();
  submit();
  await waitFor(() => expect(screen.getByText(/Tus datos se conservaron/)).toBeInTheDocument());
  expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeEnabled();
  expect(screen.getByLabelText('Nombre completo')).toHaveValue('José Molina');
});

test('una respuesta posterior al desmontaje no abre notificaciones', async () => {
  let resolve;
  emailjs.sendForm.mockReturnValueOnce(new Promise(done => { resolve = done; }));
  const { unmount } = render(<Contact />);
  fillForm();
  verifyCaptcha();
  submit();
  unmount();
  await act(async () => resolve({ status: 200 }));
  expect(Swal.fire).not.toHaveBeenCalled();
});

test('ofrece WhatsApp con lada internacional y mantiene el correo directo', () => {
  render(<Contact />);
  expect(screen.getByRole('link', { name: 'Escribir por WhatsApp' })).toHaveAttribute('href', 'https://wa.me/525540613200');
  expect(screen.getByRole('link', { name: 'Escribir por WhatsApp' })).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByRole('link', { name: 'Escribir por correo' })).toHaveAttribute('href', 'mailto:davidglezm2015@gmail.com');
});
