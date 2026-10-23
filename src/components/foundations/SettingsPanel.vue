<script setup>
// Gestiona preferencias persistentes y el ciclo accesible del diálogo de ajustes.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Trash2, X } from '@lucide/vue'
import DcButton from '../ui/DcButton.vue'
import { getStylesheetFilenames, normalizeStylesheetName } from '../../utils/cssExport.js'

const props = defineProps({
  theme: { type: String, required: true },
  exportPreferences: { type: Object, required: true },
})
const emit = defineEmits(['close', 'theme', 'update:export-preferences', 'reset', 'projectName'])
const dialog = ref(null)
const projectName = ref(localStorage.getItem('design-crafter-project-name') || 'Demo Design System')
const projectInput = ref(null)
const resetRequested = ref(false)
const stylesheetName = computed(() => props.exportPreferences.stylesheetName ?? 'design-crafter')
const normalizedStylesheetName = computed(() => normalizeStylesheetName(stylesheetName.value))
const stylesheetFilenames = computed(() => getStylesheetFilenames(stylesheetName.value))

function updateProjectName(value) {
  projectName.value = value
  localStorage.setItem('design-crafter-project-name', value)
  emit('projectName', value)
}

function updatePreference(key, value) {
  // Emite una copia para que el padre persista preferencias sin mutar la prop recibida.
  emit('update:export-preferences', { ...props.exportPreferences, [key]: value })
}

function updateStylesheetName(value) {
  updatePreference('stylesheetName', value)
}

function close() { emit('close') }
function handleEscape(event) {
  if (event.key !== 'Escape' || !dialog.value?.open) return
  event.preventDefault()
  close()
}

onMounted(async () => {
  // Abre el diálogo nativo y sitúa el foco en el primer campo cuando el contenido ya está montado.
  document.addEventListener('keydown', handleEscape)
  await nextTick()
  dialog.value?.showModal()
  projectInput.value?.focus()
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  if (dialog.value?.open) dialog.value.close()
  requestAnimationFrame(() => document.querySelector('.foundation-panel__actions .foundation-action:last-child')?.focus())
})
</script>

<template>
  <dialog ref="dialog" class="settings-dialog" aria-labelledby="settings-title" @cancel.prevent="close" @click.self="close">
    <header class="settings-dialog__header"><div><p class="eyebrow">Design Crafter</p><h2 id="settings-title">Settings</h2></div><button class="icon-button" type="button" aria-label="Close settings" @click="close"><X :size="18" /></button></header>
    <div class="settings-dialog__body">
      <label class="settings-field"><span>Project name</span><input ref="projectInput" :value="projectName" maxlength="80" @input="updateProjectName($event.target.value)" /></label>
      <fieldset class="settings-field"><legend>Interface theme</legend><div class="settings-choice"><button type="button" :aria-pressed="theme === 'light'" @click="emit('theme', 'light')">Light</button><button type="button" :aria-pressed="theme === 'dark'" @click="emit('theme', 'dark')">Dark</button></div></fieldset>
      <fieldset class="settings-field"><legend>CSS export unit</legend><div class="settings-choice"><button type="button" :aria-pressed="exportPreferences.unit === 'rem'" @click="updatePreference('unit', 'rem')">rem</button><button type="button" :aria-pressed="exportPreferences.unit === 'px'" @click="updatePreference('unit', 'px')">px</button></div></fieldset>
      <label class="settings-check"><input type="checkbox" :checked="exportPreferences.includeComments" @change="updatePreference('includeComments', $event.target.checked)" /><span>Include comments in exported CSS</span></label>
      <section class="settings-css-export" aria-labelledby="settings-css-export-title">
        <div><h3 id="settings-css-export-title">CSS export</h3><p>Choose the base name used for both exported stylesheets.</p></div>
        <label class="settings-field"><span>Stylesheet name</span><input :value="stylesheetName" maxlength="100" @input="updateStylesheetName($event.target.value)" /><span class="settings-field__helper">Used as the base name for exported CSS files.</span></label>
        <p class="settings-filename-normalized">Normalized name: <code>{{ normalizedStylesheetName }}</code></p>
        <div class="settings-filename-preview" aria-live="polite"><span>File names</span><code>{{ stylesheetFilenames.tokens }}</code><code>{{ stylesheetFilenames.complete }}</code></div>
      </section>
      <section class="settings-reset" aria-labelledby="settings-reset-title"><div><h3 id="settings-reset-title">Reset Foundations</h3><p>Restore Colors, Typography, Spacing and Border Radius to their initial values.</p></div><DcButton v-if="!resetRequested" class="settings-reset__action" variant="danger" size="medium" @click="resetRequested = true"><Trash2 :size="16" aria-hidden="true" />Reset</DcButton><div v-else class="settings-reset__confirm"><span>Reset all values?</span><DcButton variant="secondary" size="small" @click="resetRequested = false">Cancel</DcButton><DcButton class="settings-reset__action" variant="danger" size="small" @click="emit('reset'); resetRequested = false"><Trash2 :size="16" aria-hidden="true" />Confirm reset</DcButton></div></section>
    </div>
  </dialog>
</template>
