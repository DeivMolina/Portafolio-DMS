export const WHATSAPP_NUMBER = '525540613200';

export function whatsappUrl(message = '') {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

export function projectDemoUrl(projectTitle, confidential = false) {
  const message = confidential
    ? `Hola David, me interesa "${projectTitle}" de DMS. Quisiera consultar la posibilidad de una demo privada, respetando la confidencialidad del proyecto.`
    : `Hola David, me interesa "${projectTitle}" de DMS. Me gustaría solicitar una demo y conocer más sobre este proyecto.`;
  return whatsappUrl(message);
}
