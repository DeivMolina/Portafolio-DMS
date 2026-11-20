# Composición y tipografía de DMS

Este documento amplía el [sistema visual de Fase 4](../phase-4/DESIGN-SYSTEM.md). La paleta y las familias Poppins/Geologica se mantienen. La fuente normativa de dimensiones es `src/styles/tokens.css`.

## Recorrido y jerarquía

El recorrido conserva el orden del DOM: presentación, destacados, archivo de proyectos, servicios, presentación personal, testimonios y contacto. El encabezado identifica a David Molina como desarrollador Full Stack y ofrece una acción principal hacia el contacto; GitHub, LinkedIn y el CV siguen disponibles.

Los proyectos destacados tienen más espacio y dos columnas cuando su contenido cabe. El archivo usa tarjetas equivalentes, imágenes completas y acciones alineadas por fila. Los textos de confidencialidad conservan contenido y visibilidad.

## Reglas compartidas

| Rol | Regla |
|---|---|
| Contenedor general | Máximo 72rem; margen lateral fluido de 1rem a 2rem. |
| Separación de secciones | De 3rem a 6rem, mediante `--section-gap`. |
| Título y contenido | De 1.5rem a 2.5rem, mediante `--section-heading-gap`. |
| Relleno de tarjetas | De 1rem a 1.5rem, con una sola capa de relleno. |
| Título principal | Geologica, de 2rem a 3rem; interlineado 1.25 y ajuste de líneas. |
| Títulos de sección | Geologica, de 1.5rem a 2rem. |
| Proyectos destacados | Geologica, de 1.25rem a 1.75rem. |
| Texto principal | Poppins, 1rem; biografía y reseñas con interlineado 1.75. |
| Medida de lectura | Biografía y descripciones hasta 65ch; reseñas hasta 62ch. |
| Miniaturas | Marco 16:10 y `object-fit: contain`; se conserva el recurso original completo. |
| Contacto | Contenedor de hasta 60rem, con formulario y alternativas agrupadas. |
| Testimonios | Contenedor de hasta 48rem, sin estrechamiento adicional del párrafo. |

El encabezado tiene altura automática. El título animado reserva dos líneas mínimas y puede crecer; el cursor mide una línea de texto. Los temporizadores existentes no cambian. Los botones permiten salto de línea y los iconos pueden pasar a otra fila si el texto ampliado requiere espacio.

## Adaptación

- Archivo: `auto-fit`, con mínimo de tarjeta de 18rem limitado al 100% disponible.
- Servicios: `auto-fit`, con mínimo de 19rem limitado al ancho disponible.
- Destacados: una columna hasta 56rem, dos por encima.
- Sobre mí: una columna hasta 60rem; fotografía y texto separados en escritorio. Las métricas se adaptan a su contenedor; hasta 38rem forman una sola columna.
- Contacto: formulario debajo de las alternativas hasta 52rem. Las alternativas ocupan dos columnas en tablet y una hasta 34rem.
- Navegación: cinco controles de icono de al menos 44 × 44 px, sin depender del tamaño raíz del texto. Los iconos tienen nombre accesible; el zoom de página puede ampliarlos. Se reserva espacio inferior para la barra y el área segura.

No se reordena contenido con CSS. Las pistas `minmax(0, ...)` y los mínimos de tamaño evitan que títulos o controles impongan anchos mayores que sus contenedores. No se usa ocultación horizontal global para encubrir desbordamientos.

## Continuidad

Las animaciones, el carrusel, los datos, las rutas y los manejadores del formulario conservan su funcionamiento. La revisión de movimiento, optimización de recursos, edición de contenido y SEO permanece en las fases correspondientes.
