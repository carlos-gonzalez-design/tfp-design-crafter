<script setup>
import { CircleAlert, CircleCheck, Info, TriangleAlert } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps({ title: { type: String, required: true }, variant: { type: String, default: 'info', validator: value => ['info', 'success', 'warning', 'danger'].includes(value) } })
const icons = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert }
const alertIcon = computed(() => icons[props.variant])
</script>

<template>
  <div class="ds-alert" :class="`ds-alert--${variant}`" role="status" data-ds-component="DsAlert" :data-ds-variant="variant">
    <span class="ds-alert__icon" aria-hidden="true"><component :is="alertIcon" :size="15" /></span>
    <div><strong>{{ title }}</strong><div class="ds-alert__body"><slot /></div></div>
  </div>
</template>
