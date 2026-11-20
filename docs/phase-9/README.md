# Fase 9 — SEO técnico y posicionamiento orgánico para México

Implementación local para David Molina, desarrollador Full Stack bajo la marca DMS. Dominio canónico: **https://dm-series.com/**. Esta fase conserva las mejoras y el alcance de las ocho anteriores.

## Resultado

La compilación entrega el contenido del portafolio dentro del HTML inicial, generado desde los mismos componentes React que se activan en el navegador mediante hidratación. Los 23 proyectos, enlaces de demo, servicios, testimonios, navegación y alternativas de contacto se pueden descubrir sin esperar la ejecución de la aplicación.

La página se orienta a desarrollo de software a medida, sistemas web y soluciones empresariales para empresas en México. No se añadieron direcciones, oficinas, premios, calificaciones ni cifras de experiencia no confirmadas. Los datos estructurados no incorporan detalles de proyectos confidenciales.

## Cambios de esta fase

| Archivo | Cambio y propósito |
| --- | --- |
| `public/index.html` | Título y descripción con identidad y mercado confirmados; `lang="es-MX"`, canonical HTTPS, directivas de indexación, color del navegador, Open Graph y Twitter coherentes. Retira la identificación incorrecta de «agencia» y la etiqueta keywords. Añade JSON-LD `WebSite`, `WebPage`, `Person` y tres `Service`, con proveedor David Molina, marca DMS y mercado México. Incluye aviso para navegación sin JavaScript. |
| `public/robots.txt` | Permite rastreo y declara el sitemap del dominio oficial. |
| `public/sitemap.xml` | Contiene la única página React existente: la portada HTTPS. Los fragmentos de navegación y las URLs de proyectos no se convierten en páginas nuevas. Sin fechas de modificación inventadas. |
| `public/assets/dms-social.svg`, `dms-social.png` | Tarjeta social de 1200 × 630 con identidad DMS, Geologica, paleta existente y dominio. PNG de 37.360 bytes. Sustituye la referencia anterior a un archivo inexistente. SVG conservado como fuente editable; PNG como imagen para compartir. |
| `src/components/services/Services.jsx` | Añade una descripción visible de software a medida, sistemas web y soluciones empresariales para México. Usa la agrupación y los estilos existentes; mantiene las tres categorías y sus 15 elementos. |
| `package.json` | Corrige `homepage` a HTTPS y ejecuta el prerender después de la compilación habitual. Sin cambios en dependencias ni lockfile. |
| `scripts/prerender.cjs`, `prerender-asset-loader.cjs` | Generan HTML desde `App` con ReactDOMServer y las herramientas ya instaladas de CRA. Resuelven imágenes y CV contra el manifiesto real de la compilación. El archivo temporal de servidor se elimina al terminar; no requiere un servidor Node en producción. |
| `src/index.js` | Hidrata el HTML de producción con React 18; usa montaje normal si el contenedor está vacío en desarrollo. |
| `src/hooks/useMediaQuery.js` | Usa `useSyncExternalStore` con una instantánea de servidor estable y escucha las preferencias reales del navegador al hidratar. Mantiene limpieza de listeners y compatibilidad con el API anterior. |
| `src/components/Typewriter.jsx` | Evita acceder a `document` durante la generación del HTML. Conserva frases, pausas y preferencias de movimiento. |
| `src/components/contact/Contact.jsx` | Estado inicial de CAPTCHA compatible con servidor y cliente; conserva la carga diferida y el fallback sin IntersectionObserver. El botón de envío se habilita cuando React está listo, evitando envío nativo del formulario antes de su activación. Validación, manejadores, configuración de EmailJS y CAPTCHA, errores y recuperación preservados. |
| `src/data/data.jsx` | Hace únicos los identificadores y referencias internas de cinco definiciones SVG mediante `React.useId`. Corrige colisiones encontradas al validar el HTML completo. El inventario y contenido de proyectos permanecen idénticos. |
| `scripts/verify-seo.cjs`, `verify-seo-browser.cjs` | Validación del HTML sin ejecutar la aplicación, metadatos, JSON-LD, sitemap, recursos, SVG, navegación sin JS e hidratación conservando nodos existentes. |
| `scripts/verify-navigation.cjs`, `verify-design-system.cjs` | Añaden el destino de evidencias de Fase 9 y las comprobaciones SEO, manteniendo las regresiones de fases anteriores. El generador opcional `--render-social` produce el PNG con Chrome instalado; no forma parte del proceso habitual de compilación. |

**8 archivos existentes de aplicación/configuración modificados y 4 recursos públicos nuevos**, además de scripts y evidencias. Ningún archivo CSS cambia en esta fase: se reutiliza el sistema visual aprobado.

## Decisiones de SEO

- **Contenido real en HTML.** No se duplica texto para buscadores ni se serializa una sesión del navegador. El render proviene de React, sin ejecutar efectos, CAPTCHA o mensajes de usuarios. El cliente hidrata el mismo árbol. Google recomienda considerar prerender o servidor para que contenido y enlaces no dependan exclusivamente de la ejecución de JavaScript. [Google: fundamentos de SEO con JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- **Una URL canónica.** Metadatos, sitemap y `homepage` apuntan a la misma portada HTTPS. Los identificadores del JSON-LD representan entidades y no páginas nuevas. [Google: consolidación de URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- **México mediante contenido coherente.** El español y el mercado se expresan en texto visible y metadatos. `lang` también sirve a tecnologías de asistencia; no se presenta como garantía de posicionamiento geográfico. No existen otras versiones regionales o lingüísticas que requieran alternates. [Google: sitios multirregionales y multilingües](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).
- **Identidad profesional verificable.** Se usa una persona con la marca DMS, no una agencia o negocio con domicilio inventado. Los servicios describen los objetivos expresamente autorizados. El marcado es descriptivo; no se promete un resultado enriquecido específico.
- **Sin keywords artificiales.** Se retira `meta keywords`, que Google no usa para indexación o ranking. La intención comercial aparece de forma natural en la descripción y los servicios. [Google: metadatos compatibles](https://developers.google.com/search/docs/crawling-indexing/special-tags).
- **Rastreo sin promesas.** El sitemap facilita el descubrimiento, pero su disponibilidad o envío no garantiza indexación. [Google: crear y enviar sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Validación y evidencias

**Compilación correcta, 43 pruebas unitarias en 7 suites, 71 comprobaciones de Chrome y los 5 grupos de SEO estático aprobados.** Chrome verificó 11 anchos de 320 a 1920 px, además de ventanas bajas, reflujo y texto ampliado. Sin excepciones de página ni errores de hidratación; el nodo `main` inicial se conserva. Poppins y Geologica cargadas realmente. Las capturas de servicios a 320 y 1440 px, la portada sin JavaScript a 390 px y la tarjeta social se revisaron visualmente.

La salida final conserva CSS en **9,56 kB gzip**; JS queda en **122,69 kB gzip**, aproximadamente 190 bytes más que en Fase 8. El HTML completo ocupa 150.436 bytes sin comprimir y 21.267 bytes al calcular gzip localmente. Esto último es una medición del archivo, no una comprobación de compresión habilitada en el hosting ni una nueva medición de Core Web Vitals.

Los resultados automatizados completos quedan en esta carpeta:

- `seo-results.json`: cinco grupos de verificaciones sobre el HTML de producción, sin ejecutar JavaScript; incluye metadatos únicos, imagen PNG real, entidades, contenido, enlaces, recursos, IDs y referencias SVG, robots y sitemap XML.
- `browser-results.json`: navegación sin JavaScript, seguridad del envío antes de hidratar, conservación del nodo `main` original al hidratar, ausencia de contenido/IDs duplicados, metadatos estables y HTTP local; más las regresiones de navegación, responsive, teclado, contacto, movimiento, recursos y las 23 demos.
- `unit-tests.json`: resultados de las siete suites existentes de React/Jest.
- `system-checks.json`: tokens, estilos compartidos y contrastes semánticos.
- `integrity-results.json`: comparación SHA-256 de los 182 archivos conservados desde Fase 8. Protege 174 sin cambios; admite solamente los ocho cambios declarados y cuatro recursos nuevos. Reconstruye exactamente el componente Contact previo al revertir los ajustes de hidratación; también reconstruye `data.jsx` al revertir únicamente el namespace de SVG.
- `before-source-hashes.json`, `source-hashes.json`: referencias antes y después. Las evidencias de fases anteriores no se sobrescriben.
- Capturas de la versión sin JavaScript y de las regresiones móviles, tablet y escritorio.

Comandos reproducibles desde el proyecto, con las dependencias ya existentes:

```text
npm run build
npm test -- --watchAll=false --runInBand
node scripts/verify-seo.cjs
node scripts/verify-navigation.cjs --seo
node scripts/verify-design-system.cjs --phase-9
node scripts/verify-phase9-integrity.cjs
git diff --check
```

`npm run build` es el comando que genera la versión completa. Ejecutar directamente `react-scripts build` omite el paso de HTML generado.

## Publicación y seguimiento orgánico

La implementación se entrega localmente; no se publicó ni se realizaron operaciones en Search Console.

1. Publicar el contenido completo de `build/` en el hosting del dominio, siguiendo su procedimiento habitual. Conservar `/threejs/` y los recursos o aplicaciones existentes fuera de esta compilación; no reemplazar indiscriminadamente la raíz del servidor.
2. Verificar en producción HTTP 200 para `/`, `/robots.txt`, `/sitemap.xml`, la imagen social, CSS, JS, CV y variantes de imágenes. Comprobar en «Ver código fuente» que aparecen los proyectos; revisar `Content-Type` y ausencia de `X-Robots-Tag: noindex` o restricciones del hosting.
3. Comprobar que HTTP, variantes `www` y `/index.html`, si están disponibles, consolidan a `https://dm-series.com/` mediante las redirecciones apropiadas del hosting. Validar certificados y evitar cadenas o bucles. La configuración de ese servidor no está en este repositorio; no se añadió un `.htaccess` que pudiera afectar integraciones o `/threejs/`.
4. Confirmar que URLs inexistentes y archivos ausentes responden 404 reales en el hosting. El servidor de pruebas lo verifica localmente; no certifica el comportamiento de producción. No configurar un fallback universal a HTTP 200 para este sitio de una página con navegación por fragmentos.
5. En la propiedad verificada de Search Console, inspeccionar la portada, ejecutar la prueba en vivo, revisar el HTML procesado y solicitar indexación. Enviar `https://dm-series.com/sitemap.xml` y comprobar su lectura. Requiere acceso de propietario o usuario con permisos y el sitio ya publicado. [Google: solicitar nuevo rastreo](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
6. Revisar en el informe de rendimiento, filtrando país México: consultas relacionadas con software a medida, sistemas web y soluciones empresariales, impresiones, clics y CTR. Comparar periodos de 28 días cuando haya datos suficientes; el rastreo y el posicionamiento no son inmediatos ni garantizados.
7. Como trabajo editorial posterior, ampliar casos públicos con problema, solución y resultados confirmados, conservando confidencialidad y autorizaciones. Valorar páginas de servicio o artículos únicamente con contenido propio suficiente y una aprobación de nuevas rutas; no se crean en esta fase.

## Límites y pendientes

- Se conserva la discrepancia previa entre **+4 años** en Header y **+5 años** en About, pendiente de confirmación del titular. Ninguna cifra se incorpora a los nuevos metadatos, tarjeta social o JSON-LD.
- Las pruebas de contacto interceptan EmailJS y simulan CAPTCHA; no se enviaron mensajes reales. La configuración remota del proveedor requiere su propia validación.
- Chrome se prueba con viewports emulados y entrada de teclado/touch sintetizada; no sustituye pruebas en dispositivos físicos. Las fuentes reales se permiten y su carga queda registrada.
- La validación local de JSON-LD comprueba sintaxis, entidades y coherencia con el contenido. No equivale a una certificación externa de Google, indexación, ranking, resultados enriquecidos o Core Web Vitals de usuarios reales.
- La compilación mantiene el aviso previo de Browserslist/caniuse-lite desactualizado. No se instalaron ni actualizaron dependencias en esta fase.
- No se realizaron despliegues, commits, instalaciones ni cambios en DNS, hosting o cuentas externas.
