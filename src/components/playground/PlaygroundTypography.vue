<script setup>
import DsTypography from '../design-system/core/DsTypography.vue'
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'

const samples = [
  { variant: 'display', label: 'Display', text: 'Ideas deserve room.' },
  { variant: 'h1', label: 'Heading 1', text: 'Make room for good ideas.' },
  { variant: 'h2', label: 'Heading 2', text: 'Build something considered.' },
  { variant: 'h3', label: 'Heading 3', text: 'Every detail matters.' },
  { variant: 'h4', label: 'Heading 4', text: 'A useful section heading.' },
  { variant: 'body-large', label: 'Body Large', text: 'A generous introduction for important supporting content.' },
  { variant: 'body', label: 'Body', text: 'A clear visual language brings your next bright idea into focus.' },
  { variant: 'small', label: 'Small', text: 'Useful supporting information at a quieter scale.' },
  { variant: 'caption', label: 'Caption', text: 'Thoughtful details, consistent at every scale.' },
]
</script>

<template>
  <section class="ds-playground-section" aria-labelledby="playground-typography-title">
    <PlaygroundSectionHeader
      title-id="playground-typography-title"
      title="Typography"
      description="The current semantic type roles, driven directly by the Typography foundation."
    />
    <div class="ds-examples ds-examples--typography">
      <div v-for="sample in samples" :key="sample.variant" class="ds-examples__sample">
        <span class="ds-examples__label">{{ sample.label }}</span>
        <DsTypography :variant="sample.variant">{{ sample.text }}</DsTypography>
      </div>
      <div class="ds-type-compositions">
        <div class="ds-examples__sample"><span class="ds-examples__label">Label and link</span><DsTypography variant="label">Project status</DsTypography><DsTypography variant="link" href="#typography-lists">Read the typography guide</DsTypography></div>
        <div class="ds-examples__sample"><span class="ds-examples__label">Blockquote</span><DsTypography variant="blockquote">A design system turns individual decisions into a shared language.</DsTypography></div>
        <div id="typography-lists" class="ds-type-lists">
          <div><DsTypography variant="label">Unordered list</DsTypography><ul><li>Clear hierarchy</li><li>Reusable tokens</li><li>Accessible interactions</li></ul></div>
          <div><DsTypography variant="label">Ordered list</DsTypography><ol><li>Choose foundations</li><li>Compose components</li><li>Validate the experience</li></ol></div>
        </div>
      </div>
    </div>
  </section>
</template>
