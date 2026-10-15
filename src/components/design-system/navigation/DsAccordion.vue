<script setup>
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'

defineProps({ items: { type: Array, required: true }, defaultValue: { type: String, default: '' } })
</script>

<template>
  <AccordionRoot class="ds-accordion" type="single" :default-value="defaultValue" collapsible data-ds-component="DsAccordion">
    <AccordionItem v-for="item in items" :key="item.value" class="ds-accordion__item" :value="item.value" :disabled="item.disabled">
      <AccordionHeader class="ds-accordion__header">
        <AccordionTrigger class="ds-accordion__trigger"><span>{{ item.label }}</span><span class="ds-accordion__icon" aria-hidden="true">＋</span></AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="ds-accordion__content"><div>{{ item.content }}</div></AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
