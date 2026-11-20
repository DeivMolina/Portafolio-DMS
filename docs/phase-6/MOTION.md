# Movimiento e interacción de DMS

La Fase 6 amplía el [sistema visual](../phase-4/DESIGN-SYSTEM.md) y las [reglas de composición](../phase-5/LAYOUT.md). Conserva colores, tipografías, contenido y orden de lectura.

## Criterio

El título es el único elemento con una secuencia automática propia. La escritura conserva las tres frases existentes y siempre ofrece un control para pausarla. El resto del movimiento explica una acción: presión sobre un botón, cambio de estado o selección manual de un testimonio.

La disponibilidad permanece visible sin pulsación. La fotografía mantiene su composición estática y los proyectos destacados no se desplazan al pasar el cursor. No hay entradas de secciones, parallax ni nuevas bibliotecas de animación.

## Contrato

| Elemento | Comportamiento normal | Alternativa reducida |
|---|---|---|
| Título | Presentación completa desde el primer render, seguida de escritura/borrado. Control «Pausar animación / Reanudar animación». | Presentación completa y estática, sin cursor ni control innecesario. También se usa por debajo de 600 px. |
| Pausa manual | Completa la frase actual y conserva esa frase hasta reanudar. | No se ejecuta la secuencia. |
| Visibilidad | Se suspende cuando el título queda fuera de pantalla o la pestaña se oculta. | No se programa ningún temporizador. |
| Botones compartidos | Color/borde y desplazamiento de presión de 1 px durante 150 ms. | Se conserva la respuesta de color/borde, sin desplazamiento. |
| Campos y enlaces | Feedback de color/borde entre 150 y 200 ms; foco de teclado visible. | Se conserva el feedback de estado. |
| Carrusel | Cambio manual de 300 ms; cuatro botones nativos y gesto de arrastre. | Cambio de 0 ms. La preferencia se actualiza en vivo. |
| Desplazamiento a anclas | Scroll suave del navegador. | Desplazamiento inmediato. |
| Avisos de contacto | Conservan la lógica y los mensajes existentes. | Se eliminan las animaciones CSS de entrada/salida; el estado persistente del formulario permanece. |

## Accesibilidad y presupuesto

El encabezado tiene un nombre accesible estable: «Hey, soy David Molina.». Las letras cambiantes no se anuncian continuamente. El control de pausa es un botón nativo con foco visible y altura mínima de 44 px.

La paginación de testimonios usa botones de al menos 44 × 44 px, con nombre, destino y estado actual. Solo la diapositiva activa se expone al árbol accesible. El módulo A11y ya incluido en Swiper aporta la descripción del carrusel y las etiquetas de los testimonios en español. No hay reproducción automática del carrusel.

La secuencia del título mantiene como máximo un timeout pendiente. Cada cambio de estado y desmontaje cancela el timeout anterior; también se liberan los listeners y el observador. Se verifican estas condiciones en StrictMode. Si faltan matchMedia o IntersectionObserver, se usan las alternativas disponibles sin bloquear el contenido.

Los cambios de movimiento no modifican el ancho o la altura de las tarjetas. Se conserva el espacio del título y no se agregan bucles CSS ni efectos de filtros o sombras costosos. No se usan eventos de scroll para animar el documento.

## Límite de recursos

Los GIF originales permanecen intactos. Las preferencias y controles implementados afectan a CSS y JavaScript; no detienen la decodificación interna de un GIF. La política de pósteres o reproducción de esos recursos debe abordarse en su fase de recursos, conservando las vistas previas originales.
