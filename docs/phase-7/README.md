# Fase 7 — Rendimiento y recursos

Estado: implementada y validada localmente. La Fase 8 no se ha iniciado.

## Resultado

Se reduce el coste de las imágenes y se prioriza el contenido visible, conservando la composición de DMS, las familias tipográficas, los 23 proyectos, sus avisos de confidencialidad, servicios, testimonios, destinos, CV e integraciones.

Las 29 imágenes montadas sumaban **22.529.723 bytes** en sus archivos originales. Las mayores variantes de entrega suman **2.814.180 bytes**, un **87,5% menos**. Las variantes menores permiten ajustar la descarga al tamaño de pantalla y su densidad. Los originales no se sustituyen ni se eliminan.

En el ensayo móvil local, los bytes recibidos durante la ventana inicial bajan de una mediana de **1.426.346 a 546.481 bytes**, aproximadamente **61,7% menos**. Las solicitudes de imágenes pasan de 29 a 4. Esto no representa el peso total de todos los recursos del sitio ni una garantía de rendimiento en producción.

## Implementación y archivos

| Archivos | Resultado |
|---|---|
| `src/components/ui/OptimizedImage.jsx` | Nuevo componente picture/source: WebP responsivo, tamaños intrínsecos, decodificación asíncrona y selección nativa por ancho/DPR. Conserva las URL originales como fallback y las recupera si falla una variante. |
| `src/data/image-manifest.json`, `public/assets/optimized/` | Catálogo de 29 imágenes y 73 nuevos archivos de entrega: 72 variantes WebP y un póster JPEG. Generación sin recortes ni ampliaciones artificiales. |
| `src/components/header/Header.jsx`, `header.css` | Avatar optimizado con tamaño adaptable y carga inmediata prioritaria. La composición mantiene sus dimensiones. |
| `src/components/portfolio/Portfolio.jsx`, `portfolio.css` | Imágenes adaptables; primer destacado con carga inmediata y resto con loading lazy. Control de reproducción con foco visible y posibilidad de ajustar líneas al ampliar texto. |
| `src/components/ui/ProjectPreview.jsx` | El GIF conserva sus 12 fotogramas originales y se descarga al solicitar reproducción. Muestra inicialmente un póster estático; permite detenerlo y vuelve al póster al salir de pantalla, ocultar la pestaña o activar movimiento reducido. |
| `src/components/about/About.jsx`, `src/components/testimonials/Testimonials.jsx` | Retrato y avatares optimizados con carga diferida, sin cambiar contenido ni lógica del carrusel. |
| `src/components/contact/Contact.jsx`, `contact.css` | El widget CAPTCHA se prepara a 800 px de la pantalla o al enfocar su grupo, conservando el formulario completo desde el inicio. Se reservan 164 × 144 px para evitar que su aparición desplace el contenido. |
| `public/index.html`, `src/index.css` | Fuentes existentes solicitadas desde HTML con preconnect y cuatro pesos usados. Se elimina la cadena CSS import para fuentes, las dos hojas de iconos Flaticon sin consumidores, el SweetAlert CDN duplicado y el script CAPTCHA manual duplicado. SweetAlert sigue importado localmente y el wrapper instalado de reCAPTCHA conserva su carga automática. Se declara altura automática para imágenes con dimensiones intrínsecas. |
| `src/components/ui/ProjectPreview.test.jsx`, `src/components/contact/Contact.test.jsx` | Cuatro nuevas pruebas de medios/fallback y dos de carga diferida del widget. Las pruebas anteriores se conservan. |

Son **11 archivos existentes modificados**, **4 archivos nuevos de código/datos/pruebas** y **73 recursos derivados**. No se agregan dependencias de proyecto. Se utilizó Pillow 10.4 ya instalado para producir variantes WebP de calidad 90; no se generaron nuevas escenas o contenidos gráficos.

El tamaño en disco de la distribución incluye los originales y las variantes. La mejora se encuentra en lo que el navegador solicita y recibe; no se afirma una reducción equivalente del directorio build completo.

## Medición antes/después

Se midió la compilación de Fase 6 antes de cambiar recursos y después la compilación final de Fase 7. Mismo servidor HTTP local sin gzip y el mismo Chrome, documento nuevo, caché desactivada y ventana aproximada de ocho segundos por navegación. Se configuraron 1,6 Mbps, latencia de 150 ms y CPU 4× para tres ensayos móviles de 390 × 844 px; se presenta su mediana. También se ejecutó un ensayo de escritorio de 1440 × 1000 px a 10 Mbps/40 ms/CPU 1×.

Para aislar el coste local se bloqueó el tráfico externo, incluidas fuentes, y se simuló CAPTCHA. Las capturas de rendimiento muestran la fuente de respaldo; la pasada funcional posterior permitió Google Fonts y confirmó Poppins y Geologica cargadas.

| Métrica observada | Antes | Después |
|---|---:|---:|
| Móvil: bytes locales recibidos en la ventana | 1.426.346 | 546.481 |
| Móvil: bytes de imágenes recibidos | 993.988 | 102.794 |
| Móvil: solicitudes de imágenes | 29 | 4 |
| Móvil: FCP observado, mediana | 5.612 ms | 712 ms |
| Móvil: último candidato LCP de la ventana, mediana | 7.972 ms | 3.548 ms |
| Móvil: suma inicial de desplazamientos sin entrada reciente | 0 | 0 |
| Escritorio: bytes locales recibidos | 9.650.614 | 579.124 |
| Escritorio: último candidato LCP de la ventana | 600 ms, párrafo | 760 ms, imagen |

Los candidatos LCP cambian: después se presenta la imagen dentro de la ventana, mientras antes el candidato era texto. Los tiempos de referencia son variables y la ventana es limitada; los valores no son puntuaciones Lighthouse, resultados de Google ni Core Web Vitals de usuarios reales. La suma inicial de desplazamientos observada no sustituye el CLS de una sesión completa. INP de campo, FPS, consumo de energía y dispositivos físicos no se acreditan aquí.

Evidencia: [performance-before.json](performance-before.json), [performance-after.json](performance-after.json), [image-optimization.json](image-optimization.json) y capturas performance-before/after.

## Validación funcional y visual

- `npm.cmd test -- --watchAll=false --runInBand`: **6 suites y 38 pruebas aprobadas**. Incluyen inventario de proyectos/demos/enlaces/CV, navegación, envío, CAPTCHA, título animado, reproducción/detención y fallback de imágenes.
- `npm.cmd run build`: **Compiled successfully**, salida 0. JavaScript **122.45 kB gzip** y CSS **9.51 kB gzip**. El incremento pequeño de código incluye el catálogo y los controles de entrega; no se añadieron paquetes. Persiste solo el aviso previo de Browserslist/caniuse-lite.
- `node scripts/verify-navigation.cjs --optimize`: **57 comprobaciones aprobadas**, cero excepciones JavaScript no controladas. Se repiten las 47 de Fase 6 y se agregan 10 de recursos.
- Viewports: 320, 360, 390, 600, 601, 768, 1024, 1025, 1280, 1440 y 1920 px. Once escenarios adicionales cubren ventanas bajas, reflujo equivalente a zoom 200%/400%, texto al 200% y fuentes de respaldo. No hay desbordamiento horizontal en los casos medidos.
- Se verifica que las 29 imágenes tienen dimensiones y decodificación asíncrona, con dos imágenes eager y las demás lazy; las 19 del archivo se cargan al recorrerlo; todas seleccionan WebP y el avatar responde al DPR 2.
- Se comprueba que el GIF no se solicita durante la carga ni al recorrer el archivo. Enter reproduce el original, Espacio lo detiene y el foco queda visible dentro del marco. La preferencia reducida y salir de pantalla lo detienen. Una petición manual de reproducción sigue disponible aun con preferencia reducida; no hay autoplay.
- CAPTCHA no se monta en el primer viewport, pero los cuatro campos del formulario están presentes. Se prepara al acercarse al contacto y se repiten validación, bloqueo de duplicados, éxito, error y reintento con el SDK real y respuestas interceptadas.
- Se revisaron capturas del encabezado, destacados, archivo, servicios, presentación, testimonios, contacto y control del GIF en móvil, tablet y escritorio.
- `node scripts/verify-design-system.cjs --phase-7`: 12 CSS, 74 tokens y 319 referencias; cero referencias ausentes, duplicadas o cíclicas y 15 pares de contraste válidos. Impeccable type/layout y git diff --check terminan sin hallazgos.

Los scripts agregados son `optimize-images.py`, `verify-performance-browser.cjs`, `verify-resources-browser.cjs` y `verify-phase7-integrity.cjs`. Los runners de navegación y estilos incorporan modos de Fase 7; ya no esperan que las imágenes lazy fuera de pantalla estén descargadas para continuar, y sí esperan las visibles antes de las capturas funcionales. No se altera el producto para facilitar las pruebas.

## Integridad y continuidad

`node scripts/verify-phase7-integrity.cjs` compara los **102 archivos** persistidos al empezar la fase: 11 cambios previstos, 91 archivos existentes intactos y ninguna eliminación o modificación inesperada. Los originales gráficos, GIF, PDF/CV, datos de proyectos, paquetes y lógica de App/Nav/movimiento conservan su hash.

Además, al retirar únicamente la nueva envoltura de carga de Contact en memoria, el archivo recuperado coincide exactamente con su hash anterior. Esto verifica que se conservan el envío, manejadores, datos, claves, validación y contenidos previos del formulario.

Detalle: [integrity-results.json](integrity-results.json). La instantánea de cierre de 179 archivos está en [source-hashes.json](source-hashes.json).

No se enviaron mensajes reales: EmailJS se intercepta y CAPTCHA se simula. La configuración remota de estos servicios continúa sin acreditarse. El fallback sin WebP utiliza los originales estáticos o el póster JPEG del GIF; no se probaron todos los navegadores antiguos ni hardware físico.

No se modifican datos sensibles, métricas profesionales ni textos editoriales. Los botones de demo personalizados y el SEO técnico para México permanecen en sus fases correspondientes. No hubo instalaciones, commits ni despliegues. Se conservan las evidencias de fases anteriores.

La Fase 8 requiere autorización del usuario.
