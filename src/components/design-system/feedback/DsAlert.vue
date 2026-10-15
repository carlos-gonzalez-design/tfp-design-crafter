<script setup>
defineProps({ title: { type: String, required: true }, variant: { type: String, default: 'info', validator: value => ['info', 'success', 'warning', 'danger'].includes(value) } })
</script>

<template>
  <div class="ds-alert" :class="`ds-alert--${variant}`" role="status" data-ds-component="DsAlert" :data-ds-variant="variant">
    <span class="ds-alert__icon" aria-hidden="true">{{ variant === 'success' ? '✓' : variant === 'danger' ? '!' : 'i' }}</span>
    <div><strong>{{ title }}</strong><div class="ds-alert__body"><slot /></div></div>
  </div>
</template>
