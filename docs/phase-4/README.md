# Fase 4 — Sistema visual y componentes compartidos

Estado: implementada y validada localmente. No se ha avanzado a la Fase 5.

## Resultado

Se consolidan los estilos en una fuente de tokens y una base de controles compartida. Se mantiene la identidad oscura y azul de DMS, con superficies más discretas, texto de mayor contraste y componentes consistentes.

No se cambia el contenido factual, los proyectos, los servicios, los testimonios, los destinos, las descargas ni las integraciones. No se agregan dependencias ni se cambia la estructura de App o la lógica de navegación.

El contrato de uso está en [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). Los valores normativos están en src/styles/tokens.css y las reglas compartidas en src/styles/primitives.css.

## Implementación

| Área | Archivos y cambios |
|---|---|
| Tokens | Nuevo src/styles/tokens.css: 64 propiedades para colores semánticos, tipografía, espacios, radios, tamaños de controles, foco y transiciones. |
| Estilos base | Nuevo src/styles/primitives.css: botones, campos, etiquetas y utilidades tipográficas. src/index.css importa los tokens y la base, y conserva las reglas generales de accesibilidad. |
| Enlaces de acción | Nuevo src/components/ui/ActionLink.jsx, utilizado en Header, Portfolio, About y CTA. Conserva href, target, download y atributos nativos; combina rel seguro para target blank. |
| Campos | Nuevo src/components/ui/FormField.jsx, utilizado en los cuatro campos de Contact. Mantiene los controles nativos y todos sus atributos, eventos y nombres. |
| Encabezado | Header.jsx, Typewriter.jsx y header.css eliminan las clases de utilidades sin implementación y consumen clases y tokens reales. No se cambia el texto ni los temporizadores. |
| Proyectos | Portfolio.jsx y portfolio.css migran acciones al componente común y consolidan las etiquetas de tecnología. Se conservan todos los iconos, nombres, imágenes, descripciones y enlaces. |
| Presentación | About.jsx y about.css consumen la base común. Ajuste local del relleno y ancho mínimo de las tarjetas para conservar la legibilidad a 320 px. |
| Servicios | Services.jsx y services.css eliminan colores en línea, usan la superficie y radio comunes y fijan el tamaño de iconos para evitar que se compriman. |
| Testimonios | Testimonials.jsx y testimonials.css utilizan los roles comunes de texto, superficie y radios. El carrusel y sus datos no cambian. |
| Contacto | Contact.jsx y contact.css reutilizan FormField y los controles comunes. La validación, el envío, los mensajes, WhatsApp y CAPTCHA conservan su lógica de Fase 3. |
| Navegación | nav.css consume tokens de superficie y controles; Nav.jsx no cambia. |
| Pie | Footer.jsx recibe una clase propia. footer.css queda acotado al pie y usa texto blanco legible sobre el azul de DMS. |
| Componentes inactivos | CTA migra sus enlaces; experience.css consume los mismos tokens. No se montan componentes ni se agregan rutas. |
| Fuentes | public/index.html retira la solicitud sin uso de Barlow/Fira Sans. Las familias existentes Poppins y Geologica se solicitan desde un único punto en index.css. |

Se eliminan las referencias a los colores secundarios inexistentes y la redefinición global de btn-primary en portfolio.css. Las reglas de botones se mantienen únicamente en primitives.css; los ajustes locales restantes son de colocación.

Los valores aislados de componentes se alinean con la escala compartida. Se conservan los anchos de contenedores, número de columnas y puntos de cambio existentes para abordar su revisión integral en Fase 5.

## Pruebas automatizadas

Comando: npm.cmd test -- --watchAll=false --runInBand.

Resultado: **4 suites y 25 pruebas aprobadas**.

- Las 23 pruebas de navegación, contacto e inventario permanecen aprobadas.
- Dos pruebas nuevas de ActionLink verifican descargas, destinos, rel seguro y anclas nativas.
- Se conservan los 23 proyectos, las demos, los enlaces externos y el CV.
- El envío conserva su mapeo y las ramas de validación, éxito, error, CAPTCHA, reintento y bloqueo de duplicados.

## Comprobación estática del sistema

Comando: node scripts/verify-design-system.cjs.

Resultado:
- 12 archivos CSS analizados.
- 64 tokens y 297 referencias.
- Cero tokens ausentes, repetidos o cíclicos.
- Cero sustituciones numéricas inválidas.
- Cero selectores de componentes filtrados a elementos HTML globales.
- Una única base global de botones.
- 15 combinaciones de contraste verificadas: texto normal supera 4,5:1 y bordes de campos superan 3:1.

Los contrastes se calculan con colores planos de los tokens; no equivalen a certificar WCAG en todo el sitio.

## Chrome y revisión visual

Comando: node scripts/verify-navigation.cjs --design.

Resultado: **26 comprobaciones de comportamiento aprobadas**:
- 12 regresiones de navegación.
- 8 de contacto simulado.
- 6 del sistema visual.

Anchos emulados: 320, 390, 768 y 1440 px.

Se comprueba:
- Familia CSS de cuerpo Poppins y títulos Geologica.
- Controles compartidos de al menos 44 px y radio de 8 px.
- Colores primarios coherentes en Header, Portfolio, About y Contact.
- Hover y active mediante pseudoclases forzadas de Chrome.
- Foco real por teclado sobre el enlace de acción, con contorno sólido de 3 px.
- Estado deshabilitado y campo nativo enfocable.
- 31 tarjetas con superficie y radio compartidos de 16 px.
- 21 etiquetas de tecnología con presentación común y texto de 14 px.
- Tarjetas de experiencia sin desbordamiento de texto a 320 y 390 px.
- Cero excepciones JavaScript no controladas.

Se inspeccionaron capturas del encabezado en los cuatro anchos y de proyectos, servicios, presentación, testimonios y contacto. Se añadieron capturas específicas de las tarjetas en pantallas pequeñas.

La corrección local de las tarjetas dejó scrollWidth igual al ancho de contenido disponible en el caso de 320 px (305 px más scrollbar). Esto no acredita todo el responsive: permanecen pendientes la revisión integral del encabezado, proporciones, altura, columnas y ritmo en Fase 5. Las palabras y el texto siguen estrechos en algunas tarjetas pequeñas.

Limitaciones: fuentes externas bloqueadas durante la prueba, por lo que no se verifica la descarga y renderización real de esas fuentes; se usa un CAPTCHA simulado identificado y respuestas de EmailJS interceptadas. No se enviaron mensajes reales ni se probaron dispositivos físicos. La configuración remota de EmailJS/Reply-To sigue pendiente según el informe de Fase 3.

Evidencia: browser-results.json, system-checks.json y archivos PNG de esta carpeta.

## Compilación e integridad

npm.cmd run build: **Compiled successfully**, exit code 0, sin advertencias de ESLint.
- JavaScript: 120.07 kB gzip.
- CSS: 10.25 kB gzip.
- Persiste el aviso previo de Browserslist/caniuse-lite; no se actualizaron paquetes.
- git diff --check sin errores.
- Detector estático de Impeccable en estilos y componentes seleccionados: sin hallazgos.

Se compararon 95 archivos originales con SHA-256. Hay 20 modificaciones previstas y 5 archivos nuevos de código/pruebas. Cero eliminaciones y cero cambios en los archivos protegidos: datos, recursos originales, CV, package.json, package-lock.json, App.jsx, Nav.jsx y pruebas previas.

Los scripts de comprobación incorporan los modos y verificaciones de esta fase. Los informes y evidencias de fases anteriores se conservan.

No se hicieron commits ni despliegues. Los cambios previos del usuario se conservan. Detalle en integrity-results.json.

## Pendientes

La composición y el responsive integral se reservan para Fase 5. La animación del encabezado, optimización de recursos, corrección editorial y SEO permanecen en sus fases previstas. No se agregaron botones de demo por proyecto en esta fase.

La Fase 5 requiere autorización del usuario.
