<script setup>
import { Plus } from '@lucide/vue'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'

defineProps({ items: { type: Array, required: true }, defaultValue: { type: String, default: '' } })
</script>

<template>
  <AccordionRoot class="ds-accordion" type="single" :default-value="defaultValue" collapsible data-ds-component="DsAccordion">
    <AccordionItem v-for="item in items" :key="item.value" class="ds-accordion__item" :value="item.value" :disabled="item.disabled">
      <AccordionHeader class="ds-accordion__header">
        <AccordionTrigger class="ds-accordion__trigger"><span>{{ item.label }}</span><Plus class="ds-accordion__icon" :size="20" aria-hidden="true" /></AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="ds-accordion__content"><div>{{ item.content }}</div></AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
