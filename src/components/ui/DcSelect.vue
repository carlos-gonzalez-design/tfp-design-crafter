<script setup>
import {
  SelectRoot, SelectTrigger, SelectValue, SelectIcon, SelectPortal,
  SelectContent, SelectViewport, SelectItem, SelectItemText, SelectItemIndicator,
} from 'reka-ui'

defineProps({
  modelValue: { type: String, required: true },
  options: { type: Array, required: true },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  placeholder: { type: String, default: 'Select an option' },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <SelectRoot :model-value="modelValue" :disabled="disabled" :name="name" @update:model-value="emit('update:modelValue', $event)">
    <SelectTrigger class="dc-select__trigger" :aria-label="label">
      <SelectValue :placeholder="placeholder" />
      <SelectIcon class="dc-select__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent class="dc-select__content" position="popper" :side-offset="4">
        <SelectViewport class="dc-select__viewport">
          <SelectItem v-for="option in options" :key="option.value" class="dc-select__item" :value="option.value" :disabled="option.disabled">
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator class="dc-select__indicator" aria-hidden="true">✓</SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
