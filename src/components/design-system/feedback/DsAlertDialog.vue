<script setup>
import { inject } from 'vue'
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTitle, AlertDialogTrigger } from 'reka-ui'
import { DS_PORTAL_ROOT } from '../dsContext.js'

defineProps({ title: { type: String, required: true }, description: { type: String, required: true }, triggerLabel: { type: String, default: 'Delete project' } })
const emit = defineEmits(['confirm'])
const portalRoot = inject(DS_PORTAL_ROOT, undefined)
</script>

<template>
  <AlertDialogRoot>
    <AlertDialogTrigger class="ds-button ds-button--destructive ds-button--medium" data-ds-component="DsAlertDialog">{{ triggerLabel }}</AlertDialogTrigger>
    <AlertDialogPortal :to="portalRoot">
      <AlertDialogOverlay class="ds-dialog__overlay" />
      <AlertDialogContent class="ds-dialog__content">
        <AlertDialogTitle class="ds-dialog__title">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription class="ds-dialog__description">{{ description }}</AlertDialogDescription>
        <div class="ds-dialog__actions">
          <AlertDialogCancel class="ds-button ds-button--ghost ds-button--medium">Cancel</AlertDialogCancel>
          <AlertDialogAction class="ds-button ds-button--destructive ds-button--medium" @click="emit('confirm')">Delete</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
