<script setup>
defineProps({
  titleId: { type: String, default: undefined },
  eyebrow: { type: String, default: 'Component playground' },
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <header class="ds-playground-section__header">
    <p class="ds-playground-section__eyebrow">{{ eyebrow }}</p>
    <h3 :id="titleId" class="ds-playground-section__title">{{ title }}</h3>
    <p class="ds-playground-section__description">{{ description }}</p>
  </header>
</template>
