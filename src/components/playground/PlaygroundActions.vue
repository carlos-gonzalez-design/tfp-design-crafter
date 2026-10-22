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
      description="A clear action hierarchy keeps the next step obvious while secondary choices remain available."
    />
    <div class="ds-action-composition">
      <section class="ds-action-composition__stage" aria-labelledby="action-hierarchy-title">
        <div class="ds-action-composition__heading">
          <div>
            <span class="ds-examples__label">Action hierarchy</span>
            <h4 id="action-hierarchy-title">One clear primary action, supported by quieter choices.</h4>
          </div>
          <span class="ds-action-composition__hint">Click any component to inspect its tokens</span>
        </div>
        <div class="ds-action-composition__rows">
          <div class="ds-examples__buttons">
            <DsButton @click="announce('Primary button')">Primary Button</DsButton>
            <DsButton variant="secondary" @click="announce('Secondary button')">Secondary Button</DsButton>
            <DsButton variant="tertiary" @click="announce('Tertiary button')">Tertiary Button</DsButton>
            <DsButton variant="outline" @click="announce('Outline button')">Outline Button</DsButton>
          </div>
          <div class="ds-examples__buttons">
            <DsButton variant="ghost" @click="announce('Ghost button')">Ghost Button</DsButton>
            <DsButton variant="destructive" @click="announce('Delete item')">Delete Item</DsButton>
            <DsButton disabled>Disabled Button</DsButton>
            <DsButton loading>Saving</DsButton>
          </div>
        </div>
      </section>

      <section class="ds-action-composition__sizes" aria-labelledby="button-sizes-title">
        <div>
          <span class="ds-examples__label">Button sizes</span>
          <h4 id="button-sizes-title">The same priority at every scale.</h4>
        </div>
        <div class="ds-examples__buttons">
          <DsButton v-for="size in ['small', 'medium', 'large']" :key="size" :size="size" @click="announce(`${size} button`)">{{ size.charAt(0).toUpperCase() + size.slice(1) }}</DsButton>
        </div>
      </section>

      <div class="ds-action-composition__utilities">
        <section class="ds-action-composition__utility" aria-labelledby="grouped-actions-title">
          <div>
            <span class="ds-examples__label">Icon and grouped actions</span>
            <h4 id="grouped-actions-title">Compose related actions.</h4>
          </div>
          <div class="ds-button-group" role="group" aria-label="Document actions">
            <DsButton icon-only label="Add item" @click="announce('Add item')"><Plus :size="18" aria-hidden="true" /></DsButton>
            <DsButton variant="outline" @click="announce('Duplicate')">Duplicate</DsButton>
            <DsButton variant="ghost" @click="announce('Share')">Share</DsButton>
          </div>
        </section>
        <section class="ds-action-composition__utility" aria-labelledby="toggle-actions-title">
          <div>
            <span class="ds-examples__label">Toggle button group</span>
            <h4 id="toggle-actions-title">Keep mode changes compact.</h4>
          </div>
          <DsToggleGroup v-model="alignment" :items="toggleItems" label="Text alignment" />
        </section>
      </div>
      <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    </div>
  </section>
</template>
