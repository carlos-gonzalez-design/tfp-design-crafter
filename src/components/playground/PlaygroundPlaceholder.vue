<script setup>
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  planned: { type: Array, default: () => [] },
})
</script>

<template>
  <section class="ds-playground-section ds-playground-placeholder" :aria-labelledby="`playground-${title.toLowerCase()}-title`">
    <PlaygroundSectionHeader :title-id="`playground-${title.toLowerCase()}-title`" :title="title" :description="description" />
    <div class="ds-playground-placeholder__body">
      <p>Prepared for the next implementation phase.</p>
      <ul class="ds-playground-placeholder__list" aria-label="Planned components">
        <li v-for="item in planned" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
