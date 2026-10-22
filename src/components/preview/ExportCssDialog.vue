<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Braces, Check, Copy, Download, FileText, Layers, X } from '@lucide/vue'
import DcButton from '../ui/DcButton.vue'
import { generateCssExport, getStylesheetFilenames } from '../../utils/cssExport.js'

const props = defineProps({
  cssVariables: { type: Object, required: true },
  theme: { type: String, required: true },
  projectName: { type: String, required: true },
  stylesheetName: { type: String, default: 'design-crafter' },
  preferences: { type: Object, required: true },
})
const emit = defineEmits(['close'])
const dialog = ref(null)
const selectedType = ref('tokens')
const copied = ref(false)
let copiedTimer
const generatedCss = computed(() => generateCssExport({
  variables: props.cssVariables,
  type: selectedType.value,
  theme: props.theme,
  projectName: props.projectName,
  ...props.preferences,
}))
const filenames = computed(() => getStylesheetFilenames(props.stylesheetName))
const filename = computed(() => filenames.value[selectedType.value])

function close() { emit('close') }
async function copyCss() {
  await navigator.clipboard.writeText(generatedCss.value)
  copied.value = true
  window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => { copied.value = false }, 1800)
}
function downloadCss() {
  const blob = new Blob([generatedCss.value], { type: 'text/css;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename.value
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
function handleEscape(event) {
  if (event.key !== 'Escape' || !dialog.value?.open) return
  event.preventDefault()
  close()
}

onMounted(async () => { document.addEventListener('keydown', handleEscape); await nextTick(); dialog.value?.showModal(); dialog.value?.querySelector('button')?.focus() })
onBeforeUnmount(() => { document.removeEventListener('keydown', handleEscape); window.clearTimeout(copiedTimer); if (dialog.value?.open) dialog.value.close() })
</script>

<template>
  <dialog ref="dialog" class="export-dialog" aria-labelledby="export-dialog-title" @cancel.prevent="close" @click.self="close">
    <header class="export-dialog__header"><div><p class="eyebrow">CSS export</p><h2 id="export-dialog-title">Export your design system</h2></div><button class="icon-button" type="button" aria-label="Close export dialog" @click="close"><X :size="18" /></button></header>
    <div class="export-dialog__body">
      <div class="export-dialog__options" role="radiogroup" aria-label="CSS export contents">
        <label class="export-option" :class="{ 'export-option--selected': selectedType === 'tokens' }">
          <input v-model="selectedType" class="export-option__radio" type="radio" name="export-type" value="tokens" />
          <span class="export-option__icon" aria-hidden="true"><Braces :size="20" /></span>
          <span class="export-option__content">
            <strong class="export-option__title">Tokens only</strong>
            <span class="export-option__description">Current color, typography, spacing, radius and semantic tokens.</span>
            <span class="export-option__file"><FileText :size="13" aria-hidden="true" /><code>{{ filenames.tokens }}</code></span>
          </span>
        </label>
        <label class="export-option" :class="{ 'export-option--selected': selectedType === 'complete' }">
          <input v-model="selectedType" class="export-option__radio" type="radio" name="export-type" value="complete" />
          <span class="export-option__icon" aria-hidden="true"><Layers :size="20" /></span>
          <span class="export-option__content">
            <strong class="export-option__title">Tokens + components</strong>
            <span class="export-option__description">Tokens, base styles, components, variants, states and dark mode.</span>
            <span class="export-option__file"><FileText :size="13" aria-hidden="true" /><code>{{ filenames.complete }}</code></span>
          </span>
        </label>
      </div>
      <section class="export-preview" aria-labelledby="export-preview-title"><div class="export-preview__heading"><h3 id="export-preview-title">Preview</h3><span>{{ filename }}</span></div><pre><code>{{ generatedCss }}</code></pre></section>
    </div>
    <footer class="export-dialog__footer"><span class="export-dialog__copied" aria-live="polite">{{ copied ? 'Copied' : '' }}</span><DcButton variant="secondary" size="medium" @click="copyCss"><Check v-if="copied" :size="16" /><Copy v-else :size="16" />{{ copied ? 'Copied' : 'Copy CSS' }}</DcButton><DcButton variant="primary" size="medium" @click="downloadCss"><Download :size="16" />Download CSS</DcButton></footer>
  </dialog>
</template>
