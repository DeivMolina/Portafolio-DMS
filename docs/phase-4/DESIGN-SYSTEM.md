# Sistema visual DMS

Fuente de verdad: [tokens.css](../../src/styles/tokens.css) y [primitives.css](../../src/styles/primitives.css). Este documento describe el sistema implementado en Fase 4.

## Identidad y alcance

Interfaz oscura con acento azul, superficies discretas y controles legibles. La identidad profesional confirmada es David Molina, desarrollador Full Stack, bajo DMS, para México. Este sistema no reescribe el contenido ni añade afirmaciones o pruebas de trabajo.

La estructura de las páginas y su responsive completo se revisan en la Fase 5. Conservar los proyectos confidenciales y sus restricciones.

## Roles de color

| Rol | Token | Valor |
|---|---|---|
| Fondo | --color-bg | #0a0a28 |
| Tarjetas | --color-surface | #171735 |
| Superficie elevada y etiquetas | --color-surface-raised | #202047 |
| Acción principal | --color-primary | #4b59fb |
| Hover principal | --color-primary-hover | #3948df |
| Pulsación principal | --color-primary-active | #303dc5 |
| Texto sobre acciones | --color-on-primary | #ffffff |
| Texto principal | --color-text | #f5f5fc |
| Texto secundario | --color-text-light | #c6c6de |
| Enlaces y énfasis | --color-link | #b8beff |
| Borde de campos | --color-border | #7e88b8 |
| Borde de superficies | --color-border-subtle | #41416a |
| Disponibilidad | --color-availability | #51e4b8 |

Usar --color-link para texto de acento sobre fondos oscuros. El azul primario se reserva para superficies de acción con texto --color-on-primary. Los colores internos de logotipos y capturas son contenido y permanecen intactos.

--color-bg-variant y --color-light son alias de compatibilidad para los componentes existentes. No crear otra paleta en CSS local.

## Tipografía

- Cuerpo y controles: --font-body, Poppins con fallback sans-serif.
- Títulos: --font-display, Geologica con fallback sans-serif.
- Escala: 14, 15, 16, 20, 24, 32 y 40 px con raíz de 16 px.
- Texto de campo: 16 px; información secundaria: 14 o 15 px.
- Pesos: regular 400, medium 500, semibold 600.
- Alturas de línea: --line-body y --line-heading.

Las fuentes se solicitan únicamente desde index.css. No añadir clases de utilidades sin implementación ni fuentes adicionales para una sección aislada.

## Espacios y formas

La escala --space-* define 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 112 y 128 px.

- Controles: radio de 8 px y altura mínima de 44 px.
- Imágenes internas: radio de 12 px.
- Tarjetas: radio de 16 px.
- Radios completos: retratos, navegación y etiquetas pequeñas.
- Los insets de las tarjetas de experiencia admiten reducción local para no desbordar con el tamaño mínimo de texto.
- Las proporciones y columnas existentes no son reglas definitivas del sistema; pertenecen a la revisión de Fase 5.

## Componentes

### ActionLink

Ubicación: src/components/ui/ActionLink.jsx.

Enlace nativo para acciones repetidas. variant="primary" aplica la acción principal; el valor predeterminado secondary utiliza la base de borde y texto claros. Acepta href, target, download, className, rel y los demás atributos nativos.

No intercepta navegación ni descarga. Para target="_blank" agrega noopener/noreferrer sin eliminar restricciones ya proporcionadas.

Usar el botón nativo con className="btn btn-primary" para enviar formularios; no convertir una acción de envío en un enlace.

### FormField

Ubicación: src/components/ui/FormField.jsx.

Recibe id, label y atributos nativos. multiline selecciona textarea. Mantiene label/htmlFor y la semántica de validación del navegador. Puede recibir className para marcadores locales.

Los nombres name, email, phone y message del formulario son un contrato con la plantilla de correo; no cambiarlos al refinar apariencia. No trasladar la lógica de EmailJS o CAPTCHA al componente visual.

### Etiquetas y tarjetas

.tag define el estilo de tecnología, con .tag__icon para el icono decorativo. Los nombres e iconos permanecen como datos del proyecto; los identificadores tag-* se mantienen sin paletas particulares.

Las tarjetas comparten tokens de superficie, borde y radio. No se crea un componente genérico de tarjeta porque sus contenidos e intenciones son distintos.

## Estados y accesibilidad

- Default, hover y active de acciones en primitives.css.
- Foco visible global de 3 px, separado 4 px.
- Disabled: opacidad 0,65 y cursor progress, conservando el comportamiento nativo.
- Campos de solo lectura durante el envío, sin perder su inclusión en FormData.
- Los errores y resultados de contacto siguen accesibles en regiones persistentes.
- Respetar movimiento reducido para desplazamientos. Las animaciones existentes se revisarán en Fase 6.
- Las combinaciones semánticas de texto verificadas superan 4,5:1 en sus colores planos; esto no sustituye una auditoría completa.

## Reglas de mantenimiento

- Modificar los roles compartidos en tokens.css.
- Mantener la base de botones y campos en primitives.css.
- En CSS de componentes, limitarse a composición y detalles propios.
- No redefinir btn-primary ni aplicar estilos de componentes a header, footer, form o input sin clase.
- No incorporar estilos en línea para colores de UI.
- Mantener nombres, enlaces, datos, descargas e integraciones durante cambios visuales.
- Ejecutar las regresiones de navegación y contacto tras una migración de componentes.
