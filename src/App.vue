<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import FoundationPanel from './components/foundations/FoundationPanel.vue'
import FoundationOverview from './components/foundations/FoundationOverview.vue'
import FoundationWorkspace from './components/foundations/FoundationWorkspace.vue'
import PreviewCanvas from './components/preview/PreviewCanvas.vue'
import UiKitPage from './pages/UiKitPage.vue'
import { createDesignTokens } from './utils/designTokens.js'

const foundations = reactive({
  colors: {
    primary: '#4353FF',
    secondary: '#FF5C35',
    background: '#F7F7F8',
    surface: '#FFFFFF',
    text: '#18181B',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    baseSize: 16,
    scaleRatio: 1.25,
    semanticStyles: {
      h1: { size: '3xl', weight: '700' },
      h2: { size: '2xl', weight: '700' },
      h3: { size: 'xl', weight: '600' },
      bodyLarge: { size: 'lg', weight: '400' },
      body: { size: 'base', weight: '400' },
      small: { size: 'sm', weight: '400' },
      caption: { size: 'xs', weight: '400' },
    },
  },
  spacing: { density: 'default' },
  radius: { button: 'rounded', card: 'rounded', input: 'subtle' },
})

const designSystem = reactive({
  name: 'Demo Design System',
  description: 'A flexible visual language built from connected color, type, spacing and radius foundations.',
})

const currentPath = ref(window.location.pathname)
const activeFoundation = ref(null)
const isPreviewExpanded = ref(false)
const mobileView = ref('editor')
const isUiKit = computed(() => currentPath.value.replace(/\/$/, '') === '/ui-kit')
const cssVariables = computed(() => createDesignTokens(foundations))

function syncPath() {
  currentPath.value = window.location.pathname
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function navigate(event, path) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (path === '/') isPreviewExpanded.value = false
  if (window.location.pathname !== path) window.history.pushState({}, '', path)
  syncPath()
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

onMounted(() => window.addEventListener('popstate', syncPath))
onBeforeUnmount(() => window.removeEventListener('popstate', syncPath))
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <a class="app-header__brand" href="/" @click="navigate($event, '/')">Design Crafter</a>
      <span class="app-header__label">Visual Design Playground</span>
      <nav class="app-header__nav" aria-label="Main navigation">
        <a href="/" :aria-current="!isUiKit ? 'page' : undefined" @click="navigate($event, '/')">Dashboard</a>
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
