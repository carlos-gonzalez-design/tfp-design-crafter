<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import FoundationPanel from '../components/foundations/FoundationPanel.vue'
import FoundationOverview from '../components/foundations/FoundationOverview.vue'
import FoundationWorkspace from '../components/foundations/FoundationWorkspace.vue'
import PreviewCanvas from '../components/preview/PreviewCanvas.vue'
import UiKitPage from '../pages/UiKitPage.vue'
import { createDefaultDesignSystem, createDefaultFoundations } from '../data/defaultDesignSystem.js'
import { createDesignTokens } from '../utils/designTokens.js'
import ExportCssDialog from '../components/preview/ExportCssDialog.vue'
import SettingsPanel from '../components/foundations/SettingsPanel.vue'
import ThemeControl from '../components/foundations/ThemeControl.vue'
import UserSession from '../components/foundations/UserSession.vue'
import { useSyncStatus } from '../composables/useSyncStatus.js'

const props = defineProps({
  currentPath: { type: String, required: true },
})

const emit = defineEmits(['navigate'])
const foundations = reactive(createDefaultFoundations())
const designSystem = reactive(createDefaultDesignSystem())
const activeFoundation = ref(null)
const mobileView = ref('editor')
const theme = ref(localStorage.getItem('design-crafter-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
const isSettingsOpen = ref(false)
const isExportOpen = ref(false)
const exportPreferences = reactive({ unit: 'rem', includeComments: true, stylesheetName: 'design-crafter' })
const syncStatus = useSyncStatus(foundations)
const isUiKit = computed(() => props.currentPath.replace(/\/$/, '') === '/ui-kit')
const cssVariables = computed(() => createDesignTokens(foundations))

function navigate(event, path) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  emit('navigate', path)
}

function setTheme(value) {
  theme.value = value
  localStorage.setItem('design-crafter-theme', value)
}

function updateExportPreferences(value) {
  Object.assign(exportPreferences, value)
  localStorage.setItem('design-crafter-export-preferences', JSON.stringify(exportPreferences))
}

function closeExport() {
  isExportOpen.value = false
  requestAnimationFrame(() => document.querySelector('.export-css-button')?.focus())
}

function resetFoundations() {
  const defaults = createDefaultFoundations()
  for (const key of Object.keys(foundations)) {
    if (typeof foundations[key] === 'object') Object.assign(foundations[key], defaults[key])
    else foundations[key] = defaults[key]
  }
}

function selectFoundation(foundation) {
  activeFoundation.value = foundation
  mobileView.value = 'editor'
}

onMounted(() => {
  designSystem.name = localStorage.getItem('design-crafter-project-name') || designSystem.name
  try { Object.assign(exportPreferences, JSON.parse(localStorage.getItem('design-crafter-export-preferences') || '{}')) } catch { /* Ignore a malformed optional preference. */ }
})
</script>

<template>
  <div class="app-shell" :class="[{ 'app-shell--dashboard': !isUiKit }, theme === 'dark' && 'dc-theme--dark']">
    <header class="app-header">
      <a class="app-header__brand" href="/app" aria-label="Design Crafter dashboard" @click="navigate($event, '/app')">
        <img :src="theme === 'dark' ? '/images/logo-design-crafter-dark.svg' : '/images/logo-design-crafter.svg'" alt="Design Crafter" />
      </a>
      <span class="app-header__label">Visual Design Playground</span>
      <nav class="app-header__nav" aria-label="Main navigation">
        <a href="/app" :aria-current="!isUiKit ? 'page' : undefined" @click="navigate($event, '/app')">Dashboard</a>
        <a href="/ui-kit" :aria-current="isUiKit ? 'page' : undefined" @click="navigate($event, '/ui-kit')">UI Kit</a>
      </nav>
      <div class="app-header__session-controls">
        <ThemeControl class="app-header__theme-control" :theme="theme" @change="setTheme" />
        <UserSession />
      </div>
    </header>
    <UiKitPage v-if="isUiKit" :css-variables="cssVariables" />
    <main
      v-else
      class="dashboard"
      :class="{
        'dashboard--mobile-preview': mobileView === 'preview',
      }"
    >
      <div class="dashboard__mobile-switch" role="group" aria-label="Dashboard view">
        <button type="button" :aria-pressed="mobileView === 'editor'" @click="mobileView = 'editor'">Editor</button>
        <button type="button" :aria-pressed="mobileView === 'preview'" @click="mobileView = 'preview'">Preview</button>
      </div>
      <FoundationPanel
        :active-foundation="activeFoundation"
        @select="selectFoundation"
        @settings="isSettingsOpen = true"
      />
      <div class="dashboard__editor-pane">
        <FoundationOverview
          v-if="activeFoundation === null"
          :design-system="designSystem"
          :foundations="foundations"
          @edit="selectFoundation"
        />
        <FoundationWorkspace
          v-else
          :active-foundation="activeFoundation"
          :foundations="foundations"
          :css-variables="cssVariables"
        />
      </div>
      <PreviewCanvas
        :css-variables="cssVariables"
        :theme="theme"
        :syncing="syncStatus.syncing.value"
        @export="isExportOpen = true"
      />
    </main>
    <SettingsPanel
      v-if="isSettingsOpen"
      :theme="theme"
      :export-preferences="exportPreferences"
      @close="isSettingsOpen = false"
      @theme="setTheme"
      @update:export-preferences="updateExportPreferences"
      @reset="resetFoundations"
      @project-name="designSystem.name = $event"
    />
    <ExportCssDialog
      v-if="isExportOpen"
      :css-variables="cssVariables"
      :theme="theme"
      :project-name="designSystem.name"
      :stylesheet-name="exportPreferences.stylesheetName"
      :preferences="exportPreferences"
      @close="closeExport"
    />
  </div>
</template>
