<script setup>
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="ds-check-control">
    <CheckboxRoot
      class="ds-checkbox"
      :model-value="modelValue"
      :disabled="disabled"
      data-ds-component="DsCheckbox"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <CheckboxIndicator class="ds-checkbox__indicator">✓</CheckboxIndicator>
    </CheckboxRoot>
    <span>{{ label }}</span>
  </label>
</template>
