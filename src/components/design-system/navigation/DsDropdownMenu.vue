<script setup>
import { inject } from 'vue'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'
import { DS_PORTAL_ROOT } from '../dsContext.js'

defineProps({ label: { type: String, default: 'Open menu' }, items: { type: Array, required: true } })
const emit = defineEmits(['select'])
const portalRoot = inject(DS_PORTAL_ROOT, undefined)
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger class="ds-menu__trigger" data-ds-component="DsDropdownMenu">{{ label }} <span aria-hidden="true">⌄</span></DropdownMenuTrigger>
    <DropdownMenuPortal :to="portalRoot">
      <DropdownMenuContent class="ds-menu__content" :side-offset="6" align="start">
        <DropdownMenuLabel class="ds-menu__label">Project actions</DropdownMenuLabel>
        <template v-for="item in items" :key="item.value">
          <DropdownMenuSeparator v-if="item.separator" class="ds-menu__separator" />
          <DropdownMenuItem v-else class="ds-menu__item" :disabled="item.disabled" @select="emit('select', item.value)">{{ item.label }}<span v-if="item.shortcut">{{ item.shortcut }}</span></DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
