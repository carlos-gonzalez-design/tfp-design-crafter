<script setup>
defineProps({
  variant: { type: String, default: 'primary', validator: value => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value) },
  size: { type: String, default: 'medium', validator: value => ['small', 'medium', 'large'].includes(value) },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    class="dc-button"
    :class="[`dc-button--${variant}`, `dc-button--${size}`, { 'dc-button--loading': loading }]"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="dc-button__spinner" aria-hidden="true"></span>
    <span class="dc-button__label"><slot /></span>
  </button>
</template>
