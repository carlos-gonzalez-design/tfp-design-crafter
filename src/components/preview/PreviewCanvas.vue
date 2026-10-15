<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'
import DcButton from '../ui/DcButton.vue'
import { DS_PORTAL_ROOT } from '../design-system/dsContext.js'
import PlaygroundActions from '../playground/PlaygroundActions.vue'
import PlaygroundCards from '../playground/PlaygroundCards.vue'
import PlaygroundFeedback from '../playground/PlaygroundFeedback.vue'
import PlaygroundForms from '../playground/PlaygroundForms.vue'
import PlaygroundNavigation from '../playground/PlaygroundNavigation.vue'
import PlaygroundOverview from '../playground/PlaygroundOverview.vue'
import PlaygroundTypography from '../playground/PlaygroundTypography.vue'
import { PLAYGROUND_CATEGORIES } from '../playground/componentCatalog.js'
import {
  COMPONENT_SIZES,
  COMPONENT_TOKEN_MAP,
  COMPONENT_VARIANTS,
  DEFAULT_INSPECTOR_TOKENS,
  getInspectorTokenCategory,
  getRadiusShapeLabel,
} from '../../utils/componentInspector.js'
import ComponentInspector from './ComponentInspector.vue'
import PreviewNavigation from './PreviewNavigation.vue'

const props = defineProps({
  cssVariables: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits(['expand', 'collapse'])

const activeCategory = ref('typography')
const previewCanvas = ref(null)
const portalRoot = ref(null)
const inspectedElement = shallowRef(null)
const inspectorSelection = ref(null)
const selectionBounds = ref(null)
const categoryScrollPositions = new Map()
const categorySelections = new Map()
let selectionResizeObserver = null
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

function readSelection(element) {
  const component = element.dataset.dsComponent
  const style = getComputedStyle(element)
  const tokenNames = COMPONENT_TOKEN_MAP[component] ?? DEFAULT_INSPECTOR_TOKENS
  return {
    component,
    variant: element.dataset.dsVariant || 'default',
    size: element.dataset.dsSize || 'default',
    state: element.dataset.dsState || element.dataset.state || (element.disabled ? 'disabled' : 'default'),
    connected: element.isConnected,
    tokens: tokenNames.map(name => {
      const category = getInspectorTokenCategory(name)
      const fallback = style.getPropertyValue(name).trim() || '—'
      if (category === 'color') {
        const resolved = resolveColor(element, name)
        return { name, category, value: resolved.value, swatch: resolved.color }
      }
      const source = props.cssVariables[name] ?? fallback
      const value = resolveTokenReference(name, fallback)
      if (category === 'radius') {
        return {
          name,
          category,
          value,
          reference: String(source).match(/var\((--[^)]+)\)/)?.[1] ?? 'Direct value',
          shape: getRadiusShapeLabel(component, value),
        }
      }
      return { name, category, value }
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

function updateInspectedComponent({ property, value }) {
  const element = inspectedElement.value
  const selection = inspectorSelection.value
  if (!element || !selection) return
  const options = property === 'variant' ? COMPONENT_VARIANTS[selection.component] : COMPONENT_SIZES[selection.component]
  if (!options?.includes(value)) return
  const prefix = selection.component === 'DsButton' ? 'ds-button' : selection.component === 'DsCard' ? 'ds-card' : 'ds-badge'
  element.classList.remove(...options.map(option => `${prefix}--${option}`))
  element.classList.add(`${prefix}--${value}`)
  element.dataset[`ds${property.charAt(0).toUpperCase()}${property.slice(1)}`] = value
  refreshSelection()
}

watch(() => props.cssVariables, async () => {
  await nextTick()
  refreshSelection()
}, { deep: true, flush: 'post' })

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
            <span class="preview-area__status"><span></span> Synced</span>
            <DcButton
              class="preview-area__expand-action"
              variant="secondary"
              size="small"
              @click="emit(expanded ? 'collapse' : 'expand')"
            >{{ expanded ? 'Back to Editor' : 'Expand Preview' }}</DcButton>
          </div>
        </div>
        <div class="dc-preview-tabs">
          <PreviewNavigation v-model="activeCategory" :categories="PLAYGROUND_CATEGORIES" />
          <div
            id="playground-panel"
            ref="previewCanvas"
            class="preview-canvas ds-preview ds-theme"
            :style="cssVariables"
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
      <ComponentInspector :selection="inspectorSelection" @change="updateInspectedComponent" />
    </div>
    <div ref="portalRoot" class="ds-portal-root ds-theme" :style="cssVariables" data-ds-portal-root></div>
  </section>
</template>
