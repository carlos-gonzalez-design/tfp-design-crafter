<script setup>
// Convierte el mapa reactivo de tokens en una muestra CSS y puede añadir reglas de componentes vinculadas a esos tokens.
import { computed } from 'vue'

const props = defineProps({
  cssVariables: { type: Object, required: true },
  includeComponentStyles: { type: Boolean, default: false },
})

const colorComponentStyles = `.ds-button {
  color: var(--ds-color-button-primary-text-default);
  background: var(--ds-color-button-primary-background-default);
}
.ds-button:hover { color: var(--ds-color-button-primary-text-hover); background: var(--ds-color-button-primary-background-hover); }
.ds-button:active { color: var(--ds-color-button-primary-text-active); background: var(--ds-color-button-primary-background-active); }
.ds-button--secondary {
  color: var(--ds-color-button-secondary-text-default);
  background: var(--ds-color-button-secondary-background-default);
  border-color: var(--ds-color-button-secondary-border-default);
}
.ds-button--secondary:hover { background: var(--ds-color-button-secondary-background-hover); }
.ds-button--secondary:active { background: var(--ds-color-button-secondary-background-active); }
.ds-button--tertiary { color: var(--ds-color-button-tertiary-text-default); }
.ds-button--tertiary:hover { background: var(--ds-color-button-tertiary-background-hover); }
.ds-typography--link { color: var(--ds-color-link-default); }
.ds-typography--link:hover { color: var(--ds-color-link-hover); }
.ds-badge--primary, .ds-card__badge { color: var(--ds-color-badge-brand-text); background: var(--ds-color-badge-brand-background); }
.ds-badge--success { color: var(--ds-color-text-on-success); background: var(--ds-color-status-success); }
.ds-badge--danger { color: var(--ds-color-text-on-error); background: var(--ds-color-status-error); }
.ds-alert--success { border-color: var(--ds-color-status-success); }
.ds-alert--warning { border-color: var(--ds-color-status-warning); }
.ds-alert--danger { border-color: var(--ds-color-status-error); }
[aria-selected='true'], [data-selected], [data-state='on'] {
  color: var(--ds-color-selection-text);
  border-color: var(--ds-color-selection-border);
  background: var(--ds-color-selection-background);
}
:focus-visible { outline-color: var(--ds-color-focus-ring); }`

const generatedCss = computed(() => {
  const declarations = Object.entries(props.cssVariables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  const components = props.includeComponentStyles ? `\n\n${colorComponentStyles}` : ''
  return `.ds-preview {\n${declarations}\n}${components}`
})
</script>

<template>
  <section class="generated-css" aria-labelledby="generated-css-title">
    <div class="generated-css__heading">
      <div>
        <p class="eyebrow">Token output</p>
        <h2 id="generated-css-title" class="generated-css__title">Generated CSS</h2>
      </div>
      <span class="generated-css__format">CSS</span>
    </div>
    <pre class="generated-css__code"><code>{{ generatedCss }}</code></pre>
  </section>
</template>
