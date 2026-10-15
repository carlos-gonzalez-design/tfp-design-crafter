<script setup>
defineProps({ variant: { type: String, default: 'primary', validator: value => ['primary', 'secondary', 'neutral', 'success', 'danger'].includes(value) } })
</script>

<template><span class="ds-badge" :class="`ds-badge--${variant}`" data-ds-component="DsBadge" :data-ds-variant="variant"><slot /></span></template>
