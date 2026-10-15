<script setup>
import DsTypography from '../core/DsTypography.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  badge: { type: String, default: '' },
  variant: { type: String, default: 'basic' },
  interactive: { type: Boolean, default: false },
})
</script>

<template>
  <article
    class="ds-card"
    :class="[`ds-card--${variant}`, { 'ds-card--interactive': interactive }]"
    :tabindex="interactive ? 0 : undefined"
    data-ds-component="DsCard"
    :data-ds-variant="variant"
  >
    <div v-if="image || $slots.media" class="ds-card__media">
      <slot name="media"><img class="ds-card__image" :src="image" :alt="imageAlt" /></slot>
    </div>
    <div class="ds-card__content">
      <div v-if="badge || $slots.eyebrow" class="ds-card__eyebrow">
        <span v-if="badge" class="ds-card__badge">{{ badge }}</span>
        <slot name="eyebrow" />
      </div>
      <slot name="header"><DsTypography variant="h3">{{ title }}</DsTypography></slot>
      <DsTypography v-if="description">{{ description }}</DsTypography>
      <slot name="content" />
      <div v-if="$slots.default" class="ds-card__actions"><slot /></div>
    </div>
  </article>
</template>
