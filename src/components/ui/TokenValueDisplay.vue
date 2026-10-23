<script setup>
// Presenta el valor efectivo de un alias cuando ya está resuelto y conserva la referencia si no lo está.
import { computed } from 'vue'

const props = defineProps({
  value: { type: [String, Number], required: true },
  resolvedValue: { type: [String, Number], default: '' },
  color: { type: String, default: '' },
})

const displayValue = computed(() => {
  const value = String(props.value)
  const resolved = String(props.resolvedValue ?? '').trim()
  return resolved && resolved !== value && !resolved.startsWith('var(') ? resolved : value
})
</script>

<template>
  <span class="token-value" :class="{ 'token-value--color': color }">
    <span
      v-if="color"
      class="token-value__swatch"
      :style="{ '--token-value-color': color }"
      aria-hidden="true"
    ></span>
    <code class="token-value__summary">{{ displayValue }}</code>
  </span>
</template>
