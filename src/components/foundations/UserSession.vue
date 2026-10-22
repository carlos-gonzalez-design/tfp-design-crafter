<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { UserRound } from '@lucide/vue'

const open = ref(false)
const root = ref(null)
const trigger = ref(null)
const details = ref(null)

async function toggle() {
  open.value = !open.value
  if (open.value) {
    await nextTick()
    details.value?.focus()
  }
}

function close(restoreFocus = false) {
  if (!open.value) return
  open.value = false
  if (restoreFocus) nextTick(() => trigger.value?.focus())
}

function handlePointerDown(event) {
  if (open.value && !root.value?.contains(event.target)) close()
}

function handleKeydown(event) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close(true)
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handlePointerDown)
  document.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePointerDown)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="root" class="user-session-wrap">
    <button
      ref="trigger"
      class="user-session"
      type="button"
      aria-label="Designer user session"
      aria-haspopup="dialog"
      :aria-expanded="open"
      aria-controls="user-session-details"
      @click="toggle"
    >
      <span class="user-session__name">Designer</span>
      <span class="user-session__avatar" aria-hidden="true"><UserRound :size="16" /></span>
    </button>
    <div v-if="open" id="user-session-details" ref="details" class="user-session-popover" role="dialog" aria-label="User session" tabindex="-1">
      <span class="user-session__avatar user-session-popover__avatar" aria-hidden="true"><UserRound :size="18" /></span>
      <div class="user-session-popover__identity"><strong>Designer</strong><span>Local workspace</span></div>
      <span class="user-session-popover__status"><span aria-hidden="true"></span>Signed in</span>
    </div>
  </div>
</template>
