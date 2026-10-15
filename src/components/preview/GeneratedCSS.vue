<script setup>
import { computed } from 'vue'

const props = defineProps({
  cssVariables: { type: Object, required: true },
})

const generatedCss = computed(() => {
  const declarations = Object.entries(props.cssVariables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  return `.ds-preview {\n${declarations}\n}`
})
</script>

<template>
  <section class="generated-css" aria-labelledby="generated-css-title">
    <div class="generated-css__heading">
      <div>
        <p class="eyebrow">Token output</p>
        <h2 id="generated-css-title" class="generated-css__title">Generated CSS</h2>
      </div>
      <span class="generated-css__format">CSS</span>
    </div>
    <pre class="generated-css__code"><code>{{ generatedCss }}</code></pre>
  </section>
</template>
