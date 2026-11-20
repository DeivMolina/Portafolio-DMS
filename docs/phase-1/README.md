# Fase 1 — Referencia técnica e inventario

Estado: comprobaciones técnicas completadas. Revisión visual en navegador pendiente.

Esta fase no modifica componentes, estilos, contenido, rutas ni lógica. No instala dependencias, realiza commits, publica ni envía mensajes. La compilación regenera `build/`, directorio ignorado por Git. Los únicos archivos nuevos deliberados son este informe y `baseline.json`.

## Requisitos confirmados para las fases posteriores

- David Molina, desarrollador Full Stack, bajo la marca DMS.
- Mercado: México. Dominio oficial: https://dm-series.com/.
- Posicionamiento deseado: desarrollo de software a medida, desarrollo de sistemas web y soluciones empresariales.
- Diseño moderno, minimalista, elegante y profesional; menos es más.
- Conservar todos los proyectos, servicios, enlaces, contenidos, CV, funcionalidades e integraciones.
- Mantener confidenciales los proyectos señalados; no agregar material sensible.
- Incorporar más adelante botones “Solicitar demo” hacia WhatsApp +52 55 4061 3200, con mensajes específicos de cada proyecto y únicamente información pública.
- Añadir Fase 9 de SEO técnico y posicionamiento orgánico para México, después de las ocho fases originales. Contemplará coherencia de dominio HTTPS e identidad, metadatos y canonical, rastreo/sitemap/robots, renderizado e indexabilidad de la SPA, datos estructurados verificables y medición orgánica. No se implementa en esta fase.
- No se confirma una cifra nueva de años de experiencia; persiste la discrepancia entre +4 y +5 del contenido existente.

## Estado inicial de Git

- Rama: `main`, con seguimiento local de `origin/main`. No se ejecutó fetch.
- Último commit local: `81f18ad` — Ajustes.
- Cambios previos preservados: `src/components/about/About.jsx` cambia +4 a +5 años; `src/data/data.jsx` elimina dos imports no utilizados.
- Directorios previos sin seguimiento: `.agents/`, `.claude/` y `.codex/`.
- Git no está disponible en PATH; se utilizó `C:\\Program Files\\Git\\cmd\\git.exe`.
- Git detectó diferente propietario. La consulta utilizó `-c safe.directory=C:/xampp/htdocs/Portafolio-DMS` por comando y `--no-optional-locks`; no se cambió configuración global ni se creó un commit.

## Estructura y funcionamiento

- React 18.2.0 con Create React App / react-scripts 5.0.1.
- Node 18.18.0; npm 9.8.1.
- Entrada: `src/index.js`; composición: `src/App.jsx`; estilos base: `src/index.css`.
- SPA sin React Router. El recorrido principal utiliza anclas.
- Orden renderizado: Header → Nav → PortfolioFeatures → Portfolio → Services → About → Testimonial → Contact → Footer.
- Componentes presentes pero no renderizados: Experience, CTA y HeaderSocials.
- Recursos importados en `src/assets/` y públicos en `public/assets/`.
- Archivos auxiliares conservados fuera del árbol de la app: `correo.html` y `firmas/deivid_molina.html`.
- 23 proyectos: 4 destacados y 19 adicionales. 3 destacados están marcados como confidenciales.
- 3 categorías de servicios: UI/UX Desing, Web Development y Creacion de Contenido. Los nombres se registran tal como existen.
- 4 testimonios en carrusel Swiper con paginación.
- Encabezado con retrato, disponibilidad, escritura animada en escritorio y título estático en móvil.
- Contacto por correo directo, WhatsApp y formulario EmailJS protegido mediante reCAPTCHA; alertas SweetAlert2.
- CV activo: `src/assets/cv.pdf`, 116284 bytes; firma PDF válida. Se conservan las otras copias y el CV de 2023.
- React Icons para iconografía. No se instalaron ni actualizaron paquetes.

## Inventario de proyectos y destinos

Los destinos se registran desde el código; no se comprobó su disponibilidad remota. No se agregan descripciones ni material confidencial.

| # | Grupo | Proyecto | Marcado confidencial | Demo existente |
|---|---|---|---|---|
| 1 | otros | CREM - Sistema Web | No | https://crem.panduitlatam.com |
| 2 | otros | Ralte - Sitio Web | No | https://front-ralte.rkcreativo.com.mx |
| 3 | otros | Conecta y Crece - Sitio Web | No | https://conectaycrece.com.mx |
| 4 | otros | Adqusiciones & Pasivos - Sitio Web | No | https://adquisicionesypasivosgws.com.mx/ |
| 5 | otros | TechComp - Sitio Web | No | https://rkcreativo.com.mx/techcomp-promociones/# |
| 6 | otros | ECHE - Sitio Web | No | https://eche.com.mx |
| 7 | otros | BeFocused - Sitio Web | No | https://befocused.panduitlatam.com |
| 8 | otros | ASGL & ASOC - Sitio Web | No | https://asglasociados.com.mx |
| 9 | otros | Hydra Consultores - Sitio Web | No | https://hydraconsultores.com.mx |
| 10 | otros | Grupo Inders <E-commerce /> | No | https://inders.com.mx |
| 11 | otros | INAP - Sitio Web | No | https://inap.mx |
| 12 | otros | Caña de Oro - Sitio Web | No | https://canadeoro.com.mx |
| 13 | otros | DESPACHO ATM - Sitio Web | No | Sin enlace activo |
| 14 | otros | Molina Consultores - Sitio Web | No | Sin enlace activo |
| 15 | otros | Planilla Dorada - Sitio Web | No | Sin enlace activo |
| 16 | otros | Alearth <E-Commerce /> | No | Sin enlace activo |
| 17 | otros | Law Soluciones Legales - Sitio Web | No | Sin enlace activo |
| 18 | otros | Bliblioteca UTN <Sistema de Inventario /> | No | Sin enlace activo |
| 19 | otros | Reach QR <Sistema In:Out /> | No | Sin enlace activo |
| 20 | destacados | App Techcomp | Sí | Sin enlace activo |
| 21 | destacados | Plataformas E-learning | Sí | https://core.panduitlatam.com/ |
| 22 | destacados | App Multiplataforma CRM | Sí | Sin enlace activo |
| 23 | destacados | Proyecto Airplane 3D | No | https://dm-series.com/threejs/ |

Todos los archivos de imagen de estos 23 proyectos existen. Los campos de repositorio de proyectos están vacíos, por lo que no se renderizan botones GitHub para esas tarjetas. El GitHub personal sí está enlazado.

## Navegación y enlaces generales

| Uso | Destino |
|---|---|
| Inicio | `#` |
| Proyectos | `#portfolio` (duplicado en dos secciones) |
| Servicios | `#services` |
| Sobre mí | `#about` |
| Testimonios | `#testimonials` |
| Contacto | `#contact` |
| Experiencia en el pie | `#experience` (componente no montado) |
| Correo | `mailto:davidglezm2015@gmail.com` |
| WhatsApp actual | `https://api.whatsapp.com//send?phone=5540613200` |
| GitHub | `https://github.com/DeivMolina` |
| LinkedIn activo | `https://www.linkedin.com/in/deivid-molina-917797326/` |
| Facebook | `https://www.facebook.com/profile.php?id=100005001045548` |
| Instagram | `https://www.instagram.com/deivid_molina_gz/` |
| Twitter | `https://twitter.com/DeividMolina19` |

`HeaderSocials.jsx`, no montado, conserva un LinkedIn distinto: `https://www.linkedin.com/in/david-m-35957712a/`. `baseline.json` registra también enlaces de componentes inactivos para evitar confundirlos con el recorrido publicado.

## Compilación de referencia

Comando: `npm.cmd run build`.

Resultado: exit code 0, **Compiled with warnings**.

La primera ejecución aislada recibió EPERM al resolver el temporal del usuario. Se solicitó y obtuvo aprobación para repetirla fuera del aislamiento; la segunda ejecución terminó correctamente.

| Recurso | Tamaño gzip informado |
|---|---|
| JavaScript principal | 115.55 kB |
| CSS principal | 9.44 kB |

Entradas generadas: `static/js/main.e27f21ec.js` y `static/css/main.5a3357b6.css`.

Los archivos del manifiesto existen y las cuatro imágenes públicas de los destacados están presentes en `build/assets/`. La aplicación se compiló para la raíz `/`; no se desplegó.

Advertencias ESLint: 11 en total.
- 4 imports sin uso: Experience, BsGithub, BsWhatsapp y BiUserCircle.
- 1 texto alternativo redundante en About.
- 3 enlaces con target blank sin rel adecuado en Contact y Header.
- 3 enlaces de inicio con href “#” señalados por anchor-is-valid en Footer y Nav.

Browserslist avisa que caniuse-lite está desactualizado. No se ejecutó la actualización sugerida para conservar las dependencias.

## Comprobaciones realizadas

- Lectura y análisis AST de los componentes y los datos, sin ejecutar sus integraciones.
- Inventario de 23 proyectos, destinos, confidencialidad declarada e imágenes; todos esos recursos gráficos existen.
- Validación de firma y existencia del PDF del CV.
- Compilación de producción y verificación de archivos del asset-manifest.
- Tres escenarios del handler sendEmail ejecutados en memoria con EmailJS, SweetAlert2 y formulario simulados: sin CAPTCHA no se envía; éxito muestra confirmación y reinicia; error conserva el formulario y muestra aviso. Los tres pasan.
- Estas simulaciones prueban las ramas del handler, no la entrega de correo, el servicio remoto, el widget ni el mapeo real de la plantilla.
- No se encontraron archivos test/spec en src.
- Comparación SHA-256 de 92 archivos antes y después de compilar: 0 cambios y 0 eliminaciones. Incluye src, public, package.json, package-lock.json y .gitignore.

## Problemas registrados, sin corregir

- id portfolio duplicado; destino experience sin sección montada.
- WhatsApp sin prefijo internacional en la URL.
- Nombres email/phone intercambiados en el formulario; requiere validar la plantilla.
- Identidad visible FrontEnd Jr y metadatos de agencia, pendientes de alineación con David Molina Full Stack / DMS.
- homepage usa HTTP aunque el dominio confirmado es HTTPS.
- Open Graph y Twitter apuntan a /assets/logo_dms_azul.png; localmente solo existe logo_dms_azul.png.png. No se afirma un 404 remoto.
- E-learning conserva preview activo pese a estar marcado confidencial. Se registra la discrepancia sin cambiar el enlace ni revelar información adicional.
- Permanecen los problemas de responsive, foco, zoom, contraste, tokens, movimiento y peso de imágenes de la auditoría previa.

## Límites y siguiente paso

No hay navegador de inspección disponible: no se generaron capturas ni se validaron tamaños renderizados, gestos, foco real, tiempos de carga o accesibilidad con lector de pantalla. No se comprobaron respuestas HTTP remotas ni posicionamiento/indexación en Google. No se realizaron envíos reales ni se resolvió reCAPTCHA.

La referencia técnica queda establecida; la referencia visual queda pendiente. No se avanzó a Fase 2. Se requiere autorización del usuario para continuar.

