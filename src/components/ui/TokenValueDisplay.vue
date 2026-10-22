<script setup>
import { computed, onBeforeUnmount, ref, useId } from 'vue'

const props = defineProps({
  value: { type: [String, Number], required: true },
  resolvedValue: { type: [String, Number], default: '' },
  color: { type: String, default: '' },
})

const expanded = ref(false)
const copied = ref(false)
const detailsId = `token-css-${useId()}`
let confirmationTimer = null

const originalValue = computed(() => String(props.value))
const shortValue = computed(() => {
  const original = originalValue.value.trim()
  const resolved = String(props.resolvedValue ?? '').trim()

  if (resolved && resolved !== original && !/^(?:var|color-mix)\(/.test(resolved)) return resolved
  if (original.startsWith('color-mix(')) return 'color-mix(…)'
  if (original.startsWith('var(')) return resolved && resolved !== original ? resolved : 'var(…)'
  return original.length > 38 ? `${original.slice(0, 35)}…` : original
})

async function copyOriginalValue() {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
    await navigator.clipboard.writeText(originalValue.value)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = originalValue.value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()
    const copiedWithFallback = document.execCommand('copy')
    textarea.remove()
    if (!copiedWithFallback) return
  }

  copied.value = true
  window.clearTimeout(confirmationTimer)
  confirmationTimer = window.setTimeout(() => { copied.value = false }, 1600)
}

onBeforeUnmount(() => window.clearTimeout(confirmationTimer))
</script>

<template>
  <div class="token-value" :class="{ 'token-value--color': color }">
    <span
      v-if="color"
      class="token-value__swatch"
      :style="{ '--token-value-color': color }"
      aria-hidden="true"
    ></span>
    <div class="token-value__body">
      <div class="token-value__summary-row">
        <code class="token-value__summary">{{ shortValue }}</code>
        <span class="token-value__actions">
          <button
            type="button"
            :aria-expanded="expanded"
            :aria-controls="detailsId"
            @click="expanded = !expanded"
          >{{ expanded ? 'Ocultar valor CSS' : 'Ver valor CSS' }}</button>
          <button type="button" @click="copyOriginalValue">{{ copied ? 'Copiado' : 'Copiar CSS' }}</button>
        </span>
      </div>
      <pre v-if="expanded" :id="detailsId" class="token-value__original"><code>{{ originalValue }}</code></pre>
      <span class="sr-only" aria-live="polite">{{ copied ? 'Valor CSS copiado' : '' }}</span>
    </div>
  </div>
</template>
