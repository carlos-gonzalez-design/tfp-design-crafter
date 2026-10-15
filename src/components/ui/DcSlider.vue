<script setup>
import { computed } from 'vue'
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'reka-ui'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  label: { type: String, required: true },
  unit: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
})
const emit = defineEmits(['update:modelValue', 'valueCommit'])
// Keep the dashboard's numeric model; Reka's single thumb uses an array.
const sliderValue = computed(() => [props.modelValue])
function emitNumber(event, values) {
  if (Array.isArray(values) && Number.isFinite(values[0])) {
    emit(event, values[0])
  }
}
</script>

<template>
  <SliderRoot
    class="dc-slider"
    :model-value="sliderValue"
    :min="min" :max="max" :step="step" :disabled="disabled" :name="name"
    @update:model-value="emitNumber('update:modelValue', $event)"
    @value-commit="emitNumber('valueCommit', $event)"
  >
    <SliderTrack class="dc-slider__track">
      <SliderRange class="dc-slider__range" />
    </SliderTrack>
    <SliderThumb class="dc-slider__thumb" :aria-label="label" :aria-valuetext="`${modelValue}${unit}`" />
  </SliderRoot>
</template>
