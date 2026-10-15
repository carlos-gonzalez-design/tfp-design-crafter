<script setup>
import { inject } from 'vue'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { DS_PORTAL_ROOT } from '../dsContext.js'

defineProps({ title: { type: String, required: true }, description: { type: String, required: true }, triggerLabel: { type: String, default: 'Open dialog' } })
const portalRoot = inject(DS_PORTAL_ROOT, undefined)
</script>

<template>
  <DialogRoot>
    <DialogTrigger class="ds-button ds-button--outline ds-button--medium" data-ds-component="DsDialog">{{ triggerLabel }}</DialogTrigger>
    <DialogPortal :to="portalRoot">
      <DialogOverlay class="ds-dialog__overlay" />
      <DialogContent class="ds-dialog__content">
        <DialogTitle class="ds-dialog__title">{{ title }}</DialogTitle>
        <DialogDescription class="ds-dialog__description">{{ description }}</DialogDescription>
        <slot />
        <div class="ds-dialog__actions"><DialogClose class="ds-button ds-button--primary ds-button--medium">Done</DialogClose></div>
        <DialogClose class="ds-dialog__close" aria-label="Close dialog">×</DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
