<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'
import { Download } from '@lucide/vue'
import DcButton from '../ui/DcButton.vue'
import { DS_PORTAL_ROOT } from '../design-system/dsContext.js'
import PlaygroundActions from '../playground/PlaygroundActions.vue'
import PlaygroundCards from '../playground/PlaygroundCards.vue'
import PlaygroundFeedback from '../playground/PlaygroundFeedback.vue'
import PlaygroundForms from '../playground/PlaygroundForms.vue'
import PlaygroundNavigation from '../playground/PlaygroundNavigation.vue'
import PlaygroundOverview from '../playground/PlaygroundOverview.vue'
import PlaygroundTypography from '../playground/PlaygroundTypography 2.vue'
import { PLAYGROUND_CATEGORIES } from '../playground/componentCatalog.js'
import {
  getComponentTokenNames,
  getInspectorTokenCategory,
} from '../../utils/componentInspector.js'
import ComponentInspector from './ComponentInspector.vue'
import PreviewNavigation from './PreviewNavigation.vue'

const props = defineProps({
  cssVariables: { type: Object, required: true },
  theme: { type: String, default: 'light' },
  syncing: { type: Boolean, default: false },
})

const emit = defineEmits(['export'])

const activeCategory = ref('typography')
const previewCanvas = ref(null)
const portalRoot = ref(null)
const inspectedElement = shallowRef(null)
const inspectorSelection = ref(null)
const selectionBounds = ref(null)
const hasSyncTransition = ref(false)
const categoryScrollPositions = new Map()
const categorySelections = new Map()
let selectionResizeObserver = null
let syncPulseTimer
const sections = Object.freeze({
  overview: PlaygroundOverview,
  typography: PlaygroundTypography,
  actions: PlaygroundActions,
  forms: PlaygroundForms,
  cards: PlaygroundCards,
  navigation: PlaygroundNavigation,
  feedback: PlaygroundFeedback,
})
const activeSection = computed(() => sections[activeCategory.value] ?? PlaygroundOverview)
const previewVariables = computed(() => props.theme === 'dark'
  ? {
      ...props.cssVariables,
      '--color-neutral-background': '#111113',
      '--color-neutral-surface': '#19191c',
      '--color-neutral-text': '#f5f5f5',
      '--color-neutral-muted': 'rgb(245 245 245 / 72%)',
      '--color-neutral-border': 'color-mix(in srgb, #f5f5f5 18%, #19191c)',
      '--color-neutral-white': '#f5f5f5',
      '--ds-color-background': 'var(--color-neutral-background)',
      '--ds-color-surface': 'var(--color-neutral-surface)',
      '--ds-color-text': 'var(--color-neutral-text)',
      '--ds-color-text-muted': 'var(--color-neutral-muted)',
      '--ds-color-border': 'var(--color-neutral-border)',
      '--ds-color-text-primary-default': 'var(--ds-color-text)',
      '--ds-color-text-secondary-default': 'var(--ds-color-text-muted)',
      '--ds-color-bg-canvas-default': 'var(--ds-color-background)',
      '--ds-color-bg-surface-default': 'var(--ds-color-surface)',
      '--ds-color-bg-surface-muted': 'color-mix(in srgb, var(--ds-color-text) 6%, var(--ds-color-surface))',
      '--ds-color-border-subtle': 'color-mix(in srgb, var(--ds-color-text) 12%, var(--ds-color-surface))',
      '--ds-color-border-secondary-default': 'color-mix(in srgb, var(--ds-color-text) 30%, var(--ds-color-surface))',
      '--ds-color-button-secondary-background-default': 'var(--color-neutral-surface)',
      '--ds-color-button-tertiary-background-hover': 'color-mix(in srgb, var(--color-primary-selected) 26%, var(--color-neutral-surface))',
      '--ds-color-badge-brand-background': 'color-mix(in srgb, var(--color-primary-selected) 26%, var(--color-neutral-surface))',
      '--ds-color-selection-background': 'color-mix(in srgb, var(--color-primary-selected) 26%, var(--color-neutral-surface))',
    }
  : props.cssVariables)

provide(DS_PORTAL_ROOT, portalRoot)

function resolveTokenReference(name, fallback, visited = new Set()) {
  if (visited.has(name)) return fallback
  visited.add(name)
  const value = props.cssVariables[name] ?? fallback
  const reference = String(value).trim().match(/^var\((--[^,)]+)(?:,[^)]+)?\)$/)
  return reference ? resolveTokenReference(reference[1], fallback, visited) : String(value).trim()
}

function colorToHex(color) {
  const rgb = color.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i)
  const srgb = color.match(/^color\(srgb\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i)
  const match = rgb ?? srgb
  if (!match) return color
  const alpha = match[4] === undefined ? 1 : Number.parseFloat(match[4])
  if (alpha === 0) return 'transparent'
  const multiplier = srgb ? 255 : 1
  const channels = match.slice(1, 4).map(channel => {
    const value = Math.min(255, Math.max(0, Math.round(Number.parseFloat(channel) * multiplier)))
    return value.toString(16).padStart(2, '0')
  })
  if (alpha < 1) channels.push(Math.round(alpha * 255).toString(16).padStart(2, '0'))
  return `#${channels.join('').toUpperCase()}`
}

function resolveColor(element, name) {
  const theme = element.closest('.ds-theme') ?? previewCanvas.value
  if (!theme) return { color: 'transparent', value: 'transparent' }
  const resolver = document.createElement('span')
  resolver.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;color:var(${name});`
  theme.append(resolver)
  const color = getComputedStyle(resolver).color
  resolver.remove()
  return { color, value: colorToHex(color) }
}

function resolveComputedValue(element, name) {
  const theme = element.closest('.ds-theme') ?? previewCanvas.value
  if (!theme) return ''
  const probe = document.createElement('span')
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;display:block;width:var(${name});height:0;`
  theme.append(probe)
  const value = getComputedStyle(probe).width
  probe.remove()
  return value
}

function isCalculatedValue(value) {
  return /\b(?:calc|clamp|min|max)\s*\(/i.test(value)
    || (value.match(/var\(/g) ?? []).length > 1
    || value.length > 40
}

function readSelection(element) {
  const component = element.dataset.dsComponent
  const style = getComputedStyle(element)
  const variant = element.dataset.dsVariant || 'default'
  const tokenNames = getComponentTokenNames(component, variant) ?? DEFAULT_INSPECTOR_TOKENS
  return {
    component,
    tokens: tokenNames.map(name => {
      const category = getInspectorTokenCategory(name)
      const fallback = style.getPropertyValue(name).trim() || '—'
      if (category === 'color') {
        const resolved = resolveColor(element, name)
        return { name, category, value: resolved.value, swatch: resolved.color }
      }
      const value = resolveTokenReference(name, fallback)
      const formula = String(props.cssVariables[name] ?? fallback)
      const calculated = isCalculatedValue(formula)
      return {
        name,
        category,
        value: calculated ? formula : value,
        formula: calculated ? formula : '',
        resolvedValue: calculated ? resolveComputedValue(element, name) : '',
      }
    }),
  }
}

function syncSelectionIndicator() {
  const element = inspectedElement.value
  const canvas = previewCanvas.value
  if (!element?.isConnected || !canvas) {
    selectionBounds.value = null
    return
  }
  const elementRect = element.getBoundingClientRect()
  const canvasRect = canvas.getBoundingClientRect()
  selectionBounds.value = {
    left: `${elementRect.left - canvasRect.left + canvas.scrollLeft}px`,
    top: `${elementRect.top - canvasRect.top + canvas.scrollTop}px`,
    width: `${elementRect.width}px`,
    height: `${elementRect.height}px`,
  }
}

function observeSelection(element) {
  selectionResizeObserver?.disconnect()
  if (!window.ResizeObserver) return
  selectionResizeObserver = new ResizeObserver(syncSelectionIndicator)
  selectionResizeObserver.observe(element)
}

function refreshSelection() {
  const element = inspectedElement.value
  if (!element?.isConnected) {
    inspectedElement.value = null
    inspectorSelection.value = null
    selectionBounds.value = null
    selectionResizeObserver?.disconnect()
    return
  }
  inspectorSelection.value = readSelection(element)
  syncSelectionIndicator()
}

function inspectComponent(event) {
  const element = event.target.closest?.('[data-ds-component]')
  if (!element || !event.currentTarget.contains(element)) return
  inspectedElement.value = element
  categorySelections.set(activeCategory.value, element)
  inspectorSelection.value = readSelection(element)
  observeSelection(element)
  syncSelectionIndicator()
  requestAnimationFrame(refreshSelection)
}

watch(() => props.cssVariables, async () => {
  await nextTick()
  refreshSelection()
}, { deep: true, flush: 'post' })

watch(() => props.theme, async () => {
  await nextTick()
  refreshSelection()
}, { flush: 'post' })

watch(() => props.syncing, () => {
  hasSyncTransition.value = true
  window.clearTimeout(syncPulseTimer)
  syncPulseTimer = window.setTimeout(() => { hasSyncTransition.value = false }, 550)
})

function rememberCategoryScroll() {
  const canvas = previewCanvas.value
  if (!canvas) return
  categoryScrollPositions.set(activeCategory.value, canvas.scrollTop)
}

watch(activeCategory, async (category, previousCategory) => {
  const canvas = previewCanvas.value
  if (canvas && previousCategory) categoryScrollPositions.set(previousCategory, canvas.scrollTop)
  inspectedElement.value = null
  inspectorSelection.value = null
  selectionBounds.value = null
  selectionResizeObserver?.disconnect()

  await nextTick()
  if (previewCanvas.value) previewCanvas.value.scrollTop = categoryScrollPositions.get(category) ?? 0
  const previousSelection = categorySelections.get(category)
  if (previousSelection?.isConnected) {
    inspectedElement.value = previousSelection
    inspectorSelection.value = readSelection(previousSelection)
    observeSelection(previousSelection)
    syncSelectionIndicator()
  }
})

onMounted(() => window.addEventListener('resize', syncSelectionIndicator))
onBeforeUnmount(() => {
  window.removeEventListener('resize', syncSelectionIndicator)
  selectionResizeObserver?.disconnect()
  window.clearTimeout(syncPulseTimer)
})
</script>

<template>
  <section class="preview-area" aria-labelledby="preview-title">
    <div class="preview-workspace">
      <div class="preview-workspace__main">
        <div class="preview-area__heading">
          <div>
            <p class="eyebrow">Live preview</p>
            <h2 id="preview-title" class="preview-area__title">Canvas</h2>
          </div>
          <div class="preview-area__actions">
            <span class="preview-area__status" :class="syncing ? 'preview-area__status--saving' : 'preview-area__status--synced'"><span :key="syncing ? 'saving' : 'synced'" class="preview-area__status-dot" :class="{ 'preview-area__status-dot--pulse': hasSyncTransition }"></span><span aria-live="polite">{{ syncing ? 'Saving…' : 'Synced' }}</span></span>
          </div>
        </div>
        <div class="dc-preview-tabs">
          <PreviewNavigation v-model="activeCategory" :categories="PLAYGROUND_CATEGORIES" />
          <div
            id="playground-panel"
            ref="previewCanvas"
            class="preview-canvas ds-preview ds-theme"
            :style="previewVariables"
            role="tabpanel"
            :aria-labelledby="`playground-tab-${activeCategory}`"
            tabindex="0"
            @scroll.passive="rememberCategoryScroll"
            @click.capture="inspectComponent"
            @focusin.capture="inspectComponent"
          >
            <KeepAlive>
              <component :is="activeSection" :key="activeCategory" />
            </KeepAlive>
            <span
              v-if="selectionBounds"
              class="preview-selection-indicator"
              :style="selectionBounds"
              aria-hidden="true"
            ></span>
          </div>
        </div>
      </div>
      <div class="preview-workspace__inspector-column">
        <ComponentInspector :selection="inspectorSelection" />
        <footer class="preview-export-action">
          <p>Export the current tokens and components</p>
          <DcButton class="export-css-button" variant="primary" size="medium" @click="emit('export')"><Download :size="16" aria-hidden="true" />Export CSS</DcButton>
        </footer>
      </div>
    </div>
    <div ref="portalRoot" class="ds-portal-root ds-theme" :style="previewVariables" data-ds-portal-root></div>
  </section>
</template>
