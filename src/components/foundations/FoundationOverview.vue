<script setup>
import { computed } from 'vue'
import DcButton from '../ui/DcButton.vue'
import { getPrimaryColorScale, getRecommendedPrimaryTone } from '../../utils/colorScale.js'
import {
  getAppliedSpacing,
  getRadiusDecision,
  getTypographySemanticScale,
  RADIUS_OPTIONS,
  SPACING_SCALE,
  TYPE_SCALE_RATIOS,
} from '../../utils/designTokens.js'

const props = defineProps({
  designSystem: { type: Object, required: true },
  foundations: { type: Object, required: true },
})

const emit = defineEmits(['edit'])

const semanticType = computed(() => getTypographySemanticScale(props.foundations.typography))
const ratioLabel = computed(() => TYPE_SCALE_RATIOS.find(
  option => option.value === Number(props.foundations.typography.scaleRatio),
)?.label ?? 'Custom ratio')
const appliedSpacing = computed(() => getAppliedSpacing(props.foundations.spacing.density))
const overviewPrimaryScale = computed(() => getPrimaryColorScale(props.foundations.colors.primary, props.foundations.colors.primaryTone))
const overviewSelectedTone = computed(() => {
  if (props.foundations.colors.foregroundUsePrimary && props.foundations.colors.primaryTone === 'auto') {
    return { name: 'source', hex: props.foundations.colors.primary }
  }
  return overviewPrimaryScale.value.find(
    tone => tone.name === String(props.foundations.colors.primaryTone),
  ) ?? getRecommendedPrimaryTone(overviewPrimaryScale.value, props.foundations.colors.primary, props.foundations.colors.background)
})
const overviewPrimaryTones = computed(() => {
  const tones = overviewPrimaryScale.value.filter(
    tone => ['100', '300', '500', '700', '900'].includes(tone.name) || tone.name === overviewSelectedTone.value.name,
  )
  if (!overviewPrimaryScale.value.some(tone => tone.name === overviewSelectedTone.value.name)) tones.push(overviewSelectedTone.value)
  return tones
})
const radiusOverview = computed(() => Object.entries(RADIUS_OPTIONS).map(([id, category]) => ({
  id,
  category: category.label.replace(' Shape', '').replace(' Corners', ''),
  ...getRadiusDecision(props.foundations.radius, id),
})))
</script>

<template>
  <section class="foundation-overview" aria-labelledby="overview-title">
    <header class="foundation-overview__header">
      <p class="eyebrow">Design system overview</p>
      <h1 id="overview-title">{{ designSystem.name }}</h1>
      <p>{{ designSystem.description }}</p>
    </header>

    <div class="foundation-overview__grid">
      <article class="overview-card overview-card--colors">
        <div class="overview-card__heading">
          <div><p class="eyebrow">Foundation</p><h2>Colors</h2></div>
          <DcButton size="small" variant="secondary" @click="emit('edit', 'colors')">Edit colors</DcButton>
        </div>
        <div class="overview-colors" aria-label="Current color palette">
          <span v-for="tone in overviewPrimaryTones" :key="tone.name" :class="{ 'overview-colors__tone--selected': tone.name === overviewSelectedTone.name }" :style="{ backgroundColor: tone.hex }" :title="`${tone.name === overviewSelectedTone.name ? 'Selected primary' : 'Primary'} ${tone.name}: ${tone.hex}`" :aria-label="`${tone.name === overviewSelectedTone.name ? 'Selected primary' : 'Primary'} tone ${tone.name}, ${tone.hex}`"></span>
        </div>
        <p class="overview-card__summary">11 generated primary tones · 4 neutrals · 4 state colors</p>
      </article>

      <article class="overview-card overview-card--type">
        <div class="overview-card__heading">
          <div><p class="eyebrow">Foundation</p><h2>Typography</h2></div>
          <DcButton size="small" variant="secondary" @click="emit('edit', 'typography')">Edit type</DcButton>
        </div>
        <p class="overview-type__sample" :style="{ fontFamily: foundations.typography.fontFamily, fontSize: semanticType.h1.remValue }">Aa</p>
        <p class="overview-card__summary">
          {{ foundations.typography.fontFamily.split(',')[0] }} · {{ foundations.typography.baseSize }}px base · {{ ratioLabel }}
        </p>
      </article>

      <article class="overview-card">
        <div class="overview-card__heading">
          <div><p class="eyebrow">Foundation</p><h2>Spacing</h2></div>
          <DcButton size="small" variant="secondary" @click="emit('edit', 'spacing')">Edit spacing</DcButton>
        </div>
        <div class="overview-spacing" aria-hidden="true">
          <span v-for="token in SPACING_SCALE.slice(3, 9)" :key="token.name" :style="{ width: `${token.value}px` }"></span>
        </div>
        <p class="overview-card__summary">
          {{ SPACING_SCALE.length }} primitives · {{ foundations.spacing.density }} density · {{ appliedSpacing.cardPadding.value }}px card padding
        </p>
      </article>

      <article class="overview-card">
        <div class="overview-card__heading">
          <div><p class="eyebrow">Foundation</p><h2>Border Radius</h2></div>
          <DcButton size="small" variant="secondary" @click="emit('edit', 'radius')">Edit radius</DcButton>
        </div>
        <div class="overview-radius" aria-label="Current radius decisions">
          <span v-for="decision in radiusOverview" :key="decision.id" :style="{ borderRadius: `${decision.value}px` }"><small>{{ decision.category }}</small></span>
        </div>
        <p class="overview-card__summary">{{ radiusOverview.map(decision => `${decision.category}: ${decision.label}`).join(' · ') }}</p>
      </article>
    </div>
  </section>
</template>
