import { projectDemoUrl, whatsappUrl } from './contactLinks';

test('conserva el contacto directo con la lada internacional de México', () => {
  expect(whatsappUrl()).toBe('https://wa.me/525540613200');
});

test('una solicitud pública identifica el proyecto sin añadir datos técnicos', () => {
  const url = new URL(projectDemoUrl('CREM - Sistema Web'));
  expect(url.origin).toBe('https://wa.me');
  expect(url.pathname).toBe('/525540613200');
  expect(url.searchParams.get('text')).toContain('CREM - Sistema Web');
  expect(url.searchParams.get('text')).toContain('DMS');
  expect(url.searchParams.get('text')).toContain('solicitar una demo');
});

test('el mensaje confidencial solicita una posibilidad de demo privada', () => {
  const message = new URL(projectDemoUrl('App Techcomp', true)).searchParams.get('text');
  expect(message).toBe('Hola David, me interesa "App Techcomp" de DMS. Quisiera consultar la posibilidad de una demo privada, respetando la confidencialidad del proyecto.');
  expect(message).not.toMatch(/https?:|QR|regiones|Firebase|MySQL/);
});

test('acentos, espacios y símbolos permanecen dentro de un único mensaje', () => {
  const name = 'Sistema José & Ana <Web /> / México?text=otro#demo';
  const url = new URL(projectDemoUrl(name));
  expect([...url.searchParams.keys()]).toEqual(['text']);
  expect(url.searchParams.get('text')).toContain(name);
  expect(url.hash).toBe('');
});
