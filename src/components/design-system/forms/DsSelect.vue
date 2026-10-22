<script setup>
import { inject } from 'vue'
import { Check, ChevronDown } from '@lucide/vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { DS_PORTAL_ROOT } from '../dsContext.js'

defineProps({
  id: { type: String, default: undefined },
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true },
  label: { type: String, required: true },
  placeholder: { type: String, default: 'Select an option' },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  describedby: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue'])
const portalRoot = inject(DS_PORTAL_ROOT, undefined)
</script>

<template>
  <SelectRoot :model-value="modelValue" :disabled="disabled" @update:model-value="emit('update:modelValue', $event)">
    <SelectTrigger
      :id="id"
      class="ds-select__trigger"
      :aria-label="label"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedby"
      data-ds-component="DsSelect"
    >
      <SelectValue :placeholder="placeholder" />
      <SelectIcon class="ds-select__icon" aria-hidden="true"><ChevronDown :size="18" /></SelectIcon>
    </SelectTrigger>
    <SelectPortal :to="portalRoot">
      <SelectContent class="ds-select__content ds-overlay" position="popper" :side-offset="6">
        <SelectViewport class="ds-select__viewport">
          <SelectItem v-for="option in options" :key="option.value" class="ds-select__item" :value="option.value" :disabled="option.disabled">
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator class="ds-select__indicator" aria-hidden="true"><Check :size="16" /></SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
