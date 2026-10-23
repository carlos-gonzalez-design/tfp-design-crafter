# Design Crafter

**Design Crafter — A Visual Design Playground** es una herramienta front end para convertir decisiones visuales en un sistema de diseño pequeño, coherente y reutilizable. Permite definir foundations, comprobar su efecto en componentes de interfaz y consultar los tokens y estilos CSS resultantes.

La herramienta está pensada para diseñadores y desarrolladores que quieren entender la relación entre una decisión visual y su aplicación en la interfaz, sin tener que empezar por editar código a ciegas.

# Enlaces de interés
Github del proyecto: https://github.com/carlos-gonzalez-design/tfp-design-crafter
Proyecto en Netlify: https://design-crafter-playground.netlify.app/

## Qué puedes hacer

- **Definir color:** partir de un color principal y generar una escala tonal; revisar muestras y escoger texto blanco o negro según el contraste.
- **Ajustar tipografía:** configurar la familia, el tamaño base en `rem` y una escala con nombres consistentes desde `xs` hasta `6xl`.
- **Configurar spacing:** elegir una escala compacta, regular o relajada para márgenes y padding.
- **Elegir border radius:** aplicar una opción controlada —Sharp, Subtle o Pill— a los componentes compatibles.
- **Probar componentes:** ver cómo las foundations se aplican a botones, tarjetas y badges en una vista previa.
- **Inspeccionar y exportar:** revisar los tokens CSS y los estilos de componentes organizados con BEM.
- **Cambiar de tema:** consultar la interfaz en modo claro u oscuro.

## Cómo funciona

1. Edita una foundation.
2. Comprueba el resultado en el preview mientras ajustas los valores.
3. Revisa los tokens y estilos que representan esas decisiones.
4. Exporta el resultado para usarlo como punto de partida en otro proyecto.

El objetivo no es ofrecer una colección interminable de controles. Cada ajuste debe tener un efecto visible y comprensible en el preview y producir una salida que se pueda mantener.

## Tecnología

- Vue 3
- Vite
- JavaScript
- CSS con custom properties y metodología BEM

## Requisitos

- Node.js y npm instalados.

## Instalación y desarrollo

```bash
npm install
npm run dev
```

Vite mostrará la dirección local para abrir la aplicación en el navegador.

## Compilación

```bash
npm run build
```

La versión de producción se genera en `dist/`.

## Criterios del proyecto

- **Una fuente de verdad:** los componentes consumen los tokens definidos en las foundations.
- **Decisiones con propósito:** las escalas y opciones se limitan para ayudar a crear sistemas consistentes, no para añadir controles decorativos.
- **Accesibilidad desde el diseño:** el color, el foco, la jerarquía y los estados deben seguir siendo comprensibles al interactuar con teclado o con distintas necesidades de visión.
- **Feedback inmediato:** los cambios deben verse en contexto antes de exportarlos.
- **Salida legible:** los nombres de tokens y las clases CSS deben ayudar a entender dónde y para qué se usan.
- **Diseño adaptable:** la experiencia debe conservar el acceso a la edición, la vista previa y la inspección del código en distintos tamaños de pantalla.

## Documentación

- [`design.md`](./design.md): principios, decisiones de diseño y criterios de accesibilidad del producto.

## Referencias de diseño

Estas referencias informan el enfoque del proyecto; Design Crafter no pretende replicar sus sistemas ni sus componentes.

- [Brad Frost — Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/): pensar las interfaces como componentes relacionados que se componen en estructuras mayores.
- [Material Design 3 — Design tokens](https://m3.material.io/foundations/design-tokens): usar tokens como valores compartidos entre estilos y componentes.
- [U.S. Web Design System — Design tokens](https://designsystem.digital.gov/design-tokens/): usar conjuntos de valores discretos para facilitar consistencia y comunicación.
- [W3C — WCAG 2.2, contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): referencia para evaluar el contraste del texto.

## Estado

Proyecto académico desarrollado como playground visual para explorar foundations, componentes y tokens CSS.
