<script setup>
defineProps({ items: { type: Array, required: true }, label: { type: String, default: 'Breadcrumb' } })
</script>

<template>
  <nav class="ds-breadcrumbs" :aria-label="label" data-ds-component="DsBreadcrumbs">
    <ol class="ds-breadcrumbs__list">
      <li v-for="(item, index) in items" :key="item.label" class="ds-breadcrumbs__item">
        <a v-if="index < items.length - 1" class="ds-breadcrumbs__link" :href="item.href || '#'">{{ item.label }}</a>
        <span v-else aria-current="page">{{ item.label }}</span>
        <span v-if="index < items.length - 1" class="ds-breadcrumbs__separator" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>
