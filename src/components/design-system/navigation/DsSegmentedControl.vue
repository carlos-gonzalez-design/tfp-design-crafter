<script setup>
import DsToggleGroup from '../actions/DsToggleGroup.vue'

defineProps({ modelValue: { type: String, default: '' }, items: { type: Array, required: true }, label: { type: String, default: 'View' } })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="ds-segmented-control" data-ds-component="DsSegmentedControl">
    <DsToggleGroup :model-value="modelValue" :items="items" :label="label" @update:model-value="emit('update:modelValue', $event)" />
  </div>
</template>
