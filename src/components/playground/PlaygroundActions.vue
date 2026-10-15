<script setup>
import { ref } from 'vue'
import DsButton from '../design-system/actions/DsButton.vue'
import DsToggleGroup from '../design-system/actions/DsToggleGroup.vue'
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'

const alignment = ref('left')
const toggleItems = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]
</script>

<template>
  <section class="ds-playground-section" aria-labelledby="playground-actions-title">
    <PlaygroundSectionHeader
      title-id="playground-actions-title"
      title="Actions"
      description="Buttons, grouped actions and headless toggles across variants, sizes and states."
    />
    <div class="ds-examples">
      <div class="ds-examples__buttons">
        <DsButton>Primary Button</DsButton>
        <DsButton variant="secondary">Secondary Button</DsButton>
        <DsButton variant="tertiary">Tertiary Button</DsButton>
        <DsButton variant="outline">Outline Button</DsButton>
        <DsButton variant="ghost">Ghost Button</DsButton>
        <DsButton variant="destructive">Delete Item</DsButton>
        <DsButton disabled>Disabled Button</DsButton>
        <DsButton loading>Saving</DsButton>
      </div>
      <div class="ds-examples__sample">
        <span class="ds-examples__label">Button sizes</span>
        <div class="ds-examples__buttons">
          <DsButton v-for="size in ['small', 'medium', 'large']" :key="size" :size="size">{{ size.charAt(0).toUpperCase() + size.slice(1) }}</DsButton>
        </div>
      </div>
      <div class="ds-examples__split">
        <div class="ds-examples__sample">
          <span class="ds-examples__label">Icon and grouped actions</span>
          <div class="ds-button-group" role="group" aria-label="Document actions">
            <DsButton icon-only label="Add item">+</DsButton>
            <DsButton variant="outline">Duplicate</DsButton>
            <DsButton variant="ghost">Share</DsButton>
          </div>
        </div>
        <div class="ds-examples__sample">
          <span class="ds-examples__label">Toggle button group</span>
          <DsToggleGroup v-model="alignment" :items="toggleItems" label="Text alignment" />
        </div>
      </div>
    </div>
  </section>
</template>
