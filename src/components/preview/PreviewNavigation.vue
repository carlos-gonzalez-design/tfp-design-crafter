<script setup>
const props = defineProps({
  modelValue: { type: String, required: true },
  categories: { type: Array, required: true },
})

const emit = defineEmits(['update:modelValue'])

function activate(category) {
  emit('update:modelValue', category.id)
}

function handleKeydown(event, index) {
  const supportedKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (!supportedKeys.includes(event.key)) return

  event.preventDefault()
  let nextIndex = index
  if (event.key === 'ArrowRight') nextIndex = (index + 1) % props.categories.length
  if (event.key === 'ArrowLeft') nextIndex = (index - 1 + props.categories.length) % props.categories.length
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = props.categories.length - 1

  activate(props.categories[nextIndex])
  event.currentTarget.parentElement.children[nextIndex]?.focus()
}
</script>

<template>
  <div class="dc-preview-tabs__list" role="tablist" aria-label="Preview categories">
    <button
      v-for="(category, index) in categories"
      :id="`playground-tab-${category.id}`"
      :key="category.id"
      class="dc-preview-tabs__trigger"
      type="button"
      role="tab"
      aria-controls="playground-panel"
      :aria-selected="modelValue === category.id"
      :data-state="modelValue === category.id ? 'active' : 'inactive'"
      :tabindex="modelValue === category.id ? 0 : -1"
      @click="activate(category)"
      @keydown="handleKeydown($event, index)"
    >{{ category.label }}</button>
  </div>
</template>
