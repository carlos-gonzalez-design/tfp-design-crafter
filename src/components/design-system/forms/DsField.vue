<script setup>
import { CircleAlert } from '@lucide/vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
})
</script>

<template>
  <div class="ds-field" :class="{ 'ds-field--invalid': error }" data-ds-component="DsField">
    <label class="ds-field__label" :for="id">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <slot :describedby="error ? `${id}-error` : description ? `${id}-description` : undefined" />
    <div class="ds-field__message">
      <p v-if="description && !error" :id="`${id}-description`" class="ds-field__description">{{ description }}</p>
      <p v-if="error" :id="`${id}-error`" class="ds-field__error" role="alert">
        <CircleAlert aria-hidden="true" />
        <span>{{ error }}</span>
      </p>
    </div>
  </div>
</template>
