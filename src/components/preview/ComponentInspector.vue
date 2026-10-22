<script setup>
import { computed } from 'vue'
import TokenValueDisplay from '../ui/TokenValueDisplay.vue'
import { COMPONENT_SIZES, COMPONENT_VARIANTS, INSPECTOR_TOKEN_CATEGORIES } from '../../utils/componentInspector.js'

const props = defineProps({ selection: { type: Object, default: null } })
const emit = defineEmits(['change'])
const variants = computed(() => props.selection ? COMPONENT_VARIANTS[props.selection.component] ?? [] : [])
const sizes = computed(() => props.selection ? COMPONENT_SIZES[props.selection.component] ?? [] : [])
const tokenGroups = computed(() => INSPECTOR_TOKEN_CATEGORIES.map(category => ({
  ...category,
  tokens: props.selection?.tokens.filter(token => token.category === category.id) ?? [],
})).filter(group => group.tokens.length))
</script>

<template>
  <aside class="component-inspector" aria-labelledby="component-inspector-title">
    <div class="component-inspector__heading">
      <div>
        <p class="eyebrow">Component inspector</p>
        <h3 id="component-inspector-title">{{ selection?.component || 'Select a component' }}</h3>
      </div>
      <span v-if="selection?.connected" class="component-inspector__status"><span aria-hidden="true"></span> Connected</span>
    </div>
    <p v-if="!selection" class="component-inspector__empty">Click or focus any component inside the Preview Canvas to inspect its current state and token values.</p>
    <template v-else>
      <dl class="component-inspector__metadata">
        <div><dt>Variant</dt><dd>{{ selection.variant }}</dd></div>
        <div><dt>Size</dt><dd>{{ selection.size }}</dd></div>
        <div><dt>State</dt><dd>{{ selection.state }}</dd></div>
      </dl>
      <div v-if="variants.length || sizes.length" class="component-inspector__controls">
        <label v-if="variants.length">
          <span>Variant</span>
          <select class="component-inspector__select" :value="selection.variant" @change="emit('change', { property: 'variant', value: $event.target.value })">
            <option v-for="variant in variants" :key="variant" :value="variant">{{ variant }}</option>
          </select>
        </label>
        <label v-if="sizes.length">
          <span>Size</span>
          <select class="component-inspector__select" :value="selection.size" @change="emit('change', { property: 'size', value: $event.target.value })">
            <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
          </select>
        </label>
      </div>
      <div class="component-inspector__tokens">
        <h4>Associated tokens</h4>
        <details v-for="group in tokenGroups" :key="group.id" class="component-inspector__token-group" open>
          <summary><span>{{ group.label }}</span><span>{{ group.tokens.length }}</span></summary>
          <ul>
            <li
              v-for="token in group.tokens"
              :key="token.name"
              class="component-inspector__token"
              :class="{ 'component-inspector__token--color': token.category === 'color' }"
            >
              <div class="component-inspector__token-copy">
                <code>{{ token.name }}</code>
                <TokenValueDisplay :value="token.cssValue" :resolved-value="token.value" :color="token.category === 'color' ? token.swatch : ''" />
                <dl v-if="token.category === 'radius'" class="component-inspector__token-details">
                  <div><dt>Reference</dt><dd><code>{{ token.reference }}</code></dd></div>
                  <div><dt>Computed</dt><dd>{{ token.value }}</dd></div>
                  <div><dt>Shape</dt><dd>{{ token.shape }}</dd></div>
                </dl>
              </div>
            </li>
          </ul>
        </details>
      </div>
    </template>
  </aside>
</template>
