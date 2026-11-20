# Fase 3 — Contacto fiable y accesible

Estado: implementada y validada localmente. No se ha avanzado a la Fase 4.

## Cambios de producto

- Etiquetas persistentes para nombre, correo, teléfono y mensaje.
- Campos obligatorios indicados antes de completar el formulario.
- Correo y teléfono con name/id correctos; autocompletado de nombre, correo y teléfono, y teclado telefónico.
- Validación nativa y rechazo de nombre, teléfono o mensaje compuestos solo por espacios. No se restringen nombres a un alfabeto concreto ni se introduce un formato telefónico rígido.
- Estado “Enviando…”, botón deshabilitado y guardia síncrona contra solicitudes repetidas.
- Campos de solo lectura durante el envío: conservan su inclusión en FormData.
- Confirmación persistente y avisos de error accesibles; los resultados se desplazan al área visible para evitar que la barra fija los tape.
- SweetAlert2 se conserva con avisos no modales; el resultado permanece en el formulario después de desaparecer el aviso.
- Éxito: se limpia el formulario y se reinicia el CAPTCHA.
- Error: se conserva lo escrito, se desbloquea el envío y se exige una nueva verificación para reintentar.
- CAPTCHA con ref/reset, callbacks de expiración, error de widget y fallo de carga del script; presentación compacta y lenguaje español.
- WhatsApp activo corregido a https://wa.me/525540613200.
- Enlaces de contacto con rel adecuado. Correo directo conservado.

## Contrato de EmailJS

Se conserva emailjs-com 3.2.0 y la llamada sendForm, el servicio y el identificador de plantilla existentes. No se cambian las claves públicas ni la cuenta remota.

Se encontró una plantilla local en correo.html que asocia explícitamente:

| Campo | Variable de plantilla | Tipo del control |
|---|---|---|
| Nombre | name | text |
| Correo | email | email |
| Teléfono | phone | tel |
| Mensaje | message | textarea |

El formulario anterior intercambiaba name=email y name=phone. La corrección sigue la plantilla local encontrada; no se obtuvo una confirmación del contenido actual del panel remoto.

Se inspeccionó la implementación instalada de sendForm: genera FormData sincrónicamente. Se comprobó también con el SDK real en Chrome, interceptando la solicitud, que email contiene el correo, phone el teléfono y g-recaptcha-response el token simulado.

La documentación oficial describe el [mapeo de los campos por sendForm](https://www.emailjs.com/docs/sdk/send-form/) y la [configuración de reCAPTCHA en EmailJS](https://www.emailjs.com/docs/user-guide/adding-captcha-verification/).

**Pendiente externo:** verificar que template_cs4txqq en el panel de EmailJS coincide con correo.html, que Reply-To utiliza la variable de correo adecuada y que la verificación de reCAPTCHA está activada según la configuración de la cuenta. No se accedió al panel ni se modificó la plantilla remota.

## Archivos de implementación

| Archivo | Cambio |
|---|---|
| src/components/contact/Contact.jsx | Validación, estados, etiquetas, mapeo, CAPTCHA y enlace de WhatsApp. |
| src/components/contact/contact.css | Estilos acotados al formulario, legibilidad, campos de 16 px, estados, texto ajustable y botón con contraste adecuado. |

Se mantienen los puntos de entrada #contact y #form. No se modifica el orden de secciones ni el contenido de proyectos o servicios. Los botones “Solicitar demo” por proyecto, la modernización general y SEO permanecen en sus fases posteriores.

## Pruebas automatizadas

Comando: npm.cmd test -- --watchAll=false --runInBand.

Resultado: **3 suites, 23 pruebas aprobadas**, sin errores de consola.

- 13 pruebas específicas de contacto en src/components/contact/Contact.test.jsx.
- Se conservan las 7 pruebas de navegación.
- Se conservan las 3 pruebas de integración del inventario, ajustando únicamente el destino de WhatsApp autorizado y el mock del CAPTCHA para admitir ref.

Cobertura del contacto:
- Etiquetas, tipos, autocompletado, obligatoriedad y región de estado persistente.
- Campos vacíos, correo inválido y campos de solo espacios.
- Ausencia y expiración del CAPTCHA.
- Fallos del widget y del script.
- Serialización de nombre, correo, teléfono, mensaje y token.
- Envíos repetidos y bloqueo temporal de edición.
- Confirmación y reinicio tras éxito.
- Conservación de datos y nuevo CAPTCHA tras error, con reintento exitoso.
- Excepción síncrona del SDK.
- Respuesta recibida después de desmontar, sin notificaciones tardías.
- Destinos de correo y WhatsApp.

Los servicios remotos se simulan. Ninguna prueba envía mensajes reales.

## Chrome y revisión visual

Comando: node scripts/verify-navigation.cjs --contact.

Resultado: **20 comprobaciones de comportamiento aprobadas**: 12 regresiones de navegación y 8 de contacto.

- Chrome instalado en modo headless/CDP.
- Anchos comprobados: 320, 390, 768 y 1440 px.
- Se inspeccionaron las capturas del formulario renderizado.
- Todos los campos tienen etiqueta y fuente calculada de 16 px.
- Campos dentro de los límites de cada viewport; botón con texto blanco comprobado por estilo calculado.
- Validación requerida nativa enfoca el primer campo inválido.
- CAPTCHA ausente enfoca la verificación sin enviar.
- Token expirado bloqueado.
- Se interceptan 3 solicitudes: éxito, error y reintento exitoso.
- Se usa el SDK real de EmailJS para construir las solicitudes, con respuestas locales interceptadas. Ninguna solicitud de EmailJS llega a Internet.
- Los datos serializados tienen los nombres correctos y el token esperado.
- Se comprueba que un segundo submit durante el envío no genera otra solicitud.
- Tras error, los datos persisten y el aviso queda visible por encima de la barra fija.
- Se vuelve a comprobar la navegación, los nombres accesibles, el teclado, el historial y un toque sintetizado sobre Contacto.

El CAPTCHA del navegador es un doble de prueba rotulado “Verificación simulada”, inyectado exclusivamente en el navegador aislado. No forma parte del bundle de producción. No se valida el servicio real de Google, el tamaño real del widget ni una entrega real de correo. Fuentes externas y demás terceros permanecen bloqueados durante las capturas; su aspecto puede diferir de producción. No se utilizaron dispositivos físicos ni lector de pantalla manual.

El helper scripts/verify-navigation.cjs incorpora el modo opcional --contact; su modo habitual se conserva y la evidencia de esta ejecución se escribe en docs/phase-3. El nuevo scripts/verify-contact-browser.cjs contiene las simulaciones y comprobaciones.

Evidencia: browser-results.json; contact-320.png, contact-390.png, contact-768.png, contact-1440.png, contact-success.png, contact-error.png, además de las capturas de regresión de navegación.

## Compilación e integridad

npm.cmd run build: **Compiled successfully**, exit code 0, sin advertencias de ESLint.

- JavaScript principal: 119.89 kB gzip.
- CSS principal: 9.94 kB gzip.
- Persiste únicamente el aviso de Browserslist sobre caniuse-lite desactualizado; no se actualizan paquetes.
- git diff --check: sin errores.
- Detector estático de Impeccable en contacto y prueba de integración: sin hallazgos; no equivale a una certificación de accesibilidad.

Se compararon los 94 archivos preexistentes de src, public y configuración con SHA-256:
- Cambian únicamente Contact.jsx, contact.css y App.navigation.test.jsx.
- Se añade Contact.test.jsx.
- Cero cambios inesperados y cero eliminaciones.
- Permanecen intactos los proyectos, recursos, CV, otros componentes y estilos, package.json, package-lock.json y .gitignore.
- No se alteraron los cambios previos del usuario.
- Se regenera build; no se instalan dependencias, realizan commits ni despliegues.

Detalle de integridad en integrity-results.json.

## Pendientes de sus fases

La discrepancia de identidad visible, el desbordamiento general de la página a 320 px, la composición global y el SEO no forman parte de esta intervención. El panel remoto de EmailJS, Reply-To y la entrega real requieren comprobación externa como se indica arriba.

La Fase 4 requiere autorización del usuario.
