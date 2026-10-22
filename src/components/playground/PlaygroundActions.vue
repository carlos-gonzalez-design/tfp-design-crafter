<script setup>
import { ref } from 'vue'
import { Plus } from '@lucide/vue'
import DsButton from '../design-system/actions/DsButton.vue'
import DsToggleGroup from '../design-system/actions/DsToggleGroup.vue'
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'

const alignment = ref('left')
const announcement = ref('')
const toggleItems = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

function announce(message) {
  announcement.value = `${message} activated`
}
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
        <DsButton @click="announce('Primary button')">Primary Button</DsButton>
        <DsButton variant="secondary" @click="announce('Secondary button')">Secondary Button</DsButton>
        <DsButton variant="tertiary" @click="announce('Tertiary button')">Tertiary Button</DsButton>
        <DsButton variant="outline" @click="announce('Outline button')">Outline Button</DsButton>
        <DsButton variant="ghost" @click="announce('Ghost button')">Ghost Button</DsButton>
        <DsButton variant="destructive" @click="announce('Delete item')">Delete Item</DsButton>
        <DsButton disabled>Disabled Button</DsButton>
        <DsButton loading>Saving</DsButton>
      </div>
      <div class="ds-examples__sample">
        <span class="ds-examples__label">Button sizes</span>
        <div class="ds-examples__buttons">
          <DsButton v-for="size in ['small', 'medium', 'large']" :key="size" :size="size" @click="announce(`${size} button`)">{{ size.charAt(0).toUpperCase() + size.slice(1) }}</DsButton>
        </div>
      </div>
      <div class="ds-examples__split">
        <div class="ds-examples__sample">
          <span class="ds-examples__label">Icon and grouped actions</span>
          <div class="ds-button-group" role="group" aria-label="Document actions">
            <DsButton icon-only label="Add item" @click="announce('Add item')"><Plus :size="18" aria-hidden="true" /></DsButton>
            <DsButton variant="outline" @click="announce('Duplicate')">Duplicate</DsButton>
            <DsButton variant="ghost" @click="announce('Share')">Share</DsButton>
          </div>
        </div>
        <div class="ds-examples__sample">
          <span class="ds-examples__label">Toggle button group</span>
          <DsToggleGroup v-model="alignment" :items="toggleItems" label="Text alignment" />
        </div>
      </div>
      <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    </div>
  </section>
</template>
