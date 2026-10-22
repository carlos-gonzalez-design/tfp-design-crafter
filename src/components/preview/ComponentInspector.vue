<script setup>
import { computed } from 'vue'
import ComponentInspectorToken from './ComponentInspectorToken.vue'
import { INSPECTOR_TOKEN_CATEGORIES } from '../../utils/componentInspector.js'

const props = defineProps({ selection: { type: Object, default: null } })
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
    </div>
    <p v-if="!selection" class="component-inspector__empty">Click or focus any component inside the Preview Canvas to inspect its current state and token values.</p>
    <template v-if="selection">
      <div class="component-inspector__tokens">
        <h4>Associated tokens</h4>
        <section v-for="group in tokenGroups" :key="group.id" class="component-inspector__token-group" :aria-label="group.label">
          <h5>{{ group.label }}</h5>
          <ul>
            <ComponentInspectorToken v-for="token in group.tokens" :key="token.name" :token="token" />
          </ul>
        </section>
      </div>
    </template>
  </aside>
</template>
