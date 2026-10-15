<script setup>
defineProps({
  variant: { type: String, default: 'primary', validator: value => ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'destructive'].includes(value) },
  size: { type: String, default: 'medium', validator: value => ['small', 'medium', 'large'].includes(value) },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  iconOnly: { type: Boolean, default: false },
  label: { type: String, default: undefined },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    class="ds-button"
    :class="[`ds-button--${variant}`, `ds-button--${size}`, { 'ds-button--icon-only': iconOnly }]"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :aria-label="label"
    data-ds-component="DsButton"
    :data-ds-variant="variant"
    :data-ds-size="size"
    :data-ds-state="loading ? 'loading' : disabled ? 'disabled' : 'default'"
  >
    <span v-if="loading" class="ds-button__spinner" aria-hidden="true"></span>
    <slot name="icon" />
    <span v-if="!iconOnly" class="ds-button__label"><slot /></span>
    <slot v-else />
  </button>
</template>
