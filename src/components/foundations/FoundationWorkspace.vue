<script setup>
import { computed, ref, watch } from 'vue'
import DcButton from '../ui/DcButton.vue'
import DcInput from '../ui/DcInput.vue'
import DcSelect from '../ui/DcSelect.vue'
import DcTabs from '../ui/DcTabs.vue'
import GeneratedCSS from '../preview/GeneratedCSS.vue'
import DsButton from '../design-system/actions/DsButton.vue'
import DsCard from '../design-system/cards/DsCard.vue'
import DsInput from '../design-system/forms/DsInput.vue'
import {
  DENSITY_CONFIG,
  getAvailableFontWeights,
  getAppliedSpacing,
  getDesignTokenLevel,
  getFoundationTokens,
  getRadiusDecision,
  getTypographyScale,
  getTypographySemanticScale,
  RADIUS_OPTIONS,
  SPACING_SCALE,
  TYPE_BASE_SIZE_MAX,
  TYPE_BASE_SIZE_MIN,
  TYPE_SCALE_RATIOS,
  TYPE_SEMANTIC_TOKENS,
} from '../../utils/designTokens.js'
import { EDITOR_TABS, FOUNDATION_SECTIONS } from '../../utils/foundationConfig.js'

const props = defineProps({
  foundations: { type: Object, required: true },
  cssVariables: { type: Object, required: true },
  activeFoundation: { type: String, required: true },
})

const activeTab = ref('edit')
const showFullCss = ref(false)
const baseSizeDraft = ref(String(props.foundations.typography.baseSize))
const baseSizeError = ref('')
const sampleText = ref('Design for every scale.')
const selectedSemantic = ref('h1')
const fontOptions = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Trebuchet MS', sans-serif", label: 'Trebuchet MS' },
]
const colorFields = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'background', label: 'Background' },
  { key: 'surface', label: 'Surface' },
  { key: 'text', label: 'Text' },
]
const radiusCategories = Object.entries(RADIUS_OPTIONS).map(([id, definition]) => ({ id, ...definition }))
const densityOptions = Object.keys(DENSITY_CONFIG).map(value => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}))
const appliedSpacingFields = [
  { key: 'cardPadding', label: 'Card padding' },
  { key: 'cardContentGap', label: 'Card content gap' },
  { key: 'cardImageGap', label: 'Image / content gap' },
  { key: 'cardActionsGap', label: 'Content / actions gap' },
  { key: 'buttonGroupGap', label: 'Button group gap' },
]
const largestSpacing = Math.max(...SPACING_SCALE.map(token => token.value), 1)
const semanticFields = Object.entries(TYPE_SEMANTIC_TOKENS).map(([key, definition]) => ({ key, ...definition }))

const activeSection = computed(() => FOUNDATION_SECTIONS.find(section => section.id === props.activeFoundation) ?? FOUNDATION_SECTIONS[0])
const appliedSpacing = computed(() => {
  const assignments = getAppliedSpacing(props.foundations.spacing.density)
  return appliedSpacingFields.map(field => ({ ...field, ...assignments[field.key] }))
})
const typeScale = computed(() => getTypographyScale(props.foundations.typography))
const semanticType = computed(() => getTypographySemanticScale(props.foundations.typography))
const typeTokenOptions = computed(() => typeScale.value.map(token => ({
  value: token.name,
  label: `${token.name} · ${token.remValue}`,
})))
const fontWeightOptions = computed(() => getAvailableFontWeights(props.foundations.typography.fontFamily).map(weight => ({
  value: weight,
  label: weight,
})))
const selectedSemanticField = computed(() => semanticFields.find(field => field.key === selectedSemantic.value))
const foundationTokens = computed(() => getFoundationTokens(props.cssVariables, props.activeFoundation))
const visibleCodeTokens = computed(() => showFullCss.value ? props.cssVariables : foundationTokens.value)
function resolveTokenValue(name, visited = new Set()) {
  if (visited.has(name)) return props.cssVariables[name]
  visited.add(name)
  const value = props.cssVariables[name]
  const reference = typeof value === 'string' ? value.match(/^var\((--[^)]+)\)$/)?.[1] : null
  return reference ? resolveTokenValue(reference, visited) : value
}

function tokenUnit(value) {
  return String(value).trim().match(/(?:\d|\.)([a-z%]+)$/i)?.[1] ?? '—'
}

const tokenRows = computed(() => Object.entries(foundationTokens.value).map(([name, value]) => {
  const effective = resolveTokenValue(name)
  return {
    name,
    value,
    reference: typeof value === 'string' ? value.match(/var\((--[^)]+)\)/)?.[1] ?? 'Direct value' : 'Direct value',
    level: getDesignTokenLevel(name),
    effective,
    unit: tokenUnit(effective),
  }
}))
const tokenGroups = computed(() => {
  if (props.activeFoundation === 'radius') {
    return ['Primitive', 'Semantic', 'Component'].map(level => ({
      id: level.toLowerCase(),
      label: `${level} tokens`,
      rows: tokenRows.value.filter(token => token.level === level),
    })).filter(group => group.rows.length)
  }
  if (props.activeFoundation !== 'typography') return [{ id: props.activeFoundation, label: '', rows: tokenRows.value }]

  return [
    { id: 'configuration', label: 'Configuration', rows: tokenRows.value.filter(token => /^--ds-font-(?:family|base-size|scale-)/.test(token.name)) },
    { id: 'primitive', label: 'Primitive size tokens', rows: tokenRows.value.filter(token => token.name.startsWith('--ds-font-size-')) },
    { id: 'semantic', label: 'Semantic text tokens', rows: tokenRows.value.filter(token => token.name.startsWith('--ds-text-')) },
  ].filter(group => group.rows.length)
})

watch(() => props.activeFoundation, () => {
  showFullCss.value = false
})

watch(() => props.foundations.typography.baseSize, value => {
  baseSizeDraft.value = String(value)
})

function updateBaseSize(event) {
  baseSizeDraft.value = event.target.value
  const value = Number(event.target.value)
  const valid = event.target.value !== ''
    && Number.isFinite(value)
    && value >= TYPE_BASE_SIZE_MIN
    && value <= TYPE_BASE_SIZE_MAX

  if (!valid) {
    baseSizeError.value = `Enter a value from ${TYPE_BASE_SIZE_MIN} to ${TYPE_BASE_SIZE_MAX}px.`
    return
  }

  baseSizeError.value = ''
  props.foundations.typography.baseSize = value
}

function commitBaseSize() {
  if (!baseSizeError.value) return
  baseSizeDraft.value = String(props.foundations.typography.baseSize)
  baseSizeError.value = ''
}

function updateFontFamily(fontFamily) {
  props.foundations.typography.fontFamily = fontFamily
  const availableWeights = getAvailableFontWeights(fontFamily)

  for (const style of Object.values(props.foundations.typography.semanticStyles)) {
    if (availableWeights.includes(style.weight)) continue
    style.weight = availableWeights.reduce((closest, option) => (
      Math.abs(Number(option) - Number(style.weight)) < Math.abs(Number(closest) - Number(style.weight)) ? option : closest
    ))
  }
}

function selectRadiusOption(category, option) {
  props.foundations.radius[category] = option
}

function navigateRadiusOptions(event, category, index) {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const options = RADIUS_OPTIONS[category].options
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? options.length - 1
      : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + options.length) % options.length
  selectRadiusOption(category, options[nextIndex].id)
  event.currentTarget.parentElement.children[nextIndex]?.focus()
}
</script>

<template>
  <section class="foundation-workspace" :aria-labelledby="`foundation-${activeSection.id}-title`">
    <header class="foundation-workspace__header">
      <div>
        <p class="eyebrow">Foundation editor</p>
        <h2 :id="`foundation-${activeSection.id}-title`" class="foundation-workspace__title">{{ activeSection.label }}</h2>
        <p class="foundation-workspace__description">{{ activeSection.description }}</p>
      </div>
    </header>

    <DcTabs v-model="activeTab" class="foundation-workspace__tabs" :tabs="EDITOR_TABS" :label="`${activeSection.label} editor views`">
      <template #default="{ activeTab: currentTab }">
        <div v-if="currentTab === 'edit'" class="foundation-editor">
          <template v-if="activeFoundation === 'colors'">
            <section class="foundation-settings__section foundation-settings__section--wide" aria-labelledby="colors-settings-title">
              <div class="foundation-settings__heading">
                <div><h3 id="colors-settings-title">System palette</h3><p>Choose the five colors used to generate component surfaces, content and accents.</p></div>
                <span>5 tokens</span>
              </div>
              <div class="foundation-color-grid">
                <label v-for="field in colorFields" :key="field.key" class="foundation-color-control">
                  <span class="foundation-color-control__swatch" :style="{ backgroundColor: foundations.colors[field.key] }" aria-hidden="true"></span>
                  <span class="foundation-color-control__meta"><strong>{{ field.label }}</strong><code>--ds-color-{{ field.key }}</code></span>
                  <span class="foundation-color-control__value">{{ foundations.colors[field.key] }}</span>
                  <input v-model="foundations.colors[field.key]" type="color" :aria-label="`${field.label} color`" />
                </label>
              </div>
            </section>
          </template>

          <template v-else-if="activeFoundation === 'typography'">
            <div class="foundation-settings-grid foundation-settings-grid--typography">
              <section class="foundation-settings__section" aria-labelledby="type-settings-title">
                <div class="foundation-settings__heading"><div><h3 id="type-settings-title">Scale settings</h3><p>Build a predictable type scale from one base size and modular ratio.</p></div></div>
                <div class="foundation-controls foundation-controls--workspace">
                  <label class="control-row control-row--stacked">
                    <span class="control-row__label">Font family</span>
                    <DcSelect :model-value="foundations.typography.fontFamily" :options="fontOptions" label="Font family" @update:model-value="updateFontFamily" />
                  </label>
                  <label class="control-row control-row--stacked" for="type-base-size">
                    <span class="control-row__label">Base font size</span>
                    <span class="type-base-size" :class="{ 'type-base-size--error': baseSizeError }">
                      <input
                        id="type-base-size"
                        :value="baseSizeDraft"
                        type="number"
                        inputmode="decimal"
                        :min="TYPE_BASE_SIZE_MIN"
                        :max="TYPE_BASE_SIZE_MAX"
                        step="0.5"
                        aria-describedby="type-base-size-help"
                        :aria-invalid="baseSizeError ? 'true' : undefined"
                        @input="updateBaseSize"
                        @blur="commitBaseSize"
                      />
                      <span aria-hidden="true">px</span>
                    </span>
                    <small id="type-base-size-help" class="type-base-size__help" aria-live="polite">{{ baseSizeError || `From ${TYPE_BASE_SIZE_MIN} to ${TYPE_BASE_SIZE_MAX}px.` }}</small>
                  </label>
                  <fieldset class="type-option-group">
                    <legend>Scale ratio</legend>
                    <div class="type-ratio-grid" role="radiogroup" aria-label="Typography scale ratio">
                      <button v-for="option in TYPE_SCALE_RATIOS" :key="option.value" class="type-ratio-grid__option" type="button" role="radio" :aria-checked="foundations.typography.scaleRatio === option.value" :class="{ 'type-ratio-grid__option--active': foundations.typography.scaleRatio === option.value }" @click="foundations.typography.scaleRatio = option.value"><strong>{{ option.label }}</strong><span>{{ option.value }}</span></button>
                    </div>
                  </fieldset>
                </div>
              </section>
              <section class="foundation-settings__section" aria-labelledby="type-scale-title">
                <div class="foundation-settings__heading"><div><h3 id="type-scale-title">Generated scale</h3><p>Each value uses base × ratio<sup>step</sup> and exports with up to four rem decimals.</p></div><span>{{ typeScale.length }} tokens</span></div>
                <DcInput v-model="sampleText" class="type-scale-sample-input" id="type-scale-sample" label="Sample text" helper="Preview the same phrase at every generated size." />
                <ol class="type-scale-preview">
                  <li v-for="token in typeScale" :key="token.step" :class="{ 'type-scale-preview__item--base': token.name === 'base' }">
                    <div class="type-scale-preview__meta">
                      <span><code>{{ token.name }}</code><small v-if="token.name === 'base'">Base</small></span>
                      <output>{{ token.remValue }}</output>
                    </div>
                    <div class="type-scale-preview__sample"><span :style="{ fontFamily: foundations.typography.fontFamily, fontSize: token.remValue }">{{ sampleText || 'Sample text' }}</span></div>
                  </li>
                </ol>
              </section>
              <section class="foundation-settings__section foundation-settings__section--wide type-semantics" aria-labelledby="type-semantics-title">
                <div class="foundation-settings__heading"><div><h3 id="type-semantics-title">Semantic styles</h3><p>Select a style, then assign one generated size and an available font weight.</p></div></div>
                <div class="semantic-style-list" role="listbox" aria-label="Semantic typography styles">
                  <button
                    v-for="field in semanticFields"
                    :key="field.key"
                    class="semantic-style-card"
                    :class="{ 'semantic-style-card--selected': selectedSemantic === field.key }"
                    type="button"
                    role="option"
                    :aria-selected="selectedSemantic === field.key"
                    @click="selectedSemantic = field.key"
                  >
                    <span class="semantic-style-card__heading"><strong>{{ field.label }}</strong><code>{{ semanticType[field.key].weight }}</code></span>
                    <span class="semantic-style-card__sample" :style="{ fontFamily: foundations.typography.fontFamily, fontSize: semanticType[field.key].remValue, fontWeight: semanticType[field.key].weight }">Ag</span>
                    <span class="semantic-style-card__meta"><code>{{ semanticType[field.key].name }}</code><output>{{ semanticType[field.key].remValue }}</output></span>
                  </button>
                </div>
                <div class="semantic-style-editor" :aria-labelledby="`semantic-editor-${selectedSemantic}`">
                  <div class="semantic-style-editor__heading"><div><p class="eyebrow">Selected style</p><h4 :id="`semantic-editor-${selectedSemantic}`">{{ selectedSemanticField.label }}</h4></div><code>--ds-text-{{ selectedSemanticField.cssName }}</code></div>
                  <div class="semantic-style-editor__controls">
                    <label class="control-row control-row--stacked">
                      <span class="control-row__label">Font size</span>
                      <DcSelect v-model="foundations.typography.semanticStyles[selectedSemantic].size" :options="typeTokenOptions" :label="`${selectedSemanticField.label} font size`" />
                    </label>
                    <label class="control-row control-row--stacked">
                      <span class="control-row__label">Font weight</span>
                      <DcSelect v-model="foundations.typography.semanticStyles[selectedSemantic].weight" :options="fontWeightOptions" :label="`${selectedSemanticField.label} font weight`" />
                    </label>
                  </div>
                </div>
              </section>
            </div>
          </template>

          <template v-else-if="activeFoundation === 'spacing'">
            <div class="foundation-settings-grid foundation-settings-grid--spacing">
              <section class="foundation-settings__section foundation-settings__section--scale" aria-labelledby="spacing-scale-title">
                <div class="foundation-settings__heading"><div><h3 id="spacing-scale-title">Spacing scale</h3><p>Stable primitives available to generated components.</p></div><span>11 tokens</span></div>
                <ol class="spacing-scale-preview__list">
                  <li v-for="token in SPACING_SCALE" :key="token.name" class="spacing-scale-preview__item">
                    <code>space-{{ token.name }}</code>
                    <span class="spacing-scale-preview__track" aria-hidden="true"><span :class="{ 'spacing-scale-preview__bar--zero': token.value === 0 }" :style="{ width: `${token.value / largestSpacing * 100}%` }"></span></span>
                    <output>{{ token.value }}px</output>
                  </li>
                </ol>
              </section>
              <section class="foundation-settings__section" aria-labelledby="spacing-density-title">
                <div class="foundation-settings__heading"><div><h3 id="spacing-density-title">Component density</h3><p id="spacing-density-help">Adjusts spacing only in compatible components.</p></div></div>
                <div class="spacing-density" role="radiogroup" aria-label="Component density" aria-describedby="spacing-density-help">
                  <button v-for="option in densityOptions" :key="option.value" class="spacing-density__option" :class="{ 'spacing-density__option--active': foundations.spacing.density === option.value }" type="button" role="radio" :aria-checked="foundations.spacing.density === option.value" @click="foundations.spacing.density = option.value">{{ option.label }}</button>
                </div>
              </section>
              <section class="foundation-settings__section" aria-labelledby="applied-spacing-title">
                <div class="foundation-settings__heading"><div><h3 id="applied-spacing-title">Applied spacing</h3><p>Semantic assignments for the selected density.</p></div></div>
                <dl class="applied-spacing__list">
                  <div v-for="item in appliedSpacing" :key="item.key" class="applied-spacing__item"><dt>{{ item.label }}</dt><dd><code>space-{{ item.token }}</code><output>{{ item.value }}px</output></dd></div>
                </dl>
              </section>
            </div>
          </template>

          <template v-else>
            <div class="foundation-settings-grid foundation-settings-grid--radius">
              <section
                v-for="category in radiusCategories"
                :key="category.id"
                class="foundation-settings__section radius-decision"
                :aria-labelledby="`radius-${category.id}-title`"
              >
                <div class="foundation-settings__heading">
                  <div><h3 :id="`radius-${category.id}-title`">{{ category.label }}</h3><p :id="`radius-${category.id}-help`">{{ category.description }}</p></div>
                  <span>{{ getRadiusDecision(foundations.radius, category.id).value }}px</span>
                </div>
                <div class="radius-choice-grid" role="radiogroup" :aria-label="category.label" :aria-describedby="`radius-${category.id}-help`">
                  <button
                    v-for="(option, index) in category.options"
                    :key="option.id"
                    class="radius-choice"
                    :class="[`radius-choice--${category.id}`, { 'radius-choice--selected': foundations.radius[category.id] === option.id }]"
                    type="button"
                    role="radio"
                    :aria-checked="foundations.radius[category.id] === option.id"
                    :tabindex="foundations.radius[category.id] === option.id ? 0 : -1"
                    @click="selectRadiusOption(category.id, option.id)"
                    @keydown="navigateRadiusOptions($event, category.id, index)"
                  >
                    <span class="radius-choice__sample" :style="{ borderRadius: `${option.value}px` }" aria-hidden="true">
                      <span v-if="category.id === 'input'"></span>
                    </span>
                    <span class="radius-choice__copy"><strong>{{ option.label }}</strong><code>{{ option.value }}px</code></span>
                    <span class="radius-choice__indicator" aria-hidden="true">{{ foundations.radius[category.id] === option.id ? '✓' : '' }}</span>
                  </button>
                </div>
              </section>
              <section class="foundation-settings__section foundation-settings__section--wide" aria-labelledby="radius-live-preview-title">
                <div class="foundation-settings__heading"><div><h3 id="radius-live-preview-title">Live Shape Preview</h3><p>Real Design System components rendered from the current radius tokens.</p></div><span>3 components</span></div>
                <div class="radius-live-preview ds-theme" :style="cssVariables">
                  <div><span>Button</span><DsButton>Continue</DsButton></div>
                  <div><span>Card</span><DsCard title="Project summary" description="A live surface using the selected card treatment." /></div>
                  <div><span>Input</span><label class="sr-only" for="radius-preview-input">Radius input preview</label><DsInput id="radius-preview-input" model-value="Design token" /></div>
                </div>
              </section>
            </div>
          </template>
        </div>

        <section v-else-if="currentTab === 'tokens'" class="foundation-tokens" aria-labelledby="foundation-tokens-title">
          <div class="foundation-tokens__intro"><div><h3 id="foundation-tokens-title">{{ activeSection.label }} tokens</h3><p>Live values derived from the same source used by Preview and generated CSS.</p></div><span>{{ tokenRows.length }} tokens</span></div>
          <p class="foundation-tokens__notice">Token names are read-only to keep CSS references synchronized.</p>
          <div class="foundation-tokens__table-wrap">
            <table class="foundation-tokens__table" :class="{ 'foundation-tokens__table--radius': activeFoundation === 'radius' }">
              <thead>
                <tr v-if="activeFoundation === 'radius'"><th scope="col">Token</th><th scope="col">Level</th><th scope="col">Reference</th><th scope="col">Effective value</th><th scope="col">Unit</th></tr>
                <tr v-else><th scope="col">Token</th><th scope="col">Current value</th><th scope="col">Reference</th></tr>
              </thead>
              <tbody>
                <template v-for="group in tokenGroups" :key="group.id">
                  <tr v-if="group.label" class="foundation-tokens__group"><th :colspan="activeFoundation === 'radius' ? 5 : 3" scope="colgroup">{{ group.label }}</th></tr>
                  <tr v-for="token in group.rows" :key="token.name">
                    <th scope="row"><code>{{ token.name }}</code></th>
                    <template v-if="activeFoundation === 'radius'">
                      <td>{{ token.level }}</td><td><code>{{ token.reference }}</code></td><td><code>{{ token.effective }}</code></td><td>{{ token.unit }}</td>
                    </template>
                    <template v-else>
                      <td><span v-if="activeFoundation === 'colors' && token.value.startsWith('#')" class="foundation-tokens__swatch" :style="{ backgroundColor: token.value }" aria-hidden="true"></span><code>{{ token.value }}</code></td><td>{{ token.reference }}</td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </section>

        <section v-else class="foundation-code" aria-labelledby="foundation-code-title">
          <div class="foundation-code__intro">
            <div><h3 id="foundation-code-title">{{ showFullCss ? 'Complete design system CSS' : `${activeSection.label} CSS` }}</h3><p>The output stays synchronized with the current Vue state.</p></div>
            <DcButton variant="secondary" size="small" @click="showFullCss = !showFullCss">{{ showFullCss ? 'Show foundation CSS' : 'Show all CSS' }}</DcButton>
          </div>
          <GeneratedCSS :css-variables="visibleCodeTokens" />
        </section>
      </template>
    </DcTabs>
  </section>
</template>
