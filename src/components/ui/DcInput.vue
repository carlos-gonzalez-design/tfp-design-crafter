<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  id: { type: String, required: true },
  placeholder: { type: String, default: '' },
  helper: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="dc-field" :class="{ 'dc-field--error': error }">
    <label class="dc-field__label" :for="id">{{ label }}</label>
    <div class="dc-field__control">
      <input
        :id="id"
        class="dc-field__input"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="helper || error ? `${id}-message` : undefined"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <span v-if="helper || error" :id="`${id}-message`" class="dc-field__helper">{{ error || helper }}</span>
  </div>
</template>
