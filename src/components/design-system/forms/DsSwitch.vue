<script setup>
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="ds-switch-control">
    <SwitchRoot
      class="ds-switch"
      :model-value="modelValue"
      :disabled="disabled"
      data-ds-component="DsSwitch"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <SwitchThumb class="ds-switch__thumb" />
    </SwitchRoot>
    <span>{{ label }}</span>
  </label>
</template>
