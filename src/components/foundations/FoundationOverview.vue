<script setup>
import { computed } from 'vue'
import DcButton from '../ui/DcButton.vue'
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
          <span v-for="(value, name) in foundations.colors" :key="name" :style="{ backgroundColor: value }" :title="`${name}: ${value}`"></span>
        </div>
        <p class="overview-card__summary">{{ Object.keys(foundations.colors).length }} connected palette tokens</p>
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
