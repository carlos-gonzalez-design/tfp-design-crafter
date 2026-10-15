<script setup>
import { PaginationEllipsis, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, PaginationRoot } from 'reka-ui'

defineProps({
  page: { type: Number, default: 1 },
  total: { type: Number, default: 100 },
  itemsPerPage: { type: Number, default: 10 },
})

const emit = defineEmits(['update:page'])
</script>

<template>
  <PaginationRoot
    class="ds-pagination"
    :page="page"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="1"
    show-edges
    data-ds-component="DsPagination"
    @update:page="emit('update:page', $event)"
  >
    <PaginationList v-slot="{ items }" class="ds-pagination__list">
      <PaginationPrev class="ds-pagination__item" aria-label="Previous page">←</PaginationPrev>
      <template v-for="(item, index) in items" :key="item.type === 'page' ? item.value : `ellipsis-${index}`">
        <PaginationListItem v-if="item.type === 'page'" class="ds-pagination__item" :value="item.value">{{ item.value }}</PaginationListItem>
        <PaginationEllipsis v-else class="ds-pagination__ellipsis" :index="index">…</PaginationEllipsis>
      </template>
      <PaginationNext class="ds-pagination__item" aria-label="Next page">→</PaginationNext>
    </PaginationList>
  </PaginationRoot>
</template>
