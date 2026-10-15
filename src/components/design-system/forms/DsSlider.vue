<script setup>
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

defineProps({
  modelValue: { type: Array, default: () => [50] },
  label: { type: String, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="ds-slider-control">
    <div class="ds-slider-control__heading"><span>{{ label }}</span><output>{{ modelValue[0] }}</output></div>
    <SliderRoot
      class="ds-slider"
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      data-ds-component="DsSlider"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <SliderTrack class="ds-slider__track"><SliderRange class="ds-slider__range" /></SliderTrack>
      <SliderThumb class="ds-slider__thumb" :aria-label="label" />
    </SliderRoot>
  </div>
</template>
