<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  id: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  describedby: { type: String, default: undefined },
  icon: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <span class="ds-input-shell" :class="{ 'ds-input-shell--with-icon': icon }">
    <span v-if="icon" class="ds-input-shell__icon" aria-hidden="true">{{ icon }}</span>
    <input
      :id="id"
      class="ds-input"
      :class="{ 'ds-input--invalid': invalid }"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedby"
      data-ds-component="DsInput"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </span>
</template>
