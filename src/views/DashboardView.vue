<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import FoundationPanel from '../components/foundations/FoundationPanel.vue'
import FoundationOverview from '../components/foundations/FoundationOverview.vue'
import FoundationWorkspace from '../components/foundations/FoundationWorkspace.vue'
import PreviewCanvas from '../components/preview/PreviewCanvas.vue'
import UiKitPage from '../pages/UiKitPage.vue'
import { createDefaultDesignSystem, createDefaultFoundations } from '../data/defaultDesignSystem.js'
import { createDesignTokens } from '../utils/designTokens.js'

const props = defineProps({
  currentPath: { type: String, required: true },
})

const emit = defineEmits(['navigate'])
const foundations = reactive(createDefaultFoundations())
const designSystem = reactive(createDefaultDesignSystem())
const activeFoundation = ref(null)
const isPreviewExpanded = ref(false)
const mobileView = ref('editor')
const isUiKit = computed(() => props.currentPath.replace(/\/$/, '') === '/ui-kit')
const cssVariables = computed(() => createDesignTokens(foundations))

function navigate(event, path) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (path === '/app') isPreviewExpanded.value = false
  emit('navigate', path)
}

async function setPreviewExpanded(expanded) {
  isPreviewExpanded.value = expanded
  await nextTick()
  window.scrollTo({ top: 0, behavior: 'instant' })
  document.querySelector('.preview-area__expand-action')?.focus()
}

function selectFoundation(foundation) {
  activeFoundation.value = foundation
  mobileView.value = 'editor'
}
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--dashboard': !isUiKit }">
    <header class="app-header">
      <a class="app-header__brand" href="/" @click="navigate($event, '/')">Design Crafter</a>
      <span class="app-header__label">Visual Design Playground</span>
      <nav class="app-header__nav" aria-label="Main navigation">
        <a href="/app" :aria-current="!isUiKit ? 'page' : undefined" @click="navigate($event, '/app')">Dashboard</a>
        <a href="/ui-kit" :aria-current="isUiKit ? 'page' : undefined" @click="navigate($event, '/ui-kit')">UI Kit</a>
      </nav>
    </header>
    <UiKitPage v-if="isUiKit" :css-variables="cssVariables" />
    <main
      v-else
      class="dashboard"
      :class="{
        'dashboard--preview-expanded': isPreviewExpanded,
        'dashboard--mobile-preview': mobileView === 'preview',
      }"
    >
      <div v-if="!isPreviewExpanded" class="dashboard__mobile-switch" role="group" aria-label="Dashboard view">
        <button type="button" :aria-pressed="mobileView === 'editor'" @click="mobileView = 'editor'">Editor</button>
        <button type="button" :aria-pressed="mobileView === 'preview'" @click="mobileView = 'preview'">Preview</button>
      </div>
      <FoundationPanel v-if="!isPreviewExpanded" :active-foundation="activeFoundation" @select="selectFoundation" />
      <div v-if="!isPreviewExpanded" class="dashboard__editor-pane">
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
        :expanded="isPreviewExpanded"
        @expand="setPreviewExpanded(true)"
        @collapse="setPreviewExpanded(false)"
      />
    </main>
  </div>
</template>
