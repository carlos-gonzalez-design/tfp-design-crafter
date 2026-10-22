<script setup>
import { inject, ref } from 'vue'
import { X } from '@lucide/vue'
import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'
import { DS_PORTAL_ROOT } from '../dsContext.js'

defineProps({ title: { type: String, required: true }, description: { type: String, required: true }, triggerLabel: { type: String, default: 'Show notification' } })
const open = ref(false)
const portalRoot = inject(DS_PORTAL_ROOT, undefined)
</script>

<template>
  <ToastProvider :duration="4000" label="Notification">
    <button class="ds-button ds-button--primary ds-button--medium" type="button" data-ds-component="DsToast" @click="open = false; $nextTick(() => open = true)">{{ triggerLabel }}</button>
    <Teleport v-if="portalRoot" :to="portalRoot">
      <ToastRoot v-model:open="open" class="ds-toast">
        <div><ToastTitle class="ds-toast__title">{{ title }}</ToastTitle><ToastDescription class="ds-toast__description">{{ description }}</ToastDescription></div>
        <ToastClose class="ds-toast__close" aria-label="Dismiss notification"><X :size="16" aria-hidden="true" /></ToastClose>
      </ToastRoot>
      <ToastViewport class="ds-toast__viewport" />
    </Teleport>
  </ToastProvider>
</template>
