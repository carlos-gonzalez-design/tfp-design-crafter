<script setup>
import { computed, ref } from 'vue'
import DcButton from '../components/ui/DcButton.vue'
import DcInput from '../components/ui/DcInput.vue'
import DcSelect from '../components/ui/DcSelect.vue'
import DcSlider from '../components/ui/DcSlider.vue'
import DcTabs from '../components/ui/DcTabs.vue'
import { SPACING_SCALE } from '../utils/designTokens.js'
import { getBrandColor } from '../utils/brand.js'

const props = defineProps({
  cssVariables: { type: Object, required: true },
})

const brandColor = getBrandColor()
const colorTokens = [
  { name: 'Canvas', token: '--dc-color-canvas', value: '#F5F5F2' },
  { name: 'Surface', token: '--dc-color-surface', value: '#FFFFFF' },
  { name: 'Muted', token: '--dc-color-muted', value: '#71717A' },
  { name: 'Brand', token: '--dc-color-brand', value: brandColor },
  { name: 'Success', token: '--dc-color-success', value: '#138A5B' },
  { name: 'Warning', token: '--dc-color-warning', value: '#B56B00' },
  { name: 'Danger', token: '--dc-color-danger', value: '#D83A52' },
  { name: 'Text', token: '--dc-color-ink', value: '#18181B' },
]
const spacingTokens = computed(() => {
  const tokens = SPACING_SCALE.map(token => ({
    name: token.name,
    value: Number.parseFloat(props.cssVariables[`--ds-space-${token.name}`]),
  }))
  const maximum = Math.max(...tokens.map(token => token.value), 1)
  return tokens.map(token => ({ ...token, percentage: token.value / maximum * 100 }))
})
const radiusTokens = [
  { name: 'Small', value: 4 },
  { name: 'Medium', value: 8 },
  { name: 'Large', value: 12 },
  { name: 'X large', value: 16 },
  { name: 'Pill', value: 100 },
]
const selectOptions = [
  { value: 'geist', label: 'Geist' },
  { value: 'inter', label: 'Inter' },
  { value: 'system', label: 'System UI' },
]
const tabOptions = [
  { value: 'foundations', label: 'Foundations' },
  { value: 'components', label: 'Components' },
  { value: 'patterns', label: 'Patterns' },
]

const inputValue = ref('Design token')
const selectedFont = ref('geist')
const checkboxValue = ref(true)
const radioValue = ref('comfortable')
const switchValue = ref(true)
const sliderValue = ref(58)
const colorValue = ref(brandColor)
const activeTab = ref('foundations')
const activeSegment = ref('design')
const activeNav = ref('Components')
const zoom = ref(100)
const patternColor = ref(brandColor)
const patternFont = ref('geist')
const patternSize = ref(32)
const zoomLabel = computed(() => `${zoom.value}%`)

function changeZoom(amount) {
  zoom.value = Math.min(200, Math.max(25, zoom.value + amount))
}
</script>

<template>
  <main class="ui-kit">
    <header class="ui-kit__hero">
      <div class="ui-kit__hero-copy">
        <p class="ui-kit__kicker">Design Crafter / System 01</p>
        <h1>Interface<br />UI Kit</h1>
        <p>Una colección viva de foundations, controles y patrones para construir la interfaz de Design Crafter con claridad y consistencia.</p>
      </div>
      <dl class="ui-kit__meta">
        <div><dt>Version</dt><dd>1.0</dd></div>
        <div><dt>Last updated</dt><dd>October 2026</dd></div>
        <div><dt>Stack</dt><dd>Vue 3 · Native CSS</dd></div>
      </dl>
    </header>

    <section class="ui-kit__section" aria-labelledby="foundations-title">
      <div class="ui-kit__section-heading">
        <div><span>01</span><h2 id="foundations-title">Foundations</h2></div>
        <p>Variables internas que definen el lenguaje visual de la aplicación.</p>
      </div>

      <div class="ui-kit__block">
        <div class="ui-kit__block-heading"><h3>Semantic colors</h3><code>--dc-color-*</code></div>
        <div class="token-colors">
          <article v-for="color in colorTokens" :key="color.token" class="token-color">
            <div class="token-color__swatch" :style="{ background: `var(${color.token})` }"></div>
            <div><strong>{{ color.name }}</strong><code>{{ color.token }}</code><span>{{ color.value }}</span></div>
          </article>
        </div>
      </div>

      <div class="ui-kit__foundations-grid">
        <div class="ui-kit__block type-specimen">
          <div class="ui-kit__block-heading"><h3>Typography</h3><code>Geist + DM Mono</code></div>
          <div class="type-specimen__display">Aa</div>
          <div class="type-specimen__rows">
            <p class="type-specimen__h1"><span>Display / 80</span>Craft better systems.</p>
            <p class="type-specimen__h2"><span>Heading / 28</span>Everything in its place.</p>
            <p class="type-specimen__body"><span>Body / 14</span>Thoughtful tools for shaping consistent interfaces.</p>
            <p class="type-specimen__mono"><span>Mono / 11</span>--dc-color-brand: {{ brandColor }};</p>
          </div>
        </div>

        <div class="ui-kit__block ds-preview" :style="cssVariables">
          <div class="ui-kit__block-heading"><h3>Generated spacing</h3><code>--ds-space-* · {{ cssVariables['--ds-density'] }}</code></div>
          <div class="spacing-scale">
            <div v-for="space in spacingTokens" :key="space.name" class="spacing-scale__item">
              <span :style="{ width: `${space.percentage}%` }"></span><code>{{ space.value }}px</code>
            </div>
          </div>
        </div>

        <div class="ui-kit__block">
          <div class="ui-kit__block-heading"><h3>Border radius</h3><code>--dc-radius-*</code></div>
          <div class="radius-scale">
            <div v-for="radius in radiusTokens" :key="radius.name" class="radius-scale__item">
              <span :style="{ borderRadius: `${radius.value}px` }"></span>
              <div><strong>{{ radius.name }}</strong><code>{{ radius.value }}px</code></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ui-kit__section" aria-labelledby="actions-title">
      <div class="ui-kit__section-heading">
        <div><span>02</span><h2 id="actions-title">Actions</h2></div>
        <p>Acciones jerarquizadas, con tamaños y estados predecibles.</p>
      </div>
      <div class="ui-kit__block action-showcase">
        <div class="component-row component-row--labels"><span>Variant</span><span>Small</span><span>Medium</span><span>Large</span></div>
        <div v-for="variant in ['primary', 'secondary', 'outline', 'ghost', 'danger']" :key="variant" class="component-row">
          <strong>{{ variant === 'danger' ? 'Destructive' : variant }}</strong>
          <DcButton :variant="variant" size="small">Button</DcButton>
          <DcButton :variant="variant">Button</DcButton>
          <DcButton :variant="variant" size="large">Button</DcButton>
        </div>
        <div class="action-states">
          <span>States</span>
          <DcButton class="dc-button--state-hover">Hover</DcButton>
          <DcButton class="dc-button--state-focus">Focus</DcButton>
          <DcButton disabled>Disabled</DcButton>
          <DcButton loading>Loading</DcButton>
        </div>
      </div>
    </section>

    <section class="ui-kit__section" aria-labelledby="forms-title">
      <div class="ui-kit__section-heading">
        <div><span>03</span><h2 id="forms-title">Forms &amp; Controls</h2></div>
        <p>Controles reales, accesibles y listos para conectarse a datos.</p>
      </div>
      <div class="ui-kit__forms-grid">
        <div class="ui-kit__block">
          <div class="ui-kit__block-heading"><h3>Text inputs</h3><code>DcInput</code></div>
          <div class="form-stack">
            <DcInput id="kit-default" v-model="inputValue" label="Default" helper="Helper text" />
            <DcInput id="kit-focus" model-value="Focused value" label="Focus" class="dc-field--state-focus" />
            <DcInput id="kit-error" model-value="wrong-token" label="Error" error="Use a valid CSS custom property" />
            <DcInput id="kit-disabled" model-value="Not editable" label="Disabled" disabled />
          </div>
        </div>

        <div class="ui-kit__block">
          <div class="ui-kit__block-heading"><h3>Select &amp; range</h3><code>Interactive</code></div>
          <div class="form-stack">
            <div class="kit-control"><span>Typeface</span><DcSelect v-model="selectedFont" :options="selectOptions" label="Typeface" /></div>
            <div class="kit-control"><span>Scale <output>{{ sliderValue }}%</output></span><DcSlider v-model="sliderValue" :min="0" :max="100" label="Scale" unit="%" /></div>
            <label class="kit-color"><span>Brand color</span><input v-model="colorValue" type="color" aria-label="Brand color" /><code>{{ colorValue }}</code></label>
          </div>
        </div>

        <div class="ui-kit__block">
          <div class="ui-kit__block-heading"><h3>Selection controls</h3><code>Native inputs</code></div>
          <div class="selection-controls">
            <label class="dc-check"><input v-model="checkboxValue" type="checkbox" /><span>Show grid overlay</span></label>
            <label class="dc-check"><input type="checkbox" /><span>Snap to spacing</span></label>
            <label class="dc-check"><input type="checkbox" disabled /><span>Locked option</span></label>
            <div class="selection-controls__rule"></div>
            <label v-for="option in ['compact', 'comfortable']" :key="option" class="dc-radio">
              <input v-model="radioValue" type="radio" name="density" :value="option" /><span>{{ option }}</span>
            </label>
            <div class="selection-controls__rule"></div>
            <label class="dc-switch"><input v-model="switchValue" class="dc-switch__input" type="checkbox" /><span class="dc-switch__track"><span class="dc-switch__thumb"></span></span><span>Live preview</span></label>
            <label class="dc-switch dc-switch--disabled"><input class="dc-switch__input" type="checkbox" disabled /><span class="dc-switch__track"><span class="dc-switch__thumb"></span></span><span>Disabled</span></label>
          </div>
        </div>
      </div>
    </section>

    <section class="ui-kit__section" aria-labelledby="navigation-title">
      <div class="ui-kit__section-heading">
        <div><span>04</span><h2 id="navigation-title">Navigation</h2></div>
        <p>Patrones de orientación para distintas densidades de interfaz.</p>
      </div>
      <div class="ui-kit__block navigation-showcase">
        <DcTabs v-model="activeTab" :tabs="tabOptions" label="UI Kit categories">
          <template #default="{ activeTab: selectedTab }"><p class="navigation-showcase__content">{{ selectedTab }} content is active.</p></template>
        </DcTabs>
        <div class="dc-segmented" aria-label="View mode">
          <button v-for="segment in ['design', 'code', 'inspect']" :key="segment" type="button" class="dc-segmented__item" :class="{ 'dc-segmented__item--active': activeSegment === segment }" :aria-pressed="activeSegment === segment" @click="activeSegment = segment">{{ segment }}</button>
        </div>
        <nav class="dc-side-navigation" aria-label="Example navigation">
          <button v-for="item in ['Foundations', 'Components', 'Patterns', 'Settings']" :key="item" type="button" class="dc-side-navigation__item" :class="{ 'dc-side-navigation__item--active': activeNav === item }" :aria-current="activeNav === item ? 'page' : undefined" @click="activeNav = item">{{ item }}<span v-if="activeNav === item" class="dc-side-navigation__indicator"></span></button>
        </nav>
      </div>
    </section>

    <section class="ui-kit__section" aria-labelledby="layout-title">
      <div class="ui-kit__section-heading">
        <div><span>05</span><h2 id="layout-title">Layout</h2></div>
        <p>Superficies que ordenan la información sin competir con ella.</p>
      </div>
      <div class="layout-showcase">
        <article class="dc-panel">
          <header class="dc-panel__header"><h3>Panel</h3><span>Structure</span></header>
          <div class="dc-panel__body"><div class="dc-panel-demo"><div class="dc-panel-demo__sidebar"><i></i><i></i><i></i></div><div class="dc-panel-demo__main"><span></span><div>Canvas</div></div></div></div>
        </article>
        <article class="dc-card">
          <header class="dc-card__header"><strong>Color token</strong><button type="button" aria-label="More options">•••</button></header>
          <div class="dc-card__content"><span class="dc-card__swatch"></span><div><strong>Brand 500</strong><small>{{ brandColor }}</small></div></div>
        </article>
        <div class="container-demo"><span>Centered container</span><code>max-width: 72rem</code></div>
      </div>
    </section>

    <section class="ui-kit__section" aria-labelledby="feedback-title">
      <div class="ui-kit__section-heading">
        <div><span>06</span><h2 id="feedback-title">Feedback</h2></div>
        <p>Estados claros que explican qué está ocurriendo y qué hacer después.</p>
      </div>
      <div class="ui-kit__block feedback-showcase">
        <div class="badge-row"><span class="dc-badge">Neutral</span><span class="dc-badge dc-badge--brand">Brand</span><span class="dc-badge dc-badge--success">Success</span><span class="dc-badge dc-badge--warning">Warning</span><span class="dc-badge dc-badge--danger">Danger</span></div>
        <div class="alert-grid">
          <div class="dc-alert dc-alert--info"><strong>Canvas synced</strong><p>Your latest token changes are visible.</p></div>
          <div class="dc-alert dc-alert--success"><strong>CSS generated</strong><p>The stylesheet is ready to copy.</p></div>
          <div class="dc-alert dc-alert--warning"><strong>Contrast check</strong><p>This pair may be hard to read.</p></div>
          <div class="dc-alert dc-alert--danger"><strong>Invalid value</strong><p>Enter a supported CSS value.</p></div>
        </div>
        <p class="dc-validation"><span aria-hidden="true">!</span> Value must be between 0 and 64 pixels.</p>
      </div>
    </section>

    <section class="ui-kit__section" aria-labelledby="preview-title-kit">
      <div class="ui-kit__section-heading">
        <div><span>07</span><h2 id="preview-title-kit">Preview Tools</h2></div>
        <p>Controles compactos para inspeccionar el sistema sin interrumpir el flujo.</p>
      </div>
      <div class="preview-tools-demo">
        <div class="preview-tools-demo__canvas">
          <span>Preview canvas</span>
          <div class="dc-preview-toolbar" role="toolbar" aria-label="Preview controls">
            <div class="dc-preview-toolbar__devices" aria-label="Device size">
              <button type="button" aria-pressed="false" aria-label="Mobile view">▯</button>
              <button type="button" aria-pressed="false" aria-label="Tablet view">▭</button>
              <button type="button" aria-pressed="true" aria-label="Desktop view">▱</button>
            </div>
            <span class="dc-preview-toolbar__divider"></span>
            <div class="dc-zoom"><button type="button" aria-label="Zoom out" @click="changeZoom(-10)">−</button><output>{{ zoomLabel }}</output><button type="button" aria-label="Zoom in" @click="changeZoom(10)">+</button></div>
            <span class="dc-preview-toolbar__divider"></span>
            <button class="dc-preview-toolbar__action" type="button">↗ <span>Open preview</span></button>
          </div>
        </div>
      </div>
    </section>

    <section class="ui-kit__patterns" aria-labelledby="patterns-title">
      <div class="ui-kit__section-heading ui-kit__section-heading--dark">
        <div><span>08</span><h2 id="patterns-title">Composed Patterns</h2></div>
        <p>Componentes trabajando juntos en contextos cercanos al producto real.</p>
      </div>
      <div class="pattern-grid">
        <article class="pattern-card">
          <header><div><span>Editor</span><h3>Color token</h3></div><span class="dc-badge dc-badge--brand">Primitive</span></header>
          <div class="pattern-card__body">
            <label class="pattern-color"><input v-model="patternColor" type="color" aria-label="Pattern color" /><span :style="{ background: patternColor }"></span><code>{{ patternColor }}</code></label>
            <DcInput id="pattern-name" model-value="brand-500" label="Token name" />
            <DcButton size="small">Save token</DcButton>
          </div>
        </article>
        <article class="pattern-card">
          <header><div><span>Editor</span><h3>Typography</h3></div><span class="dc-badge">Heading</span></header>
          <div class="pattern-card__body">
            <div class="kit-control"><span>Typeface</span><DcSelect v-model="patternFont" :options="selectOptions" label="Pattern typeface" /></div>
            <div class="kit-control"><span>Size <output>{{ patternSize }}px</output></span><DcSlider v-model="patternSize" :min="16" :max="64" label="Pattern font size" unit="px" /></div>
            <p class="pattern-type-preview" :style="{ fontSize: `${patternSize}px` }">Ag</p>
          </div>
        </article>
        <article class="pattern-card pattern-card--toolbar">
          <header><div><span>Canvas</span><h3>Preview toolbar</h3></div><span class="dc-badge dc-badge--success">Synced</span></header>
          <div class="pattern-card__canvas"><div class="dc-preview-toolbar"><div class="dc-preview-toolbar__devices"><button type="button">▯</button><button type="button">▭</button><button type="button" aria-pressed="true">▱</button></div><span class="dc-preview-toolbar__divider"></span><div class="dc-zoom"><button type="button" @click="changeZoom(-10)">−</button><output>{{ zoomLabel }}</output><button type="button" @click="changeZoom(10)">+</button></div></div></div>
        </article>
      </div>
    </section>
  </main>
</template>
