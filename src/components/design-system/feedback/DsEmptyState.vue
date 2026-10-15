<script setup>
defineProps({ title: { type: String, required: true }, description: { type: String, required: true } })
</script>

<template><div class="ds-empty-state" data-ds-component="DsEmptyState"><span class="ds-empty-state__icon" aria-hidden="true">◇</span><strong>{{ title }}</strong><p>{{ description }}</p><slot /></div></template>
