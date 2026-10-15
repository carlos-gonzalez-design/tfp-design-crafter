<script setup>
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

defineProps({
  modelValue: { type: [String, Array], default: '' },
  items: { type: Array, required: true },
  type: { type: String, default: 'single', validator: value => ['single', 'multiple'].includes(value) },
  label: { type: String, default: 'Toggle options' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <ToggleGroupRoot
    class="ds-toggle-group"
    :type="type"
    :model-value="modelValue"
    :disabled="disabled"
    :aria-label="label"
    data-ds-component="DsToggleGroup"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <ToggleGroupItem
      v-for="item in items"
      :key="item.value"
      class="ds-toggle-group__item"
      :value="item.value"
      :disabled="item.disabled"
      :aria-label="item.ariaLabel || item.label"
    >{{ item.label }}</ToggleGroupItem>
  </ToggleGroupRoot>
</template>
