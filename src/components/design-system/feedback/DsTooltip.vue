<script setup>
import { inject } from 'vue'
import { CircleHelp } from '@lucide/vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { DS_PORTAL_ROOT } from '../dsContext.js'

defineProps({ content: { type: String, required: true }, label: { type: String, default: 'More information' } })
const portalRoot = inject(DS_PORTAL_ROOT, undefined)
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <TooltipRoot>
      <TooltipTrigger class="ds-icon-trigger" :aria-label="label" data-ds-component="DsTooltip"><CircleHelp :size="18" aria-hidden="true" /></TooltipTrigger>
      <TooltipPortal :to="portalRoot"><TooltipContent class="ds-tooltip__content" :side-offset="6">{{ content }}<TooltipArrow class="ds-tooltip__arrow" /></TooltipContent></TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
