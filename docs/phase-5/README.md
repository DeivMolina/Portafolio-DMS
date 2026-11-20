# Fase 5 — Composición, jerarquía y adaptación responsive

Estado: implementada y validada localmente. La Fase 6 no se ha iniciado.

## Resultado

El portafolio usa contenedores fluidos con ancho máximo, un encabezado de altura automática y cuadrículas que se adaptan al contenido. Se corrigen recortes del encabezado, columnas estrechas, relleno duplicado en destacados, imágenes de proporciones inconsistentes y espacios poco útiles en tablet.

Se mantiene el sistema oscuro y azul de DMS y las familias Poppins/Geologica. La presentación identifica a David Molina como desarrollador Full Stack, conforme al requisito confirmado, y agrega «Hablemos» hacia el formulario existente. GitHub, LinkedIn y el CV se conservan.

Se preservan los 23 proyectos, las 3 categorías de servicios, los 4 testimonios, las 14 demos del inventario y las advertencias de los 3 proyectos confidenciales. No se agregan dependencias ni se cambian rutas, datos o recursos originales.

Las reglas vigentes se describen en [LAYOUT.md](LAYOUT.md).

## Archivos de interfaz modificados en esta fase

| Archivos | Cambio y problema resuelto |
|---|---|
| `src/styles/tokens.css` | Contenedor máximo, márgenes fluidos, medidas de lectura, ritmo de secciones y tamaños tipográficos por rol. Sustituye los tres anchos porcentuales heredados. |
| `src/index.css` | Contenedor común, separación de secciones, interlineado de títulos y ajuste natural de texto. Retira consultas inválidas y la regla que imponía 70% de ancho en pantallas pequeñas. |
| `src/styles/primitives.css` | Los botones pueden reducir su ancho y ajustar contenido sin imponer un mínimo que provoque desbordamiento. |
| `src/components/header/Header.jsx`, `header.css` | Altura automática; acciones con salto de línea; descripción sin corte manual; rol Full Stack y contacto principal. El título puede ocupar varias líneas y el cursor mide una línea. |
| `src/components/portfolio/Portfolio.jsx`, `portfolio.css` | Etiqueta introductoria como párrafo; destacados de una o dos columnas con un solo relleno; miniaturas 16:10 completas; archivo de una, dos o tres columnas y acciones alineadas por fila. |
| `src/components/about/About.jsx`, `about.css` | Introducción como párrafo y títulos de métricas con nivel semántico adecuado. Fotografía contenida, métricas legibles y biografía alineada al inicio, sin justificación forzada. |
| `src/components/services/Services.jsx`, `services.css` | Introducción como párrafo; cuadrícula adaptable, relleno común y listas que permiten crecer al texto. |
| `src/components/testimonials/Testimonials.jsx`, `testimonials.css` | Introducción como párrafo, nombres como títulos y reseñas como párrafos. Medida de lectura más cómoda, sin el doble estrechamiento anterior. |
| `src/components/contact/Contact.jsx`, `contact.css` | Introducción y direcciones con semántica correcta. Formulario con ancho útil en tablet; alternativas agrupadas; columnas proporcionadas en escritorio. |
| `src/components/nav/nav.css` | Objetivos de icono de al menos 44 × 44 px, separación fluida y área segura inferior. El tamaño raíz ampliado no ensancha los cinco controles hasta desbordarlos. |
| `src/components/footer/footer.css` | Enlaces que permiten nuevas filas, objetivos cómodos y espacio inferior para la navegación fija. |

Son 17 archivos de interfaz. Los cambios JSX de contacto son de marcado; los manejadores de envío, validación y CAPTCHA se conservan. Tampoco se modifica la lógica de App, Nav, Typewriter o Swiper en esta fase. Las etiquetas introductorias mantienen el texto existente para respetar la conservación del contenido.

## Pruebas y resultados

### Compilación y regresiones

- `npm.cmd run build`: **Compiled successfully**, salida 0. JavaScript 120.09 kB gzip; CSS 10.57 kB gzip. Sin advertencias de ESLint o Autoprefixer. Persiste únicamente el aviso previo de Browserslist/caniuse-lite; no se actualizan paquetes.
- `npm.cmd test -- --watchAll=false --runInBand`: **4 suites y 25 pruebas aprobadas**. Cubren navegación, inventario de proyectos/destinos/CV, contacto y enlaces compartidos.
- `node scripts/verify-design-system.cjs --phase-5`: 12 CSS, 74 tokens y 288 referencias; sin tokens ausentes, duplicados o cíclicos, ni fugas de selectores. Los 15 pares de contraste comprobados conservan sus umbrales.
- Detector de Impeccable con alcance `layout,type` sobre `src`: sin hallazgos. `git diff --check`: sin errores. El detector complementa la revisión visual; no acredita por sí solo el diseño.

### Chrome y revisión visual

`node scripts/verify-navigation.cjs --layout`: **33 comprobaciones aprobadas**, con 11 anchos principales y 11 escenarios adicionales. Motor: Chrome headless instalado. Cero excepciones JavaScript no controladas.

| Ancho CSS | Archivo de proyectos | Destacados | Servicios | Contacto |
|---|---:|---:|---:|---:|
| 320, 360, 390, 600, 601 | 1 columna | 1 | 1 | 1 |
| 768 | 2 | 1 | 2 | 1 |
| 1024, 1025 | 3 | 2 | 2 | 2 |
| 1280, 1440, 1920 | 3 | 2 | 3 | 2 |

Se verifica que el ancho desplazable coincide con el ancho útil en todos los escenarios, sin ocultación horizontal global. La diferencia de 15 px entre viewport y ancho útil corresponde a la barra de desplazamiento de Chrome.

Casos adicionales:

- Ventanas 568×320, 667×375, 844×390 y 1024×600.
- Reflujo equivalente a zoom 200% y 400% desde 1280×900: viewports CSS 640×450 y 320×225. Esto comprueba adaptación a espacio reducido; no simula todos los efectos del zoom nativo.
- Texto raíz al 200% en 320, 768 y 1440 px. Los botones crecen y el CV puede desplazarse por encima de la navegación fija. GitHub/LinkedIn y el CV permiten colocar el icono en una fila adicional.
- Fuentes de respaldo forzadas en 320 y 768 px, sin desbordamientos. La ejecución normal confirma Poppins y Geologica cargadas desde sus dominios existentes.
- Las tres frases completas del título animado se miden en 600, 601, 768, 1024 y 1440 px. Un título de proyecto largo sin espacios tampoco desborda.
- Se mantienen los recuentos de proyectos y avisos, y las acciones del archivo se alinean al final de cada fila.
- Se repiten navegación por anclas, historial, foco por teclado, enlace de salto, toque sintetizado, contraste/estados compartidos y contacto simulado. El árbol accesible contiene un único main y los 38 enlaces visibles tienen nombre.

La prueba de texto ampliado detectó un desbordamiento de 4 px en el contenido interno de un destacado. Se corrigió con una pista explícita `minmax(0, 1fr)`; la ejecución final confirma su resolución.

Se inspeccionaron capturas de encabezado, destacados, archivo, servicios, presentación, testimonios y contacto en escritorio, tablet y móvil, además de texto ampliado y ventana baja. Los temporizadores siguen activos; algunas capturas del encabezado muestran una frase parcialmente escrita. La medición de frases completas es síncrona e independiente de ese momento de captura.

Evidencia: [browser-results.json](browser-results.json), [system-checks.json](system-checks.json) y PNG de esta carpeta.

## Integridad y límites

`node scripts/verify-phase5-integrity.cjs`: comparación SHA-256 de 92 archivos contra la referencia persistida de Fase 1. Los 66 archivos protegidos coinciden, incluidos datos, imágenes, PDF/CV, paquetes y otros recursos públicos. Sin eliminaciones ni modificaciones acumuladas fuera de los archivos previstos en las fases implementadas. La prueba de inventario confirma los destinos y funcionalidades conservados.

La instantánea del comienzo de Fase 5 estaba en memoria y se perdió durante el reinicio de la sesión. Por ello, la comparación documentada es acumulativa contra Fase 1, no una comparación exacta entre el principio y el final de Fase 5. Se deja una instantánea persistente de los 100 archivos actuales para la siguiente fase: [source-hashes.json](source-hashes.json). Detalle: [integrity-results.json](integrity-results.json).

Los scripts `verify-navigation.cjs` y `verify-design-system.cjs` incorporan el modo de esta fase. Se agregan `verify-layout-browser.cjs` y `verify-phase5-integrity.cjs`. Se conserva la evidencia de las fases anteriores.

EmailJS se intercepta localmente y CAPTCHA se simula; no se envían mensajes reales. La configuración remota de EmailJS/Reply-To y la integración real de CAPTCHA siguen sin acreditarse. No se probaron dispositivos físicos ni otros motores de navegador. Las comprobaciones de contraste no equivalen a una certificación WCAG integral.

No se hicieron commits, instalaciones ni despliegues. Se mantienen los cambios previos del usuario. Las cifras existentes de +4 años en encabezado y +5 en presentación permanecen pendientes de confirmación editorial. Movimiento, optimización, botones de demo personalizados y SEO conservan sus fases correspondientes.

La Fase 6 requiere autorización del usuario.
