# Design Crafter

Design Crafter es una herramienta web orientada a la creación y previsualización de las bases de un sistema de diseño. El proyecto está desarrollado con Vue 3 y Vite.

# Enlaces de interés
Github del proyecto: https://github.com/carlos-gonzalez-design/tfp-design-crafter
Proyecto en Netlify: https://design-crafter-playground.netlify.app/

## Estado actual del proyecto

El proyecto todavía está bastante verde, pero ya cuenta con una primera base funcional. La aplicación se ha organizado en dos áreas principales:

- **Foundations Panel:** permite modificar los colores, la tipografía, los espaciados y los radios de borde del sistema de diseño.
- **Preview:** muestra en tiempo real cómo afectan estos cambios a distintos ejemplos de textos, botones y tarjetas.

También se ha comenzado a trabajar con *design tokens*. Los valores seleccionados en el panel Foundations se transforman en variables CSS, se aplican automáticamente a la previsualización y se muestran en un bloque de código CSS generado.

El CSS está separado por responsabilidades para que el proyecto sea más fácil de mantener y ampliar. Actualmente se divide en estilos base, tipografía, estructura general, componentes, utilidades y estilos específicos de la previsualización. La interfaz también está organizada mediante componentes de Vue independientes para el panel de configuración, el área de previsualización y los distintos elementos del sistema de diseño.

Por ahora, el trabajo se ha centrado principalmente en definir la estructura de la aplicación, conectar los controles con la previsualización y comprobar el funcionamiento de algunos componentes básicos. Todavía queda bastante por desarrollar, revisar y pulir, pero esta primera versión ya permite comprobar el planteamiento técnico y la dirección que está tomando el proyecto.
