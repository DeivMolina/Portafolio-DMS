# Fase 2 — Navegación y accesibilidad básica

Estado: implementada y validada. No se ha avanzado a la Fase 3.

## Alcance aplicado

- Se mantiene el diseño existente; no se reescriben datos profesionales, proyectos, servicios ni testimonios.
- Se conserva el dominio, los enlaces externos, las demos, el CV y las integraciones.
- Se conservan los cambios previos del usuario en About.jsx y data.jsx.
- No se instalaron ni actualizaron dependencias, no se realizaron commits ni despliegues.
- Contact.jsx y contact.css permanecen intactos. No se implementaron botones de demo por WhatsApp ni SEO, que corresponden a fases posteriores.
- La identidad confirmada (David Molina, Full Stack, DMS, México) sigue registrada en la referencia de Fase 1; la actualización editorial y de SEO se mantiene en sus fases previstas.

## Cambios por archivo

| Archivo | Cambio |
|---|---|
| src/App.jsx | Enlace de salto al contenido y landmark main enfocable; se conserva el orden de todos los componentes montados. Se retira únicamente el import de Experience, que ya estaba sin uso. |
| src/components/header/Header.jsx | Destino inicio enfocable y rel seguro en GitHub. Se retiran dos imports de iconos sin uso. |
| src/components/nav/Nav.jsx | Nombres accesibles, aria-current, destinos reales y seguimiento de sección mediante scroll, resize, carga, fragmentos e historial. Actualización limitada a una por frame y limpieza de listeners/tareas al desmontar. |
| src/components/nav/nav.css | Estilos acotados a site-nav para no afectar al nav semántico del pie. Ancho adaptable, controles de al menos 44 px, indicador activo adicional al color y superficie oscura que mantiene legibles los iconos sobre imágenes. |
| src/components/portfolio/Portfolio.jsx | Se conserva portfolio para destacados; Otros Proyectos usa otros-proyectos. Ambas secciones tienen nombres accesibles y destinos enfocables. Datos y enlaces intactos. |
| src/components/about/About.jsx | experience apunta a la tarjeta existente de experiencia; se nombra la sección y la tarjeta, y se describe el retrato como David Molina. Se conserva +5 años, cambio previo del usuario. |
| src/components/footer/Footer.jsx | Inicio válido, navegación del pie nombrada y textos accesibles de las redes. Se corrige únicamente la etiqueta de navegación “Experiencia”. |
| src/components/footer/footer.css | Reserva inferior para que la barra fija no tape el cierre del sitio. |
| src/index.css | Se elimina el reset de outline y la ocultación de scrollbar; se añaden foco visible, texto solo para lectores, salto al contenido, selección y márgenes de desplazamiento. El scroll suave respeta movimiento reducido. |
| public/index.html | Se permite ampliar la página y se eliminan los bloqueos de selección y menú contextual. Se mantienen los scripts de las integraciones. |

## Destinos y compatibilidad

| Destino | Comportamiento |
|---|---|
| / y fragmento vacío o # | Inicio conservado mediante comportamiento nativo del navegador. |
| #inicio | Destino explícito del encabezado para los enlaces de inicio. |
| #contenido-principal | Salto de teclado al main; no añade una ruta ni requiere router. |
| #portfolio | Entrada original a destacados; ya no está duplicada. |
| #otros-proyectos | Destino adicional único para el archivo existente de proyectos. |
| #services | Servicios existente. |
| #about | Sobre mí existente. |
| #experience | Tarjeta existente de experiencia dentro de Sobre mí. |
| #testimonials | Testimonios existente. |
| #contact | Contacto existente. |

La barra mantiene cinco opciones. Proyectos sigue activo en destacados y otros proyectos. Testimonios se agrupa con Sobre mí para el indicador de la barra; su enlace propio del pie se conserva. Fragmentos mal codificados o desconocidos no bloquean la navegación.

## Pruebas automatizadas

Comando: `npm.cmd test -- --watchAll=false --runInBand`.

Resultado: **2 suites y 10 pruebas aprobadas**.

- Nombres y estado activo único de las cinco opciones.
- Cambio de ubicación por desplazamiento sin pulsar la barra.
- Agrupación de otros proyectos.
- Cambios de fragmento e historial.
- Resolución del destino al cargar con fragmento.
- Fragmentos desconocidos o mal codificados.
- Contacto al final y limpieza al desmontar.
- Landmark main, enlace de salto y destinos internos únicos.
- Nombres de ambas navegaciones y enlaces sociales.
- Conservación de los 23 proyectos, demos, enlaces externos activos, CV y estructura del formulario frente al inventario de Fase 1.

Archivos nuevos: `src/components/nav/Nav.test.jsx` y `src/App.navigation.test.jsx`.

Las pruebas de aplicación aíslan Swiper, reCAPTCHA y servicios externos. No acreditan el funcionamiento remoto del contacto ni el comportamiento táctil del carrusel.

## Pruebas en navegador real

Comando: `node scripts/verify-navigation.cjs`.

Chrome instalado, headless/CDP, con servidor temporal ligado a 127.0.0.1. Se crea un perfil temporal exclusivo y se cierra el navegador y el servidor al terminar. No se interactúa con pestañas del usuario.

Resultado: **12 comprobaciones de comportamiento aprobadas**, además de las comprobaciones por viewport.

| Viewport | Barra dentro de pantalla | Controles de 44 × 44 px o mayores | Destinos internos resueltos |
|---|---|---|---|
| 320 × 740 | Sí | Sí | Sí |
| 390 × 844 | Sí | Sí | Sí |
| 768 × 1024 | Sí | Sí | Sí |
| 1440 × 900 | Sí | Sí | Sí |

- Scroll por destacados, otros proyectos, servicios, sobre mí y contacto.
- Entrada directa a #experience.
- Navegación hacia atrás con historial real.
- Tab hace visible el salto; Enter desplaza y enfoca main.
- Foco de 3 px sólido comprobado por estilo calculado.
- Desplazamiento de anclas sin animación con prefers-reduced-motion.
- Copyright por encima de la barra al final.
- Árbol de accesibilidad con un main y 37 enlaces con nombre.
- Toque sintetizado sobre Contacto con emulación móvil de 390 × 844.
- Sin excepciones JavaScript no controladas durante el recorrido.

Las cuatro primeras capturas corresponden a anchos emulados de escritorio; la prueba adicional de toque usa emulación móvil y entrada táctil sintetizada. No son pruebas en un teléfono físico. Se inspeccionaron las capturas renderizadas en los cuatro anchos.

Las solicitudes de terceros se bloquean deliberadamente para limitar la prueba al sitio local: las fuentes externas y reCAPTCHA no están validados y pueden diferir de producción. No se enviaron mensajes.

Evidencia: `browser-results.json`, `navigation-320.png`, `navigation-390.png`, `navigation-768.png`, `navigation-1440.png`, `skip-link-focus.png` y `footer-clearance.png`.

## Compilación y revisión

`npm.cmd run build`: **exit code 0**, Compiled with warnings.

- JavaScript principal: 116.36 kB gzip.
- CSS principal: 9.72 kB gzip.
- Las advertencias ESLint bajan de 11 en la referencia a 2, ambas preexistentes en los enlaces de Contact.jsx, cuyo tratamiento se mantiene en Fase 3.
- Persiste el aviso de Browserslist/caniuse-lite desactualizado; no se actualizan dependencias.
- `git diff --check`: sin errores.
- Detector estático de Impeccable en los componentes seleccionados: sin hallazgos. Se complementa con pruebas y revisión visual; no supone conformidad WCAG completa.

La compilación y Chrome necesitaron ejecución fuera del aislamiento debido a las restricciones del temporal y del proceso de página. Se utilizaron las aprobaciones correspondientes; no se cambió configuración de Git.

## Integridad y pendientes

Se compararon los 92 archivos originales contra el inicio de Fase 2 mediante SHA-256: exactamente los 10 archivos previstos de esta fase cambiaron; cero cambios inesperados y cero eliminaciones. Se añaden los dos archivos de pruebas. El detalle está en `integrity-results.json`.

Permanecen intactos Contact.jsx, contact.css, data.jsx, servicios, testimonios, package.json, package-lock.json y todos los recursos originales. El archivo de referencia y el inventario de Fase 1 no se modificaron.

En 320 px se observa overflow horizontal del contenido general (scrollWidth 331 px), aunque la barra cabe. La revisión del layout, el header y sus breakpoints corresponde a Fase 5. No se aplicó overflow:hidden para ocultar el problema.

Siguen pendientes de sus fases: accesibilidad del formulario, contraste general, jerarquía tipográfica completa, animaciones del encabezado, accesibilidad del carrusel, rendimiento y SEO. No se declara conformidad WCAG completa.

La Fase 3 requiere nueva autorización del usuario.
