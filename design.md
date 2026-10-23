# Design direction — Design Crafter

## Propósito

Design Crafter ayuda a pasar de una decisión visual aislada a una regla reutilizable. La persona usuaria edita foundations, ve cómo afectan a componentes reales y puede inspeccionar el CSS que expresa el sistema.

El producto debe sentirse como una herramienta de trabajo: claro, controlado y directo. Cada control responde a una pregunta concreta de diseño y debe explicar su efecto en contexto.

## A quién sirve

- **Diseñadores de producto** que quieren probar foundations y verlas aplicadas a componentes.
- **Desarrolladores front end** que necesitan traducir decisiones visuales a tokens y estilos reutilizables.
- **Estudiantes** que están aprendiendo cómo se conectan foundations, componentes y código.

## Principios de diseño

### 1. Mostrar la relación entre causa y efecto

La edición, el preview y el código forman un mismo flujo: al cambiar un valor, la interfaz muestra qué cambia y qué token lo representa. El preview es una superficie independiente de trabajo para observar el resultado, no una miniatura decorativa dentro del panel de edición.

### 2. Limitar opciones para mejorar la consistencia

Las escalas tienen opciones deliberadas. Una escala útil reduce decisiones repetidas y hace más fácil compartir criterios entre diseño y desarrollo. Los controles no deben sugerir una precisión que el sistema no pueda mantener.

### 3. Nombrar por función y contexto

Los nombres deben indicar qué representa el valor y dónde se aplica. Una estructura como `elemento > prioridad > estado` ayuda a distinguir el propósito de un token del valor visual que contiene. Los tokens de escala conservan nombres estables, por ejemplo `text-size-xs` hasta `text-size-6xl`.

### 4. Hacer accesibilidad visible en el proceso

La accesibilidad no aparece solo al exportar. El contraste, el foco, el tamaño de texto y la legibilidad deben poder revisarse mientras se diseñan las foundations. Un color no debe ser la única señal de selección, estado o error.

### 5. Mantener el sistema adaptable

La jerarquía entre edición, preview e inspección del código debe seguir siendo comprensible en escritorio y en pantallas estrechas. El contenido puede reorganizarse, pero las acciones principales y su contexto deben seguir localizables.

## Estructura del producto

La navegación principal separa las tareas para que la persona sepa qué está haciendo:

- **Edit:** cambia foundations y ajusta los componentes.
- **Tokens:** consulta los valores del sistema de forma organizada.
- **Code:** inspecciona la salida CSS y la prepara para exportación.
- **Overview:** revisa las foundations y el preview resultante.

En la edición, el inspector de componentes acompaña al preview sin competir con él. El área de preview debe tener espacio suficiente para que los componentes mantengan proporciones y texto legibles.

## Foundations

### Color

- El color de marca se trata como una entrada del sistema, no como color de texto automático.
- La escala se genera a partir del tono elegido y mantiene pasos identificables —por ejemplo `50` a `900`— alrededor del tono principal `500`.
- El texto sobre superficies de color usa negro o blanco, según cuál ofrezca mejor contraste. El color principal no se reutiliza como color del glifo o letra por defecto.
- La selección muestra contraste en contexto y conserva un indicador de selección claro. Los estados seleccionado y enfocado no deben producir bordes duplicados ni cambios de altura.
- El color nunca es la única forma de comunicar un estado.

Para texto normal se toma como referencia WCAG 2.2 AA: contraste mínimo de `4.5:1`; para texto grande, `3:1`. Estos valores orientan la revisión, pero no sustituyen una comprobación accesible de toda la interfaz.

### Tipografía

- El tamaño base es editable en `rem`.
- La escala se expresa con nombres predecibles, de `xs` a `6xl`, evitando valores arbitrarios que hagan difícil anticipar la jerarquía.
- Cada estilo combina tamaño y peso con una función clara, como título, texto de lectura o etiqueta.
- El texto se prueba dentro de los componentes y a diferentes anchuras para detectar cortes, desbordamientos y saltos de línea inesperados.

### Spacing

- Las opciones son **Compact**, **Regular** y **Relaxed**.
- La escala regula separación, márgenes y padding; no altera indirectamente la escala tipográfica ni el tamaño intrínseco de los controles.
- Los valores siguen pasos consistentes y fáciles de reutilizar.

### Border radius

Las opciones disponibles son **Sharp**, **Subtle** y **Pill**. Son decisiones de estilo aplicables a usos concretos: por ejemplo, tarjetas con una forma contenida y botones con una forma pill. No se ofrece un control libre si el resultado no se traduce en una escala coherente.

## Componentes de preview

Los componentes sirven para comprobar las foundations en contexto, no para representar una biblioteca completa. El alcance visual se centra en:

- **Button:** jerarquía, legibilidad y estados interactivos.
- **Card:** relación entre superficie, contenido, separación y radio.
- **Badge:** uso compacto del color, el texto y la forma.

Los componentes se construyen con estilos propios y clases BEM. Las variables CSS funcionan como punto común entre la edición y la vista previa.

## Interacción y estados

- Los cambios se reflejan en el preview sin obligar a guardar cada valor manualmente.
- La selección se comunica con un indicador consistente y sin alterar las dimensiones del control.
- Los controles tienen estados distinguibles de hover, focus, selected, disabled y error cuando corresponda.
- El foco de teclado permanece visible. Como referencia de WCAG 2.2, el indicador debe destacar con claridad respecto a los estados sin foco.
- Las animaciones son breves y funcionales, y respetan `prefers-reduced-motion`.

## Exportación

La exportación conecta lo que se ve con lo que se entrega:

1. Variables CSS para foundations.
2. Clases de componentes con nombres BEM.
3. Valores expresados con unidades apropiadas para el sistema, como `rem` en tipografía.

El código debe reflejar los valores activos del sistema, usar nombres consistentes y evitar duplicar valores que ya estén representados por un token.

## Referencias y adaptación

Design Crafter toma ideas de prácticas establecidas y las adapta a una herramienta educativa y visual:

- **Brad Frost / Atomic Design:** pensar en componentes como una jerarquía que se compone, en vez de diseñar cada pantalla como una pieza aislada. En Design Crafter esto se concreta en foundations que alimentan botones, tarjetas y badges. No se adopta la taxonomía completa si no aporta claridad al alcance del proyecto. [Referencia](https://bradfrost.com/blog/post/atomic-web-design/)
- **Material Design 3:** utilizar tokens y roles para conectar valores de estilo con componentes y estados. Se toma como referencia el principio de roles y consistencia, no su lenguaje visual ni su paleta. [Tokens](https://m3.material.io/foundations/design-tokens) · [Color](https://m3.material.io/styles/color/system/overview)
- **U.S. Web Design System (USWDS):** limitar los valores a escalas y explicar su uso para mejorar consistencia y colaboración. Design Crafter adapta esta idea a escalas más pequeñas de color, tipografía, spacing y radio. [Tokens](https://designsystem.digital.gov/design-tokens/)
- **W3C WCAG 2.2:** usar criterios verificables para contraste de texto y foco visible. [Contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) · [Apariencia del foco](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)

## Criterios para evaluar una decisión

Antes de añadir un control, token o componente, comprobar:

1. ¿Qué problema de diseño resuelve?
2. ¿El resultado se entiende al verlo en el preview?
3. ¿Se puede reutilizar con un nombre claro?
4. ¿Funciona con teclado, conserva contraste y evita depender solo del color?
5. ¿La decisión se refleja correctamente en los tokens y en el CSS exportado?

Si una opción no mejora la comprensión, la consistencia o la accesibilidad, no necesita formar parte de la herramienta.
