<script setup>
defineProps({ token: { type: Object, required: true } })
</script>

<template>
  <li class="component-inspector__token" :class="{ 'token-row--calculated': token.formula }">
    <code class="component-inspector__token-name">{{ token.name }}</code>
    <span class="component-inspector__token-value">
      <span v-if="token.category === 'color'" class="component-inspector__swatch" :style="{ backgroundColor: token.swatch }" aria-hidden="true"></span>
      <span>{{ token.resolvedValue || token.value }}</span>
    </span>
    <code v-if="token.formula" class="token-row__formula">{{ token.formula }}</code>
  </li>
</template>
