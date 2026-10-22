# Design Crafter UI Kit — referencia de extracción

## Alcance y fuente

Esta referencia documenta los valores visuales implementados en `src/index.css` y las variantes realmente renderizadas por `src/App.tsx`. `design-tokens.css` y `ui-components.css` son una extracción independiente: no sustituyen ni modifican los estilos originales.

El resultado no contiene Tailwind, Sass, CSS-in-JS, React ni Vue. Los selectores visuales se han renombrado con BEM y el prefijo `dc-`; los valores permanecen iguales.

## Paleta cromática

### Primitivos

| Token | Valor | Uso observado |
|---|---|---|
| `--dc-color-white` | `#ffffff` | Superficie clara, superficie clara y thumb del switch |
| `--dc-color-neutral-25` | `#fafaf9` | Superficie elevada |
| `--dc-color-neutral-50` | `#f5f5f2` | Canvas |
| `--dc-color-neutral-200` | `#e4e4e7` | Borde |
| `--dc-color-neutral-300` | `#d4d4d8` | Borde fuerte |
| `--dc-color-neutral-400` | `#a1a1aa` | Texto subtle |
| `--dc-color-neutral-500` | `#71717a` | Texto muted |
| `--dc-color-neutral-950` | `#18181b` | Texto principal |
| `--dc-color-brand-50` | mezcla de brand 8% con blanco | Fondo brand soft |
| `--dc-color-brand-500` | `#635bff` | Acción principal y foco |
| `--dc-color-brand-600` | mezcla de brand 86% con negro | Hover de acción principal |
| `--dc-color-success-700` | `#138a5b` | Estado success |
| `--dc-color-warning-700` | `#b56b00` | Estado warning |
| `--dc-color-danger-600` | `#d83a52` | Estado danger/error |

Los fondos soft son `#eaf8f1`, `#fff7e8` y `#fff0f2` para success, warning y danger.

#| `--dc-color-brand-text` | mezcla de brand 72% con negro | Texto brand sobre fondo claro |`r`n`r`n## Roles semánticos

Los componentes consumen `--dc-color-canvas`, `--dc-color-surface`, `--dc-color-raised`, `--dc-color-ink`, `--dc-color-muted`, `--dc-color-subtle`, `--dc-color-border`, `--dc-color-border-strong`, `--dc-color-brand` y los roles de estado.

El tema oscuro original se conserva mediante `.dc-theme--dark`:

| Rol | Valor oscuro |
|---|---|
| Canvas | `#111113` |
| Surface | `#19191c` |
| Raised | `#202024` |
| Ink | `#f5f5f5` |
| Muted | `#a1a1aa` |
| Subtle | `#71717a` |
| Border | `#2e2e33` |
| Border strong | `#414148` |

El color brand principal no cambia en modo oscuro. Solo cambian los fondos soft y la sombra elevada, igual que en la implementación fuente.

## Tipografía

- **Sans:** Geist.
- **Monoespaciada:** DM Mono.
- La fuente original se solicita desde Google Fonts con Geist `400`, `500`, `600`, `700` y DM Mono `400`, `500`.
- Los pesos interpolados `550` y `650` aparecen literalmente en controles y marca. Para máxima fidelidad debe usarse una versión variable de Geist o permitirse que el navegador interpole esos pesos.

### Tamaños utilizados

`0.5625rem`, `0.625rem`, `0.6875rem`, `0.75rem`, `0.8125rem`, `0.875rem`, `1.0625rem`, `1.5rem`, `1.625rem`, `1.75rem` y `2.75rem`.

El display principal conserva `clamp(2.875rem, 6vw, 5rem)`, equivalente al `clamp(46px, 6vw, 80px)` original.

### Line-height y tracking

- Display: `0.98`.
- Texto base: `normal`, heredado de Geist; el CSS fuente no declara un valor numérico global.
- Lead: `1.65`.
- Letter spacing: `-0.08em`, `-0.065em`, `-0.04em`, `-0.02em`, `0.04em`, `0.08em` y `0.12em`.

## Escala de spacing

La escala declarada en el UI Kit es:

| Token | Valor |
|---|---:|
| `--dc-space-1` | `0.25rem` / 4px |
| `--dc-space-2` | `0.5rem` / 8px |
| `--dc-space-3` | `0.75rem` / 12px |
| `--dc-space-4` | `1rem` / 16px |
| `--dc-space-6` | `1.5rem` / 24px |
| `--dc-space-8` | `2rem` / 32px |
| `--dc-space-12` | `3rem` / 48px |
| `--dc-space-16` | `4rem` / 64px |

La implementación también usa ajustes de 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 18, 20, 22 y 28px. Se mantienen como tokens `--dc-space-*px` para reproducir el diseño sin alterar la escala ni redondear valores.

## Radius

| Token | Valor | Uso |
|---|---:|---|
| `--dc-radius-sm` | `0.25rem` | Canvas y slider |
| `--dc-radius-control-inner` | `0.3125rem` | Segmentos internos |
| `--dc-radius-md` | `0.5rem` | Botones, campos y controles |
| `--dc-radius-toolbar` | `0.625rem` | Toolbar flotante |
| `--dc-radius-lg` | `0.75rem` | Paneles y cards |
| `--dc-radius-xl` | `1rem` | Token original disponible |
| `--dc-radius-pattern` | `1.5rem` | Contenedor de patterns |
| `--dc-radius-pill` | `6.25rem` | Badges y switch |
| `--dc-radius-circle` | `50%` | Thumbs e indicadores |

## Bordes y sombras

- Borde normal: `1px solid #e4e4e7`.
- Borde fuerte: `1px solid #d4d4d8`.
- Indicador activo: `2px`.
- Focus ring: `0 0 0 3px rgba(99, 91, 255, 0.2)`.
- Sombra elevada: `0 8px 30px rgba(24, 24, 27, 0.07)`.
- Botón secundario: `0 1px 2px rgba(0, 0, 0, 0.03)`.
- Thumb de switch: `0 1px 2px rgba(0, 0, 0, 0.2)`.
- Navegación activa: `0 1px 3px rgba(0, 0, 0, 0.07)`.
- Segmento activo: `0 1px 3px rgba(0, 0, 0, 0.08)`.

## Motion y estados

- Transición de controles: `150ms ease`.
- Transición de tema y switch: `200ms ease`.
- Hover primary: brand `#635bff` con mezcla de negro (86% brand).
- Hover secondary y ghost: fondo raised.
- Focus: ring brand de 3px.
- Active: desplazamiento vertical de 1px y `brightness(0.9)`.
- Disabled general: `opacity: 0.42`.
- Disabled switch: `opacity: 0.45`.

## Componentes y variantes

### Buttons e Icon Buttons

Clases: `.dc-button`, tamaños `--sm`, `--md`, `--lg`, variantes `--primary`, `--secondary`, `--ghost`, `--danger` y modificador `--icon`.

Estados existentes: hover, focus, active y disabled. Los modificadores `--state-hover`, `--state-focus` y `--state-active` reproducen los estados demostrativos que el UI Kit muestra de forma permanente.

### Inputs

Clases: `.dc-field`, `.dc-field__label`, `__control`, `__input`, `__helper` y `--error`.

Estados existentes: `focus-within` y error. El input interno conserva 12px, fondo transparente y ausencia de borde propio.

### Selects

Clases: `.dc-select`, `__label`, `__control` y `__icon`.

El proyecto actual no implementa un popup ni opciones; muestra un control select estático. Por fidelidad, no se han inventado estilos de menú, option, viewport o animaciones.

### Sliders

Clases: `.dc-slider`, `__meta`, `__output`, `__track`, `__range` y `__thumb`.

El valor del range depende de un porcentaje inline en React. En una integración externa puede trasladarse sin pérdida a `style="inline-size: var(--value)"` o a una variable local, por ejemplo `--dc-slider-value: 58%`.

### Switches

Clases: `.dc-switch`, `__input`, `__track`, `__thumb` y `--disabled`.

El estado checked utiliza el checkbox nativo y el selector adyacente. El thumb se desplaza exactamente 12px.

### Tabs y segmented controls

Tabs: `.dc-tabs`, `.dc-tabs__tab`, `--active` o `[aria-selected="true"]`.

Segmented: `.dc-segmented`, `.dc-segmented__item`, `--active`, `[aria-pressed="true"]` y `--compact`.

### Panels

`.dc-panel` corresponde al bloque showcase del UI Kit. Incluye `__header`, `__title`, `__meta`, `__body` y `--wide`.

`.dc-panel-demo` reproduce la demostración de niveles de superficie con sidebar al 28%, toolbar y superficie interna.

### Cards

`.dc-card` corresponde al editor card actual. Incluye header, content, stack, metadata y swatch.

### Navigation

- Navegación superior: `.dc-top-navigation` y `.dc-top-navigation__item`.
- Navegación lateral: `.dc-side-navigation`, `__item` e `__indicator`.
- Los estados activos admiten tanto modificador BEM como `aria-current="page"`.

### Badges

`.dc-badge` con variantes `--brand`, `--success`, `--warning` y `--danger`. El estilo base representa la variante neutral.

### Tooltips

El proyecto actual no contiene un componente Tooltip ni estilos asociados. No se ha generado `.dc-tooltip` para evitar inventar un componente o valores visuales inexistentes.

## Relación entre componentes y tokens

| Componente | Tokens principales |
|---|---|
| Button | `--dc-control-height-*`, `--dc-radius-md`, `--dc-color-brand`, `--dc-color-brand-hover`, `--dc-shadow-button`, `--dc-shadow-focus`, motion y opacidades |
| Icon Button | Tokens de Button más `aspect-ratio: 1` y padding inline cero |
| Input | `--dc-field-height`, `--dc-color-surface`, `--dc-color-border-strong`, `--dc-color-danger`, `--dc-shadow-focus` |
| Select | Tokens de Input, `--dc-color-ink` y `--dc-color-muted` |
| Slider | `--dc-slider-track-height`, `--dc-slider-thumb-size`, `--dc-color-border`, `--dc-color-brand`, `--dc-color-surface` |
| Switch | `--dc-switch-*`, `--dc-color-border-strong`, `--dc-color-brand`, `--dc-shadow-control`, motion |
| Tabs | `--dc-space-6`, `--dc-color-border`, `--dc-color-muted`, `--dc-color-ink`, `--dc-color-brand` |
| Segmented | `--dc-radius-md`, `--dc-radius-control-inner`, `--dc-color-raised`, `--dc-color-surface`, `--dc-shadow-segment` |
| Panel | `--dc-color-surface`, `--dc-color-border`, `--dc-radius-lg`, spacing y tipografía mono |
| Card | `--dc-card-max-width`, `--dc-color-surface`, `--dc-radius-lg`, `--dc-shadow-raised` |
| Top Navigation | `--dc-color-muted`, `--dc-color-ink`, `--dc-color-brand`, `--dc-font-size-13` |
| Side Navigation | `--dc-side-navigation-width`, `--dc-navigation-item-height`, `--dc-color-raised`, `--dc-shadow-nav` |
| Badge | colores semánticos, `--dc-radius-pill`, `--dc-font-family-mono`, `--dc-letter-spacing-badge` |
| Tooltip | No disponible en la implementación actual |

## Equivalencias que requieren integración

1. **Fuentes:** los CSS extraídos no fuerzan una URL externa. Para fidelidad, la aplicación debe cargar Geist y DM Mono con los pesos documentados, ya sea mediante Google Fonts o archivos autoalojados.
2. **Iconos:** los SVG actuales reciben tamaño, stroke `currentColor`, `stroke-width: 1.8`, linecap y linejoin desde React. Estos atributos pueden conservarse directamente en el SVG; no dependen de una librería visual.
3. **Slider:** el porcentaje de progreso es un dato dinámico, no un token de diseño.
4. **Muestras de color:** la muestra principal de la card usa el token de marca `--dc-color-brand`.




