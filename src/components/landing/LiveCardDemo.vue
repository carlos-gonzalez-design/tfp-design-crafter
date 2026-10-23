<script setup>
// Permite combinar paleta, tipografía y radios para mostrar en vivo cómo una configuración produce tokens y componentes.
import { computed, ref } from 'vue'
import DsButton from '../design-system/actions/DsButton.vue'
import DsCard from '../design-system/cards/DsCard.vue'
import DsSegmentedControl from '../design-system/navigation/DsSegmentedControl.vue'
import { createDefaultFoundations } from '../../data/defaultDesignSystem.js'
import { createDesignTokens } from '../../utils/designTokens.js'
import { getBrandColor } from '../../utils/brand.js'

const brandColor = getBrandColor()
const palettes = [
  { id: 'brand', label: 'Brand', primary: brandColor, background: '#F5F5F2', surface: '#FFFFFF', text: '#18181B' },
  { id: 'cobalt', label: 'Cobalt', primary: '#4353FF', background: '#F3F5FF', surface: '#FFFFFF', text: '#14162A' },
  { id: 'forest', label: 'Forest', primary: '#138A5B', background: '#F1F7F3', surface: '#FFFFFF', text: '#14251E' },
  { id: 'coral', label: 'Coral', primary: '#E85D45', background: '#FFF6F2', surface: '#FFFFFF', text: '#251714' },
]
const typographyOptions = [
  { value: 'geist', label: 'Geist' },
  { value: 'mono', label: 'Mono' },
  { value: 'serif', label: 'Serif' },
]
const radiusOptions = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'pill', label: 'Pill' },
]
const fonts = {
  geist: 'Geist, sans-serif',
  mono: 'DM Mono, monospace',
  serif: 'Georgia, serif',
}
const radii = {
  sharp: { card: '0px', inner: '0px', button: '0px' },
  subtle: { card: '12px', inner: '8px', button: '8px' },
  pill: { card: '32px', inner: '24px', button: '9999px' },
}

const selectedPalette = ref('brand')
const selectedTypography = ref('geist')
const selectedRadius = ref('subtle')
const palette = computed(() => palettes.find(option => option.id === selectedPalette.value) ?? palettes[0])
const previewTokens = computed(() => {
  // Recompone foundations aisladas y reutiliza la fábrica de tokens para mantener la demo reactiva.
  const foundations = createDefaultFoundations()
  foundations.colors = {
    ...foundations.colors,
    primary: palette.value.primary,
    background: palette.value.background,
    surface: palette.value.surface,
    text: palette.value.text,
  }
  foundations.typography.fontFamily = fonts[selectedTypography.value]
  const tokens = createDesignTokens(foundations)
  const radius = radii[selectedRadius.value]
  return {
    ...tokens,
    '--ds-radius-card-primary': radius.card,
    '--ds-radius-surface-primary': radius.card,
    '--ds-radius-surface-inner': radius.inner,
    '--ds-radius-button-primary': radius.button,
  }
})

function resetDemo() {
  selectedPalette.value = 'brand'
  selectedTypography.value = 'geist'
  selectedRadius.value = 'subtle'
}
</script>

<template>
  <section id="how-it-works" class="landing-section live-demo" aria-labelledby="live-demo-title">
    <div class="landing-container">
      <header class="landing-section-heading landing-section-heading--dark" data-reveal>
        <div>
          <p class="landing-eyebrow landing-eyebrow--light"><span></span>02 · Live preview</p>
          <h2 id="live-demo-title">Make changes.<br /><em>See them instantly.</em></h2>
        </div>
        <p>No guessing. Tune controlled foundation decisions and watch a connected component respond in real time.</p>
      </header>

      <div class="live-demo__workspace" data-reveal>
        <aside class="live-demo__editor" aria-label="Component editor">
          <div class="live-demo__editor-heading">
            <div><span class="live-demo__status-dot"></span><strong>Component editor</strong></div>
            <button type="button" @click="resetDemo">Reset</button>
          </div>

          <fieldset class="live-control">
            <legend>Color system</legend>
            <div class="live-control__palettes">
              <button
                v-for="option in palettes"
                :key="option.id"
                type="button"
                :class="{ 'is-active': selectedPalette === option.id }"
                :aria-pressed="selectedPalette === option.id"
                :aria-label="`${option.label} palette`"
                @click="selectedPalette = option.id"
              >
                <span :style="{ '--palette-primary': option.primary }"></span>
                <small>{{ option.label }}</small>
              </button>
            </div>
          </fieldset>

          <fieldset class="live-control live-control--segmented ds-theme" :style="previewTokens">
            <legend>Typography</legend>
            <DsSegmentedControl v-model="selectedTypography" :items="typographyOptions" label="Typography style" />
          </fieldset>

          <fieldset class="live-control live-control--segmented ds-theme" :style="previewTokens">
            <legend>Border radius</legend>
            <DsSegmentedControl v-model="selectedRadius" :items="radiusOptions" label="Border radius style" />
          </fieldset>

          <div class="live-demo__token-readout" aria-live="polite">
            <span>Active decisions</span>
            <code>{{ palette.primary }}</code>
            <code>{{ selectedTypography }}</code>
            <code>{{ selectedRadius }}</code>
          </div>
        </aside>

        <div class="live-demo__preview ds-theme" :style="previewTokens">
          <div class="live-demo__preview-bar"><span>Live preview</span><i>Synced</i></div>
          <div class="live-demo__stage">
            <DsCard
              class="live-demo__card"
              title="Build with intention."
              description="Your foundations stay connected to every component you create."
              badge="System ready"
              variant="basic"
              interactive
            >
              <template #media>
                <div class="live-card-graphic" aria-hidden="true">
                  <span></span><span></span><span></span>
                  <i>DC</i>
                </div>
              </template>
              <DsButton size="small">Create system <span aria-hidden="true">→</span></DsButton>
            </DsCard>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
