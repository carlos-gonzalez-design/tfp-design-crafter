<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, required: true },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  describedby: { type: String, default: undefined },
  rows: { type: Number, default: 4 },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <textarea
    :id="id"
    class="ds-textarea"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedby"
    data-ds-component="DsTextarea"
    @input="emit('update:modelValue', $event.target.value)"
  ></textarea>
</template>
