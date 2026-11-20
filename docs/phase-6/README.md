# Fase 6 — Animaciones y microinteracciones

Estado: implementada y validada localmente. La Fase 7 no se ha iniciado.

## Resultado

El movimiento se concentra en el título y en la respuesta a acciones. Se mantienen las tres frases del encabezado, la identidad de David Molina/DMS, los proyectos y el contenido existente.

- El título muestra una presentación completa desde el primer render, utiliza un solo temporizador y ofrece «Pausar animación / Reanudar animación». Al pausarlo completa la frase actual. Se suspende fuera de pantalla o con la pestaña oculta y libera sus recursos al desmontarse.
- En móvil y con movimiento reducido se muestra una presentación estática. La preferencia se lee desde el primer render y se actualiza en vivo. El nombre accesible del h1 permanece estable y no anuncia cada letra.
- Se retiran la pulsación perpetua de disponibilidad, el giro de la fotografía al pasar el cursor y el desplazamiento de destacados al hacer hover. La composición estática se conserva.
- Los botones mantienen feedback de color/borde y una respuesta de presión de 1 px durante 150 ms; con movimiento reducido no se desplazan. Se conservan el foco y los estados del formulario.
- El carrusel conserva sus cuatro testimonios y el gesto de arrastre. La selección usa cuatro botones nativos de al menos 44 × 44 px con nombres en español, destino y estado actual. Solo el testimonio activo se expone al árbol accesible. La transición manual dura 300 ms o 0 ms con movimiento reducido. No se añade autoplay.

Contrato y criterios: [MOTION.md](MOTION.md).

## Archivos

| Archivo | Modificación |
|---|---|
| `src/components/Typewriter.jsx` | Secuencia controlada, pausa, suspensión por visibilidad, alternativa estática y limpieza de temporizadores/observador/listeners. |
| `src/components/header/Header.jsx` | Frases estables fuera del render y un único Typewriter. Elimina la escucha de resize que intercambiaba el componente. |
| `src/components/header/header.css` | Control de pausa, cursor solo durante la secuencia y distintivo de disponibilidad estático. |
| `src/hooks/useMediaQuery.js` | Nuevo hook compartido para leer y escuchar preferencias sin dependencias. Incluye compatibilidad con la API antigua de MediaQueryList. |
| `src/components/testimonials/Testimonials.jsx` | Integra A11y de Swiper ya instalado, velocidad según preferencia, selección nativa y estado accesible de las diapositivas. |
| `src/components/testimonials/testimonials.css` | Paginación con objetivos amplios, indicador actual y foco que no queda recortado por Swiper. |
| `src/styles/tokens.css`, `src/styles/primitives.css` | Transiciones de estado comunes y respuesta de presión acotada a los botones. |
| `src/index.css` | Movimiento reducido para animaciones CSS, anclas, transiciones de Swiper y avisos de SweetAlert, conservando feedback de estado. |
| `src/components/about/about.css`, `src/components/portfolio/portfolio.css` | Elimina desplazamientos decorativos; conserva la composición y el resaltado de foco en destacados. |
| `src/components/Typewriter.test.jsx` | Nuevo: siete pruebas de ciclo, StrictMode, pausa, preferencias, tamaño móvil, visibilidad, limpieza y fallback. |
| `src/App.navigation.test.jsx` | Ajusta el mock de Swiper/CSS al módulo A11y; conserva las comprobaciones originales de contenido, rutas y enlaces. |

Son 11 archivos existentes modificados y 2 archivos nuevos de código/pruebas. No se modifica App, Nav, Contact, datos, recursos o paquetes en esta fase.

Los scripts de navegación, diseño, layout y comprobación estática incorporan el modo de Fase 6. Se agregan `scripts/verify-motion-browser.cjs` y `scripts/verify-phase6-integrity.cjs`. La evidencia de fases anteriores se conserva.

## Pruebas

### Compilación y pruebas unitarias

`npm.cmd run build`: **Compiled successfully**, salida 0. JavaScript 120.33 kB gzip; CSS 9.46 kB gzip. Sin advertencias de ESLint. Permanece el aviso anterior de Browserslist/caniuse-lite; no se actualizan paquetes.

`npm.cmd test -- --watchAll=false --runInBand`: **5 suites, 32 pruebas aprobadas**. Las 25 existentes siguen pasando. Las siete nuevas verifican:

- Contenido visible al inicio y recorrido de las tres frases con un máximo de un timeout pendiente, incluso en StrictMode.
- Pausa que conserva una frase completa y reanudación sin acumulación de temporizadores.
- Preferencia reducida inicial y cambios en vivo.
- Presentación estática móvil y cambio al cruzar 600 px.
- Suspensión al quedar fuera de pantalla o con document.hidden.
- Limpieza al desmontar y alternativa sin matchMedia.

### Chrome

Comando completo: `node scripts/verify-navigation.cjs --motion`.

Resultado de cierre: **47 comprobaciones aprobadas**, con 11 viewports principales, 11 escenarios adicionales y cero excepciones JavaScript no controladas. Poppins y Geologica cargaron correctamente. No se detectan desbordamientos horizontales en los escenarios medidos.

La matriz incluye 320, 360, 390, 600, 601, 768, 1024, 1025, 1280, 1440 y 1920 px; además de 11 escenarios de ventanas bajas, reflujo equivalente al 200%/400%, texto al 200% y fuentes de respaldo. El reflujo equivalente usa viewports CSS reducidos y no sustituye todas las características del zoom nativo.

Las 14 verificaciones específicas comprueban pausa/reanudación por Espacio, texto completo al pausar, nombre accesible estable, suspensión fuera de pantalla, preferencia reducida en vivo, decoraciones estáticas, feedback de presión, Enter/Espacio en paginación, objetivos de 44 px, diapositiva actual/ocultas, velocidad y posición con movimiento reducido, árbol accesible, gesto táctil sintetizado y presentación móvil estática.

También se repiten las 33 comprobaciones de navegación, historial, foco, contacto simulado, sistema visual y layout. Las fuentes Poppins/Geologica se permiten desde sus dominios existentes. Las capturas muestran estados normales, pausa, reducción de movimiento y selección de testimonios con teclado/toque.

El runner abre un documento nuevo antes de cada escenario para no heredar estado React o restauración de scroll de una navegación al mismo fragmento. Activa la pestaña headless y evita la limitación de temporizadores en segundo plano. Las regresiones de navegación/formulario se ejecutan con movimiento reducido; la pasada específica de layout/movimiento restablece la preferencia normal y prueba también sus cambios en vivo. Enter incluye su evento de texto nativo. El gesto parte de la página sin fragmento, se prepara con scroll instantáneo y comprueba el elemento bajo el dedo; así no compite con un desplazamiento automático al ancla todavía en curso. Se espera al destino de navegación en lugar de depender de una pausa fija.

### Sistema e integridad

- `node scripts/verify-design-system.cjs --phase-6`: 12 CSS, 74 tokens y 308 referencias; sin tokens ausentes, duplicados o cíclicos, ni fugas de selectores. Los 15 pares de contraste superan sus umbrales.
- Impeccable no ofrece scope `motion` en esta instalación. El análisis estático disponible `type,layout` termina sin hallazgos; el movimiento se verifica con revisión de código, pruebas unitarias y Chrome.
- `git diff --check`: sin errores.
- `node scripts/verify-phase6-integrity.cjs`: SHA-256 contra los 100 archivos persistidos al comenzar la fase, que coincidían con el cierre de Fase 5. Hay 11 modificaciones previstas, 2 archivos nuevos y 89 archivos existentes intactos. Sin eliminaciones ni cambios inesperados.

Se mantienen los 23 proyectos, 14 demos del inventario, 3 servicios, 4 testimonios, avisos de confidencialidad, CV y enlaces. Los componentes completos de contacto y navegación conservan su hash; se mantienen las integraciones.

Evidencia: [browser-results.json](browser-results.json), [system-checks.json](system-checks.json), [integrity-results.json](integrity-results.json), PNG y [source-hashes.json](source-hashes.json) para la siguiente fase.

## Límites y pendientes

EmailJS se intercepta y CAPTCHA se simula; no se envían mensajes reales. La configuración remota y los dispositivos físicos no se acreditan con estas pruebas. La visibilidad de pestaña y limpieza de temporizadores se comprueban mediante pruebas unitarias; no se declara una medición de consumo o FPS en hardware móvil.

Los GIF originales se conservan. La alternativa de movimiento reducido implementada afecta a CSS y JavaScript; no pausa los fotogramas de un GIF. Su política de reproducción/pósteres se reserva para el trabajo sobre recursos. Las verificaciones no constituyen una certificación WCAG integral.

No se agregan dependencias, no se hacen commits ni despliegues. La optimización de recursos, los botones de demo por proyecto y SEO siguen en sus fases correspondientes. Se conserva la discrepancia editorial de años de experiencia pendiente de confirmación.

La Fase 7 requiere autorización del usuario.
