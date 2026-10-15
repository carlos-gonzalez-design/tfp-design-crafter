<script setup>
import { inject } from 'vue'
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { DS_PORTAL_ROOT } from '../dsContext.js'

defineProps({ triggerLabel: { type: String, default: 'Open popover' }, title: { type: String, required: true } })
const portalRoot = inject(DS_PORTAL_ROOT, undefined)
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger class="ds-button ds-button--outline ds-button--medium" data-ds-component="DsPopover">{{ triggerLabel }}</PopoverTrigger>
    <PopoverPortal :to="portalRoot">
      <PopoverContent class="ds-popover__content" :side-offset="6" align="start">
        <strong>{{ title }}</strong><div class="ds-popover__body"><slot /></div>
        <PopoverClose class="ds-dialog__close" aria-label="Close popover">×</PopoverClose><PopoverArrow class="ds-popover__arrow" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
