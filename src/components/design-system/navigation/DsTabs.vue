<script setup>
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

defineProps({
  modelValue: { type: String, required: true },
  tabs: { type: Array, required: true },
  label: { type: String, default: 'Tabs' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <TabsRoot class="ds-tabs" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <TabsList class="ds-tabs__list" :aria-label="label">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        class="ds-tabs__trigger"
        :value="tab.value"
        :disabled="tab.disabled"
      >{{ tab.label }}</TabsTrigger>
    </TabsList>
    <TabsContent v-for="tab in tabs" :key="tab.value" class="ds-tabs__content" :value="tab.value">
      <slot :name="`panel-${tab.value}`" :tab="tab">{{ tab.content }}</slot>
    </TabsContent>
  </TabsRoot>
</template>
