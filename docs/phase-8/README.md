# Fase 8 — Revisión editorial, solicitudes de demo y cierre de UI

Estado: implementación y validación terminadas. Permanece pendiente la confirmación del dato de experiencia (+4/+5 años). La Fase 9 de SEO técnico para México no se ha iniciado.

## Resultado

Los 23 proyectos disponen de «Solicitar demo» hacia WhatsApp **+52 55 4061 3200**, con un mensaje distinto que identifica el proyecto. Se mantiene la identidad de David Molina, desarrollador Full Stack bajo DMS, y se unifican etiquetas y redacción en español sin agregar servicios o afirmaciones profesionales.

Los tres proyectos confidenciales conservan la restricción de presentación pública. Su mensaje utiliza solo el nombre que ya aparece en la tarjeta y consulta la posibilidad de una demo privada. No incorpora descripciones, tecnologías, URL, credenciales ni información interna. Los enlaces públicos existentes permanecen como acciones secundarias «Ver proyecto», con nombre accesible que incluye el proyecto.

Se preservan los 23 nombres de proyecto, los 14 enlaces de demo/sitio del inventario, las tres categorías y sus 15 elementos de servicio, los cuatro testimonios, imágenes originales y optimizadas, CV, rutas, integraciones y lógica de envío. Los botones preparan una solicitud editable; no envían un mensaje automáticamente ni garantizan disponibilidad de una demo.

## Archivos modificados

| Archivos | Modificación |
|---|---|
| `src/components/ui/ProjectDemoLink.jsx` | Nuevo enlace de acción compartido: etiqueta «Solicitar demo», icono WhatsApp, nombre accesible único, target blank y rel seguro mediante ActionLink. |
| `src/utils/contactLinks.js` | Nuevo número único para los enlaces y construcción de URL con encodeURIComponent. Mensaje público y variante confidencial. El contacto directo conserva su URL anterior. |
| `src/components/portfolio/Portfolio.jsx`, `portfolio.css` | Añade las 23 solicitudes; conserva las URL originales, jerarquiza una acción principal por proyecto y alinea las solicitudes al final de cada fila. Los controles ajustan líneas al ampliar texto. |
| `src/index.css` | Agrupación de título y ayuda sin etiquetas introductorias repetidas. El título de destacados usa más ancho con texto ampliado, sin reducir el tamaño elegido por el usuario. Usa los tokens existentes. |
| `src/components/header/Header.jsx` | Corrige la puntuación y redacción de la presentación; mantiene Full Stack, creador de contenido y México. |
| `src/components/about/About.jsx` | Alinea la biografía con la identidad Full Stack/DMS confirmada, conserva la experiencia Front-End, trabajo en equipo/independiente y búsqueda de una oportunidad profesional. Normaliza títulos y cambia el CTA a «Hablemos de tu proyecto». |
| `src/components/services/Services.jsx` | Corrige ortografía y redundancias; títulos «Diseño UI/UX», «Desarrollo web» y «Creación de contenido». Se mantienen los 6, 5 y 4 elementos respectivos y los ámbitos técnicos originales. |
| `src/data/data.jsx` | Correcciones editoriales en cuatro descripciones y actualización del siguiente paso de los tres avisos confidenciales: WhatsApp o formulario. La primera frase de restricción, nombres, imágenes, enlaces, tecnologías, estado y fecha declarados se preservan. |
| `src/components/contact/Contact.jsx` | «Correo electrónico», «WhatsApp», «Escribir por correo» y «Escribir por WhatsApp». Reutiliza la URL compartida. El bloque de estado, efectos, validación y envío no cambia. |
| `src/components/footer/Footer.jsx` | «Inicio», «Sobre mí» y traducción de la frase de derechos reservados. Se mantienen titular DM SERIES y año 2023 originales, destinos y redes sociales. |
| `src/components/testimonials/Testimonials.jsx` | Retira únicamente la etiqueta introductoria redundante. Nombres, testimonios y lógica permanecen idénticos. |
| `src/utils/contactLinks.test.js`, `src/App.navigation.test.jsx`, `src/components/contact/Contact.test.jsx` | Cuatro nuevas pruebas de URL/mensajes, una de integración de las 23 solicitudes y actualización de etiquetas esperadas sin retirar las regresiones anteriores. |

Son **12 archivos existentes modificados y 3 nuevos de código/pruebas**. No se añadieron dependencias, recursos gráficos, colores, fuentes ni animaciones. Se mantiene el sistema visual, el responsive y la entrega optimizada de fases anteriores.

## Ejemplos de mensajes

Público:

> Hola David, me interesa "CREM - Sistema Web" de DMS. Me gustaría solicitar una demo y conocer más sobre este proyecto.

Confidencial:

> Hola David, me interesa "App Techcomp" de DMS. Quisiera consultar la posibilidad de una demo privada, respetando la confidencialidad del proyecto.

El texto se codifica como un único parámetro text de https://wa.me/525540613200. Se verificaron acentos, espacios, &, signos de interrogación, fragmentos y símbolos sin introducir otros parámetros o cambiar el destinatario.

## Pruebas y revisión visual

`npm.cmd test -- --watchAll=false --runInBand`: **7 suites y 43 pruebas aprobadas**. Se mantienen las 38 anteriores y se añaden cinco de solicitudes de demo. El inventario sigue comprobando títulos, destinos, CV, formulario y los 15 elementos de servicio. Los 23 mensajes son distintos y los tres confidenciales usan la variante privada.

`npm.cmd run build`: **Compiled successfully**, salida 0. JavaScript **122.50 kB gzip**; CSS **9.56 kB gzip**. Sin nuevas advertencias de ESLint. Persiste el aviso previo de Browserslist/caniuse-lite; no se actualizaron paquetes.

`node scripts/verify-navigation.cjs --polish`: **64 comprobaciones aprobadas**, con cero excepciones JavaScript no controladas. Incluye las 57 regresiones de navegación, formulario, componentes, movimiento, carrusel y recursos, más siete específicas de Fase 8:

- Una solicitud personalizada por cada proyecto y un único CTA primario por tarjeta.
- Número, host, parámetro de mensaje, target y rel correctos.
- Mensajes confidenciales limitados al nombre público y la consulta privada.
- Categorías y 15 elementos de servicio conservados.
- Controles de demo sin recorte al ampliar texto al 200% en 320 y 768 px.
- Foco de teclado visible de 3 px y por encima de la navegación fija, recorriendo los enlaces en su orden de DOM.

Se repite la matriz de 320, 360, 390, 600, 601, 768, 1024, 1025, 1280, 1440 y 1920 px y once casos adicionales de ventanas bajas, reflujo equivalente a zoom 200%/400%, texto ampliado y fuentes de respaldo. Poppins y Geologica cargan correctamente. El árbol accesible contiene un único main y 61 enlaces con nombre.

Se inspeccionaron capturas de móvil, tablet y escritorio para el recorrido completo. La revisión visual con texto al 200% detectó la fragmentación del nuevo título «Proyectos destacados»; se amplió su espacio y se comprobó de nuevo. Los nombres propios muy largos pueden ajustarse dentro de tarjetas estrechas al ampliar texto; permanecen completos, sin truncamiento ni reducción forzada del tamaño preferido.

`node scripts/verify-design-system.cjs --phase-8`: 12 CSS, 74 tokens y 324 referencias; sin tokens ausentes, duplicados o cíclicos, ni estilos de componentes filtrados a elementos globales. Los 15 pares de contraste mantienen sus umbrales. El hook automático de Impeccable no reportó hallazgos deterministas; no se tomó un resultado limpio como sustituto de la revisión visual. `git diff --check` termina sin errores.

Evidencia: [browser-results.json](browser-results.json), [system-checks.json](system-checks.json) y PNG de esta carpeta. Se añade `scripts/verify-polish-browser.cjs` y el modo --polish; los runners de estilos/layout se ajustan para verificar la acción principal final de cada fila y la Fase 8. No se abren enlaces de WhatsApp ni se envían mensajes durante estas comprobaciones.

## Integridad

`node scripts/verify-phase8-integrity.cjs`: SHA-256 contra los **179 archivos** del inicio, iguales al cierre de Fase 7. Hay 12 modificaciones previstas, 3 archivos nuevos y 167 archivos existentes intactos. Sin eliminaciones ni cambios fuera del alcance.

- El bloque completo de estado, efectos, callbacks, validación y envío de Contact coincide exactamente con el hash registrado antes de editar etiquetas.
- Al revertir solo las cinco sustituciones editoriales aprobadas en memoria, data.jsx recupera exactamente su hash anterior. Esto protege el resto de datos, rutas, imágenes, etiquetas e iconos.
- Al restaurar únicamente la etiqueta introductoria de testimonios en memoria, el archivo completo recupera su hash anterior. Las cuatro citas y su comportamiento se mantienen.
- Recursos originales y optimizados, CV/PDF, paquetes, public/index.html, App, Nav, título animado, controles de medios y entrega de imágenes permanecen intactos.

Detalle: [integrity-results.json](integrity-results.json). La instantánea de cierre de 182 archivos está en [source-hashes.json](source-hashes.json). No hubo instalaciones, commits ni despliegues. Los cambios anteriores del usuario y la evidencia de fases previas se conservan.

## Dato pendiente y siguiente fase

El encabezado indicaba +4 años y Sobre mí +5 años. Se solicitó al usuario la cifra correcta mediante una pregunta asíncrona; no se recibió una confirmación durante la implementación. Se conservaron ambos valores. La guía de [Impeccable SKILL.md](../../.agents/skills/impeccable/SKILL.md) establece: «Ask before replacing factual copy or adding claims». Se aplica a esta cifra profesional, no como una aprobación adicional para el resto de cambios ya autorizados.

Los nombres comerciales de los proyectos, las cifras de clientes/proyectos, las citas y el estado/fecha declarados se conservan como fueron proporcionados. No se inventan entregas, resultados, disponibilidad de demos o métricas profesionales.

EmailJS y CAPTCHA se validan con respuestas simuladas; la configuración remota y entrega real de mensajes siguen sin acreditarse. WhatsApp se valida por estructura de URL, contenido y accesibilidad, sin realizar un envío. No se certifica WCAG integral ni funcionamiento en todo hardware físico.

La **Fase 9 — SEO técnico y posicionamiento orgánico para México** requiere autorización. No se modificaron metadatos, indexación, sitemap, robots, datos estructurados ni hosting en esta etapa.
