<script setup>
const props = defineProps({
  modelValue: { type: String, required: true },
  tabs: { type: Array, required: true },
  label: { type: String, default: 'Tabs' },
})
const emit = defineEmits(['update:modelValue'])

function handleKeydown(event, index) {
  const supported = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (!supported.includes(event.key)) return
  event.preventDefault()
  let next = index
  if (event.key === 'ArrowRight') next = (index + 1) % props.tabs.length
  if (event.key === 'ArrowLeft') next = (index - 1 + props.tabs.length) % props.tabs.length
  if (event.key === 'Home') next = 0
  if (event.key === 'End') next = props.tabs.length - 1
  emit('update:modelValue', props.tabs[next].value)
  event.currentTarget.parentElement.children[next].focus()
}
</script>

<template>
  <div class="dc-tabs">
    <div class="dc-tabs__list" role="tablist" :aria-label="label">
      <button
        v-for="(tab, index) in tabs"
        :id="`dc-tab-${tab.value}`"
        :key="tab.value"
        class="dc-tabs__tab"
        :class="{ 'dc-tabs__tab--active': modelValue === tab.value }"
        type="button"
        role="tab"
        :aria-selected="modelValue === tab.value"
        :aria-controls="`dc-panel-${tab.value}`"
        :tabindex="modelValue === tab.value ? 0 : -1"
        @click="emit('update:modelValue', tab.value)"
        @keydown="handleKeydown($event, index)"
      >{{ tab.label }}</button>
    </div>
    <div :id="`dc-panel-${modelValue}`" class="dc-tabs__panel" role="tabpanel" :aria-labelledby="`dc-tab-${modelValue}`">
      <slot :active-tab="modelValue" />
    </div>
  </div>
</template>
