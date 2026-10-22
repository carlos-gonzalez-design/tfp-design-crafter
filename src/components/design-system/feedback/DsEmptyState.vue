<script setup>
import { Inbox } from '@lucide/vue'

defineProps({ title: { type: String, required: true }, description: { type: String, required: true } })
</script>

<template><div class="ds-empty-state" data-ds-component="DsEmptyState"><span class="ds-empty-state__icon" aria-hidden="true"><Inbox :size="24" /></span><strong>{{ title }}</strong><p>{{ description }}</p><slot /></div></template>
