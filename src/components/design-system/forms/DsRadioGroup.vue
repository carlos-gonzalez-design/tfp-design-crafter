<script setup>
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'

defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <RadioGroupRoot
    class="ds-radio-group"
    :model-value="modelValue"
    :disabled="disabled"
    :aria-label="label"
    data-ds-component="DsRadioGroup"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <label v-for="option in options" :key="option.value" class="ds-check-control">
      <RadioGroupItem class="ds-radio" :value="option.value" :disabled="option.disabled">
        <RadioGroupIndicator class="ds-radio__indicator" />
      </RadioGroupItem>
      <span>{{ option.label }}</span>
    </label>
  </RadioGroupRoot>
</template>
