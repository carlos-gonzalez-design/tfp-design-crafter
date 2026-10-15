<script setup>
defineProps({ lines: { type: Number, default: 3 } })
</script>

<template><div class="ds-skeleton" aria-label="Loading content" aria-busy="true" data-ds-component="DsSkeleton"><span class="ds-skeleton__media"></span><span v-for="line in lines" :key="line" class="ds-skeleton__line"></span></div></template>
