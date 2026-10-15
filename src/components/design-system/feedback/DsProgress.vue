<script setup>
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

defineProps({ value: { type: Number, default: 0 }, max: { type: Number, default: 100 }, label: { type: String, required: true } })
</script>

<template>
  <div class="ds-progress-control" data-ds-component="DsProgress">
    <div class="ds-progress-control__heading"><span>{{ label }}</span><span>{{ value }}%</span></div>
    <ProgressRoot class="ds-progress" :model-value="value" :max="max">
      <svg class="ds-progress__graphic" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
        <ProgressIndicator as="rect" class="ds-progress__indicator" x="0" y="0" :width="Math.max(0, Math.min(100, (value / max) * 100))" height="8" />
      </svg>
    </ProgressRoot>
  </div>
</template>
