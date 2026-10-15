<script setup>
const props = defineProps({
  variant: { type: String, default: 'body', validator: value => ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body-large', 'body', 'small', 'label', 'caption', 'link', 'blockquote'].includes(value) },
  href: { type: String, default: undefined },
})
const elements = {
  display: 'p', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  'body-large': 'p', body: 'p', small: 'p', label: 'span', caption: 'p', link: 'a', blockquote: 'blockquote',
}
</script>

<template>
  <component
    :is="elements[props.variant]"
    class="ds-typography"
    :class="`ds-typography--${variant}`"
    :href="variant === 'link' ? href : undefined"
    data-ds-component="DsTypography"
    :data-ds-variant="variant"
  ><slot /></component>
</template>
